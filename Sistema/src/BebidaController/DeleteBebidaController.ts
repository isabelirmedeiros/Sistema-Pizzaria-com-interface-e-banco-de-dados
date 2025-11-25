import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para remover a bebida do banco de dados
import { DeleteBebidaService } from "../BebidaService/DeleteBebidaService";

class DeleteBebidaController {
    // Método handle: Responsável por processar a requisição de deleção
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai a propriedade 'id' dos parâmetros de consulta (query params) da URL.
        // Isso significa que a requisição esperada será algo como: DELETE /rota?id=12345
        const { id } = request.query as { id: string }

        // Instancia o serviço de deleção para poder utilizar seus métodos
        const bebidaService = new DeleteBebidaService();

        // Chama o método execute do serviço passando o ID capturado.
        // O 'await' aguarda a conclusão da lógica de exclusão no banco de dados.
        const bebida = await bebidaService.execute({ id });

        // Envia a resposta de volta ao cliente (geralmente o objeto deletado ou uma mensagem de sucesso)
        reply.send(bebida);

    }
}

// Exporta o controller para ser registrado no arquivo de rotas da aplicação
export { DeleteBebidaController };