import { FastifyReply, FastifyRequest } from "fastify";
// Importa o serviço que contém a regra de negócio para editar os dados de uma pizza
import { EditPizzaService } from "../PizzaServices/EditPizzaService";

class EditPizzaController {
    // Método handle: Responsável por gerenciar a requisição de atualização
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai o ID e os novos dados (nome, ingredientes, preço) do corpo da requisição (JSON).
        // A tipagem 'as { ... }' garante que o código saiba quais campos esperar.
        const { id, name, ingredients, price } = request.body as {
            id: string, 
            name: string, 
            ingredients: string,
            price: number
        };
        
        // Inicia um bloco try/catch para capturar falhas na operação (ex: ID inexistente)
        try {
            // Instancia o serviço de edição
            const editPizzaService = new EditPizzaService();

            // Executa a lógica de atualização passando os dados recebidos.
            // O 'await' pausa a execução até que o banco de dados confirme a alteração.
            const pizza = await editPizzaService.execute({ id, name, ingredients, price });

            // Retorna ao cliente o objeto da pizza com os dados já atualizados
            return reply.send(pizza);
            
        } catch (err) {
            // Caso ocorra algum erro durante o processo, retorna um erro genérico.
            return new Error("Solicitação inválida!");
        }
    }
}

// Exporta o controller para ser registrado nas rotas da aplicação
export { EditPizzaController };