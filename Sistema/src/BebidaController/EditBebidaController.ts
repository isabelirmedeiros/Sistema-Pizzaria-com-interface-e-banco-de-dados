import { FastifyReply, FastifyRequest } from "fastify";
// Importa o serviço responsável pela lógica de negócio de editar/atualizar uma bebida
import { EditBebidaService } from "../BebidaService/EditBebidaService";

class EditBebidaController {
    // Método handle: Gerencia a requisição de atualização recebida pela rota
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai 'id', 'name' e 'price' diretamente do corpo da requisição (request.body).
        // Diferente do DeleteController, aqui o ID está vindo no corpo (JSON) e não na URL.
        const { id, name, price } = request.body as {
            id: string, 
            name: string, 
            price: number
        };
        
        // Inicia um bloco try/catch para garantir o tratamento de erros caso a edição falhe
        try {
            // Instancia o serviço dedicado à edição
            const editBebidaService = new EditBebidaService();

            // Executa a lógica de atualização enviando o ID para localizar o item e os novos dados.
            // O 'await' pausa a execução até que o banco de dados processe a alteração.
            const bebida = await editBebidaService.execute({ id, name, price });

            // Retorna ao cliente o objeto da bebida já atualizada
            return reply.send(bebida);
            
        } catch (err) {
            // Se ocorrer algum erro (ex: ID inexistente ou erro de conexão), cai neste bloco.
            // Retorna um objeto de erro genérico para a aplicação.
            return new Error("Solicitação inválida!");
        }
    }
}

// Exporta a classe para ser instanciada no arquivo de rotas
export { EditBebidaController };