import prismaClient from '../prisma';
// Importa os Enums gerados automaticamente pelo Prisma.
// Isso garante que o código só aceite valores definidos no banco (ex: "PIZZA", "PIX", "ENTREGA"),
// prevenindo erros de digitação e inconsistência de dados.
import { ProductType, PaymentMethod, DeliveryMethod } from '@prisma/client';

// Define a estrutura de cada item individual que compõe o pedido
interface OrderItemInput {
  productId: string;
  productType: ProductType;
  quantity: number;
}

// Interface de entrada (DTO) atualizada com os novos campos obrigatórios
interface CreateOrderRequest {
  customerId: string;
  items: OrderItemInput[];
  paymentMethod: PaymentMethod;   // Define como o cliente vai pagar
  deliveryMethod: DeliveryMethod; // Define se é entrega ou retirada
}

class CreateOrderService {
  // Método execute: Recebe os dados, incluindo os novos parâmetros de pagamento e entrega
  async execute({ customerId, items, paymentMethod, deliveryMethod }: CreateOrderRequest) {
    
    // Validação Inicial: Garante que os dados mínimos para um pedido existem.
    if (!customerId || !items || items.length === 0) {
      throw new Error("Dados inválidos para o pedido.");
    }

    let totalPrice = 0;
    const orderItemsData: any[] = [];

    // === LÓGICA DE NEGÓCIO: TAXA DE ENTREGA ===
    // Utiliza um operador ternário para decidir o valor da taxa.
    // Se o método for 'ENTREGA', define R$ 10,00. Caso contrário (Retirada/Balcão), é R$ 0,00.
    const deliveryFee = deliveryMethod === DeliveryMethod.ENTREGA ? 10.00 : 0.00;
    
    // Inicializa o preço total do pedido já somando a taxa de entrega definida acima.
    totalPrice += deliveryFee;

    // === BUSCA DE PRODUTOS (Otimização) ===
    // Separa os IDs dos itens solicitados por categoria para buscar no banco.
    const pizzaIds = items.filter(item => item.productType === ProductType.PIZZA).map(item => item.productId);
    const sobremesaIds = items.filter(item => item.productType === ProductType.SOBREMESA).map(item => item.productId);
    const bebidaIds = items.filter(item => item.productType === ProductType.BEBIDA).map(item => item.productId);

    // Realiza as consultas ao banco em paralelo (Promise.all) para ganhar performance.
    // Se não houver itens de uma categoria, retorna um array vazio imediatamente.
    const [pizzas, sobremesas, bebidas] = await Promise.all([
      pizzaIds.length > 0 ? prismaClient.pizza.findMany({ where: { id: { in: pizzaIds } } }) : Promise.resolve([]),
      sobremesaIds.length > 0 ? prismaClient.sobremesa.findMany({ where: { id: { in: sobremesaIds } } }) : Promise.resolve([]),
      bebidaIds.length > 0 ? prismaClient.bebida.findMany({ where: { id: { in: bebidaIds } } }) : Promise.resolve([]),
    ]);

    // Cria um mapa (Map) para acesso rápido (O(1)) aos detalhes dos produtos encontrados.
    // Isso evita ter que varrer arrays repetidamente dentro do loop abaixo.
    const allProductsMap = new Map<string, { name: string; price: number; type: ProductType }>();
    pizzas.forEach(p => allProductsMap.set(p.id, { name: p.name, price: p.price, type: ProductType.PIZZA }));
    sobremesas.forEach(s => allProductsMap.set(s.id, { name: s.name, price: s.price, type: ProductType.SOBREMESA }));
    bebidas.forEach(b => allProductsMap.set(b.id, { name: b.name, price: b.price, type: ProductType.BEBIDA }));
    
    // === PROCESSAMENTO DOS ITENS ===
    // Itera sobre cada item solicitado pelo cliente para montar o pedido
    for (const item of items) {
      const product = allProductsMap.get(item.productId);

      // Se o produto não estiver no mapa, significa que o ID enviado não existe no banco.
      if (!product) throw new Error(`Produto não encontrado.`);
      
      // Captura o preço atual do produto. É importante salvar isso no item do pedido,
      // pois se o preço do produto mudar no futuro, o histórico do pedido antigo não deve ser alterado.
      const productPriceAtOrder = product.price;
      const itemPrice = productPriceAtOrder * item.quantity;

      // Soma o valor deste item ao total do pedido (que já inclui a taxa de entrega).
      totalPrice += itemPrice;

      // Monta o objeto de dados do item para salvar no banco
      const orderItemData: any = {
        quantity: item.quantity,
        productType: item.productType,
        productName: product.name,            // Snapshot do nome
        productPriceAtOrder: productPriceAtOrder, // Snapshot do preço unitário
        itemPrice: itemPrice,                 // Subtotal (preço * qtd)
      };

      // Relaciona o item à tabela específica (FK) baseado no tipo
      if (item.productType === ProductType.PIZZA) orderItemData.pizzaId = item.productId;
      else if (item.productType === ProductType.SOBREMESA) orderItemData.sobremesaId = item.productId;
      else if (item.productType === ProductType.BEBIDA) orderItemData.bebidaId = item.productId;

      // Adiciona à lista de itens que serão criados
      orderItemsData.push(orderItemData);
    }

    // === PERSISTÊNCIA NO BANCO DE DADOS ===
    // Cria o registro na tabela 'Order' com todas as informações consolidadas.
    const order = await prismaClient.order.create({
      data: {
        customerId,
        totalPrice,      // Valor final (Soma dos itens + Taxa)
        deliveryFee,     // Armazena explicitamente o valor cobrado de frete para relatórios futuros
        paymentMethod,   // Registra como foi pago (PIX, Cartão, etc.)
        deliveryMethod,  // Registra se foi Entrega ou Retirada
        
        // Cria os itens relacionados (OrderItems) na mesma transação.
        orderItems: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      // Retorna o objeto criado incluindo os detalhes dos itens
      include: {
        orderItems: true,
      },
    });

    return order;
  }
}

export { CreateOrderService };