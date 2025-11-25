import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para listar todos os clientes cadastrados
import { ListCustomersService } from "../CustomerServices/ListCustomersService";

class ListCustomersController {
    // Método handle: Gerencia a requisição HTTP para obter a lista de clientes
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Instancia o serviço de listagem.
        // Observe que, ao contrário de buscas por ID ou criações, aqui não extraímos dados da requisição,
        // pois a intenção é retornar todos os registros existentes.
        const listCustomersService = new ListCustomersService();

        // Chama o método execute do serviço para buscar os dados no banco.
        // O 'await' pausa a execução até que a lista de clientes seja retornada.
        const customers = await listCustomersService.execute();

        // Envia o array de clientes recuperado como resposta para o solicitante (frontend/API client)
        reply.send(customers);
    }
}

// Exporta o controller para ser registrado nas rotas da aplicação
export { ListCustomersController };