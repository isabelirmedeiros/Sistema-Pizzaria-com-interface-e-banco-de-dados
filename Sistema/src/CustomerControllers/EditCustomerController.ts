import { FastifyReply, FastifyRequest } from "fastify";
// Importa o serviço responsável pela lógica de negócio de editar/atualizar os dados do cliente
import { EditCustomerService } from "../CustomerServices/EditCustomerService";

class EditCustomerController {
    // Método handle: Recebe a requisição de atualização e processa a resposta
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai todos os dados necessários (ID e campos a serem alterados) do corpo da requisição (JSON).
        // O uso do 'as { ... }' define a tipagem esperada para esses dados.
        const { id, name, email, cpf, telefone } = request.body as {
            id: string, 
            name: string, 
            email: string, 
            cpf: string, 
            telefone: string
        };
        
        // Inicia um bloco try/catch para capturar possíveis erros durante a execução (ex: cliente não encontrado)
        try {
            // Instancia o serviço de edição de cliente
            const editCustomerService = new EditCustomerService();

            // Executa a lógica de atualização passando o ID e os novos dados recebidos.
            // O 'await' aguarda a confirmação da alteração no banco de dados.
            const customer = await editCustomerService.execute({ id, name, email, cpf, telefone });

            // Retorna o objeto do cliente atualizado como resposta para o frontend
            return reply.send(customer);

        } catch (err) {
            // Caso ocorra algum erro na execução do serviço, retorna um objeto de erro genérico.
            return new Error("Solicitação inválida!");
        }
    }
}

// Exporta o controller para ser registrado nas rotas da aplicação
export { EditCustomerController };