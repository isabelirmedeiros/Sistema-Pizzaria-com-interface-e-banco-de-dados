import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar operações no banco de dados

// Interface que define o dado necessário para executar a exclusão (apenas o ID)
interface DeletePizzaProps {
    id: string
}

class DeletePizzaService {
    // Método execute: Contém a lógica de negócio para remover uma pizza
    async execute({ id }: DeletePizzaProps) {

        // Validação inicial: Verifica se o ID foi fornecido.
        // Se estiver vazio, lança um erro e interrompe a execução.
        if (!id) {
            throw new Error("Solicitação invalida.")
        }

        // Verificação de existência:
        // Antes de deletar, consulta o banco para garantir que há uma pizza com esse ID.
        // O 'findFirst' busca o primeiro registro que corresponde ao filtro.
        const findPizza = await prismaClient.pizza.findFirst({
            where: {
                id: id
            }
        })

        // Se a busca retornar nulo (null), significa que a pizza não foi encontrada.
        if (!findPizza) {
            throw new Error("Pizza não existe!");
        }

        // Executa a remoção do registro no banco de dados.
        // Utiliza o ID recuperado da busca anterior (findPizza.id) para garantir a integridade.
        await prismaClient.pizza.delete({
            where: {
                id: findPizza.id
            }
        })

        // Retorna um objeto com uma mensagem de feedback confirmando a exclusão.
        return { message: "Deletado com sucesso!" };

    }
}

// Exporta o serviço para ser utilizado no DeletePizzaController
export { DeletePizzaService };