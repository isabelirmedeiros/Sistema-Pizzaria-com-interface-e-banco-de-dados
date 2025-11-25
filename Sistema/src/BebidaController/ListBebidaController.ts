import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável por buscar a lista de todas as bebidas no banco de dados
import { ListBebidaService } from "../BebidaService/ListBebidaService";

class ListBebidasController {
    // Método handle: Gerencia a requisição para listar os registros
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Instancia o serviço de listagem.
        // Observe que, diferente dos outros controllers, aqui não extraímos nada de 'request' 
        // (nem body, query ou params), pois a intenção geralmente é buscar tudo o que está cadastrado.
        const listbebidasService = new ListBebidaService();

        // Executa a lógica de busca no banco de dados.
        // O 'await' pausa a execução até que a lista de bebidas seja retornada.
        const bebida = await listbebidasService.execute();

        // Envia a lista encontrada como resposta para o cliente
        reply.send(bebida);
    }
}

// Exporta a classe para ser utilizada na definição das rotas da API
export { ListBebidasController };