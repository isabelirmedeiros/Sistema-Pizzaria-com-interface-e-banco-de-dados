import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a regra de negócio para remover uma sobremesa do banco de dados
import { DeleteSobremesaService } from "../SobremesaService/DeleteSobremesaService";

class DeleteSobremesaController {
    // Método handle: Responsável por processar a requisição de exclusão
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai o 'id' dos parâmetros de consulta (query params) da URL.
        // Indica que a requisição será feita assim: DELETE /sobremesa?id=valor_do_id
        const { id } = request.query as { id: string }

        // Instancia a classe de serviço de deleção
        const sobremesaService = new DeleteSobremesaService();

        // Chama o método execute do serviço passando o ID capturado.
        // O 'await' aguarda a conclusão da exclusão no banco de dados.
        const sobremesa = await sobremesaService.execute({ id });

        // Envia a resposta ao cliente (geralmente uma mensagem de confirmação retornada pelo serviço)
        reply.send(sobremesa);

    }
}

// Exporta o controller para ser registrado nas rotas da aplicação
export { DeleteSobremesaController };