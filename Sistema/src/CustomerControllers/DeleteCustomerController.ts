import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de negócio de excluir um cliente
import { DeleteCustomerService } from "../CustomerServices/DeleteCustomerService";

class DeleteCustomerController {
    // Método handle: Gerencia a requisição HTTP para deletar um registro
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai o 'id' dos parâmetros de consulta (query params) da URL.
        // Isso indica que a requisição será feita no formato: DELETE /rota?id=valor_do_id
        const { id } = request.query as { id: string }

        // Instancia o serviço de deleção de clientes
        const customerService = new DeleteCustomerService();

        // Chama o método execute do serviço, passando o ID extraído.
        // O 'await' faz o código esperar até que o cliente seja removido do banco de dados.
        const customer = await customerService.execute({ id });

        // Retorna a resposta ao solicitante (geralmente o objeto deletado ou uma mensagem de confirmação)
        reply.send(customer);

    }
}

// Exporta a classe para ser utilizada na definição das rotas da API
export { DeleteCustomerController };