import { FastifyRequest, FastifyReply } from "fastify";
// Importa a classe de serviço que contém a regra de negócio para criar uma pizza.
// (Nota: O nome importado está 'CreatePizzaServie', mantive conforme o código original, 
// mas provavelmente seria 'Service' em uma correção ortográfica).
import { CreatePizzaServie } from "../PizzaServices/CreatePizzaService";

class CreatePizzaController {
    // Método handle: Responsável por receber a requisição HTTP e devolver a resposta ao cliente.
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai as propriedades 'name', 'ingredients' e 'price' do corpo da requisição (request.body).
        // A tipagem 'as { ... }' garante que o TypeScript entenda o formato dos dados recebidos.
        const { name, ingredients, price } = request.body as { name: string, ingredients: string, price: number };

        // Instancia a classe de serviço para acessar seus métodos.
        const pizzaService = new CreatePizzaServie()

        // Chama o método execute do serviço passando os dados da pizza.
        // O 'await' é necessário pois a operação envolve acesso ao banco de dados (assíncrono).
        const pizza = await pizzaService.execute({ name, ingredients, price });

        // Envia a resposta (o objeto da pizza criada) de volta para quem fez a requisição.
        reply.send(pizza)
    }
}

// Exporta o controller para ser utilizado no arquivo de rotas da aplicação.
export { CreatePizzaController };