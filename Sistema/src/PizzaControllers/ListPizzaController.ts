import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para buscar todas as pizzas cadastradas
import { ListPizzasService } from "../PizzaServices/ListPizzaService";

class ListPizzasController {
    // Método handle: Gerencia a requisição HTTP para obter a listagem de pizzas
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Instancia o serviço de listagem.
        // Aqui não precisamos extrair nada da requisição (como body ou params), 
        // pois o objetivo é retornar todos os registros disponíveis.
        const listPizzasService = new ListPizzasService();

        // Executa o método do serviço que busca os dados no banco.
        // O 'await' aguarda a lista ser retornada antes de prosseguir.
        const pizzas = await listPizzasService.execute();

        // Envia o array de pizzas encontrado como resposta para o cliente/frontend.
        reply.send(pizzas);
    }
}

// Exporta o controller para ser utilizado na definição das rotas da API
export { ListPizzasController };