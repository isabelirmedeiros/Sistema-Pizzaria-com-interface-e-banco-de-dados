import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply} from "fastify";
// Importações dos Controllers de Clientes
import { CreateCustomerController } from "./CustomerControllers/CreateCustomerController";
import { ListCustomersController } from "./CustomerControllers/ListCustomersController";
import { DeleteCustomerController } from "./CustomerControllers/DeleteCustomerController";
import { EditCustomerController } from "./CustomerControllers/EditCustomerController";
import { FindCustomerController } from "./CustomerControllers/FindCustomerController";

// Importações dos Controllers de Pizza
import { CreatePizzaController } from "./PizzaControllers/CreatePizzaController";
import { ListPizzasController } from "./PizzaControllers/ListPizzaController";
import { DeletePizzaController } from "./PizzaControllers/DeletePizzaController";
import { EditPizzaController } from "./PizzaControllers/EditPizzaController";
import { FindPizzaController } from "./PizzaControllers/FindPizzaController";

// Importações dos Controllers de Sobremesa
import { CreateSobremesaController } from "./SobremesaController/CreateSobremesaController";
import { ListSobremesasController } from "./SobremesaController/ListSobremesaController";
import { DeleteSobremesaController } from "./SobremesaController/DeleteSobremesaController";
import { EditSobremesaController } from "./SobremesaController/EditSobremesaController";
import { FindSobremesaController } from "./SobremesaController/FindSobremesaController";

// Importações dos Controllers de Bebida
import { CreateBebidaController } from "./BebidaController/CreateBebidaController";
import { ListBebidasController } from "./BebidaController/ListBebidaController";
import { DeleteBebidaController } from "./BebidaController/DeleteBebidaController";
import { EditBebidaController } from "./BebidaController/EditBebidaController";
import { FindBebidaController } from "./BebidaController/FindBebidaController";

// Importações dos Controllers de Pedidos e Relatórios
import { CreateOrderController } from "./OrderController/CreateOrderController";
import { DeleteOrderController } from "./OrderController/DeleteOrderController";
import { GetMonthlySalesReportController } from "./OrderController/GetMonthlySalesReportController";
import { GetDailySalesReportController } from "./OrderController/GetDailySalesReportController";


// Função principal de rotas. O Fastify injeta a instância 'fastify' aqui.
export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions){

    // ROTAS DE CLIENTE (CUSTOMER)
    

    // POST /customer: Cria um novo cliente
    fastify.post("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        // Instancia o controller e chama o método handle para processar a requisição
        return new CreateCustomerController().handle(request, reply);
    })

    // GET /customers: Lista todos os clientes
    fastify.get("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListCustomersController().handle(request, reply);
    })

    // DELETE /customer: Deleta um cliente (espera ?id=... na URL)
    fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteCustomerController().handle(request, reply);
    })    

    // PUT /customer: Atualiza dados do cliente
    fastify.put("/customer", async(request: FastifyRequest, reply: FastifyReply) => {
        return new EditCustomerController().handle(request, reply);
    })

    // GET /customer/:cpf -> Busca cliente específico
    // O ":cpf" indica que é um parâmetro de rota dinâmico (ex: /customer/12345678900)
    fastify.get("/customer/:cpf", async(request: FastifyRequest, reply: FastifyReply) => {
        return new FindCustomerController().handle(request, reply);
    })

    // ROTAS DE PIZZA

    // POST /pizza: Cria uma nova pizza
    fastify.post("/pizza", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreatePizzaController().handle(request, reply);
    })

    // GET /pizzas: Lista todas as pizzas do cardápio
    fastify.get("/pizzas", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListPizzasController().handle(request, reply);
    })

    // DELETE /pizza: Remove uma pizza do cardápio (espera ?id=...)
    fastify.delete("/pizza", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeletePizzaController().handle(request, reply);
    })    

    // PUT /pizza: Edita uma pizza existente
    fastify.put("/pizza", async(request: FastifyRequest, reply: FastifyReply) => {
        return new EditPizzaController().handle(request, reply);
    })

    // GET /pizza/:name -> Busca pizza pelo nome na URL
    fastify.get("/pizza/:name", async(request: FastifyRequest, reply: FastifyReply) => {
        return new FindPizzaController().handle(request, reply);
    })


    // ROTAS DE SOBREMESA

    // POST /sobremesa: Cadastra nova sobremesa
    fastify.post("/sobremesa", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateSobremesaController().handle(request, reply);
    })

    // GET /sobremesas: Lista todas as sobremesas
    fastify.get("/sobremesas", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListSobremesasController().handle(request, reply);
    })

    // DELETE /sobremesa: Remove sobremesa
    fastify.delete("/sobremesa", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteSobremesaController().handle(request, reply);
    })    

    // PUT /sobremesa: Atualiza sobremesa
    fastify.put("/sobremesa", async(request: FastifyRequest, reply: FastifyReply) => {
        return new EditSobremesaController().handle(request, reply);
    })

    // GET /sobremesa/:name: Busca sobremesa pelo nome
    fastify.get("/sobremesa/:name", async(request: FastifyRequest, reply: FastifyReply) => {
        return new FindSobremesaController().handle(request, reply);
    })


    // ROTAS DE BEBIDA

    // POST /bebida: Cadastra nova bebida
    fastify.post("/bebida", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateBebidaController().handle(request, reply);
    })

    // GET /bebidas: Lista todas as bebidas
    fastify.get("/bebidas", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListBebidasController().handle(request, reply);
    })

    // DELETE /bebida: Remove bebida
    fastify.delete("/bebida", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteBebidaController().handle(request, reply);
    })    

    // PUT /bebida: Atualiza bebida
    fastify.put("/bebida", async(request: FastifyRequest, reply: FastifyReply) => {
        return new EditBebidaController().handle(request, reply);
    })

    // GET /bebida/:name: Busca bebida pelo nome
    fastify.get("/bebida/:name", async(request: FastifyRequest, reply: FastifyReply) => {
        return new FindBebidaController().handle(request, reply);
    })


    // ROTAS DE PEDIDOS (ORDERS) E RELATÓRIOS
  

    // POST /orders: Cria um novo pedido (processa itens, soma totais, taxa de entrega, etc.)
    fastify.post("/orders", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateOrderController().handle(request, reply);
    })

    // DELETE /order: Cancela/Deleta um pedido
    fastify.delete("/order", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteOrderController().handle(request, reply);
    })

    // GET /reports/daily: Relatório de vendas diárias
    // Exemplo de uso: /reports/daily?startDate=2023-10-01&endDate=2023-10-31
    fastify.get("/reports/daily", async (request: FastifyRequest, reply: FastifyReply) => {
        return new GetDailySalesReportController().handle(request, reply);
    });

    // GET /reports/monthly: Relatório de vendas mensais
    // Exemplo de uso: /reports/monthly?year=2023
    fastify.get("/reports/monthly", async (request: FastifyRequest, reply: FastifyReply) => {
        return new GetMonthlySalesReportController().handle(request, reply);
    });

}