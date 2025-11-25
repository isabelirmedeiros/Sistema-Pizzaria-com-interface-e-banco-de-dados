import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a regra de negócio para buscar todas as sobremesas cadastradas
import { ListSobremesaService } from "../SobremesaService/ListSobremesaService";

class ListSobremesasController {
    // Método handle: Gerencia a requisição HTTP para obter a listagem completa
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Instancia o serviço de listagem.
        // Observe que não é necessário extrair dados da requisição (como body ou params),
        // pois o objetivo é retornar todos os itens disponíveis no banco.
        const listSobremesasService = new ListSobremesaService();

        // Chama o método execute do serviço.
        // O 'await' pausa a execução até que o banco de dados retorne a lista de sobremesas.
        const sobremesa = await listSobremesasService.execute();

        // Envia o array de sobremesas encontrado como resposta para o cliente.
        reply.send(sobremesa);
    }
}

// Exporta o controller para ser vinculado a uma rota na aplicação (ex: GET /sobremesas)
export { ListSobremesasController };