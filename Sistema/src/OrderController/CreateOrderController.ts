import { FastifyRequest, FastifyReply } from 'fastify';
// Importa o serviço responsável pela regra de negócio de criar o pedido (salvar no banco, calcular total, etc.)
import { CreateOrderService } from '../OrderService/CreateOrderService';
// Importa os Enums gerados pelo Prisma. Enums são listas de valores fixos (ex: PIX, CREDIT_CARD)
// usados para garantir que apenas valores válidos sejam salvos no banco.
import { PaymentMethod, DeliveryMethod } from '@prisma/client';

// Define a estrutura de cada item do pedido que virá do JSON do frontend
interface OrderItemBody {
  productId: string;
  productType: 'PIZZA' | 'SOBREMESA' | 'BEBIDA';
  quantity: number;
}

// Define a estrutura completa do corpo da requisição
interface CreateOrderBody {
  customerId: string;
  items: OrderItemBody[];
  // Recebe como string genérica (ex: "pix") para depois converter para o formato do Enum
  paymentMethod: string; 
  deliveryMethod: string;
}

class CreateOrderController {
  // Método handle: Gerencia a entrada da requisição e a resposta
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // Desestrutura os dados do corpo da requisição tipando-os com a interface criada acima
    const { customerId, items, paymentMethod, deliveryMethod } = request.body as CreateOrderBody;

    // Instancia o serviço de pedidos
    const createOrderService = new CreateOrderService();

    try {
      // Validação básica no Controller: Se faltar método de pagamento ou entrega, retorna erro 400 (Bad Request)
      if (!paymentMethod || !deliveryMethod) {
         return reply.status(400).send({ error: "Método de pagamento e entrega são obrigatórios." });
      }

      // Executa a criação do pedido. Aqui ocorre uma transformação importante dos dados:
      const order = await createOrderService.execute({
        customerId,
       
        // Mapeia os itens. O '...item' copia as propriedades e o 'productType as any'
        // serve para evitar conflitos de tipagem estrita do TypeScript ao passar a string para o serviço.
        items: items.map(item => ({
          ...item,
          productType: item.productType as any
        })),
    
        // TRANSFORMAÇÃO DE ENUM: O frontend geralmente envia strings em minúsculo (ex: "delivery").
        // O Prisma/Banco espera em MAIÚSCULO (ex: "DELIVERY"). 
        // O .toUpperCase() faz essa conversão e o 'as PaymentMethod' garante a tipagem correta.
        paymentMethod: paymentMethod.toUpperCase() as PaymentMethod,
        deliveryMethod: deliveryMethod.toUpperCase() as DeliveryMethod
      });

      // Retorna o status HTTP 201 (Created) indicando que o recurso foi criado com sucesso.
      return reply.status(201).send(order);
      
    } catch (error: any) {
      // Tratamento de erros: Se algo der errado no serviço (ex: cliente não existe), 
      // loga o erro no console e retorna status 400 com a mensagem do erro.
      console.error("Erro ao criar pedido:", error);
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { CreateOrderController };