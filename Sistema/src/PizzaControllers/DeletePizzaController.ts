import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para remover uma pizza do banco de dados
import { DeletePizzaService } from "../PizzaServices/DeletePizzaService";

class DeletePizzaController {
    // Método handle: Gerencia a requisição HTTP para excluir o registro
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai a propriedade 'id' dos parâmetros de consulta (query params) da URL.
        // Isso indica que a requisição esperada será no formato: DELETE /pizza?id=valor_do_id
        const { id } = request.query as { id: string }

        // Instancia o serviço de deleção
        const pizzaService = new DeletePizzaService();

        // Chama o método execute do serviço passando o ID capturado.
        // O 'await' faz o código aguardar a conclusão da operação no banco de dados.
        const pizza = await pizzaService.execute({ id });

        // Envia a resposta de volta ao cliente (geralmente o objeto deletado ou uma mensagem de sucesso)
        reply.send(pizza);

    }
}

// Exporta o controller para ser utilizado na definição das rotas da API
export { DeletePizzaController };