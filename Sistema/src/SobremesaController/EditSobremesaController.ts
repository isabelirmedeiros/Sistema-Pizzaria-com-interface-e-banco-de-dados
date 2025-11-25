import { FastifyReply, FastifyRequest } from "fastify";
// Importa o serviço responsável pela lógica de negócio de editar uma sobremesa
import { EditSobremesaService } from "../SobremesaService/EditSobremesaService";

class EditSobremesaController {
    // Método handle: Gerencia a requisição de atualização (geralmente vinda de uma rota PUT ou PATCH)
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai o ID e os novos dados (nome, ingredientes, preço) diretamente do corpo da requisição (JSON).
        // A tipagem 'as { ... }' garante que o TypeScript reconheça os campos esperados.
        const { id, name, ingredients, price } = request.body as {
            id: string, 
            name: string, 
            ingredients: string,
            price: number
        };
        
        // Inicia um bloco try/catch para garantir o tratamento de erros caso a edição falhe
        try {
            // Instancia o serviço de edição
            const editSobremesaService = new EditSobremesaService();

            // Executa a lógica de atualização passando os dados recebidos.
            // O 'await' pausa a execução até que o banco de dados confirme a alteração.
            const sobremesa = await editSobremesaService.execute({ id, name, ingredients, price });

            // Se tudo der certo, retorna ao cliente o objeto da sobremesa atualizada
            return reply.send(sobremesa);
            
        } catch (err) {
            // Se ocorrer algum erro (ex: ID não encontrado ou erro de conexão), cai neste bloco.
            // Retorna um objeto de erro genérico para a aplicação.
            return new Error("Solicitação inválida!");
        }
    }
}

// Exporta o controller para ser registrado nas rotas da aplicação
export { EditSobremesaController };