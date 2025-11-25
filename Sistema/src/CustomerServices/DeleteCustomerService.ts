import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar operações no banco de dados

// Interface que define o dado necessário para executar a deleção (apenas o ID do cliente)
interface DeleteCustomerProps {
    id: string
}

class DeleteCustomerService {
    // Método execute: Contém a lógica de negócio para remover um cliente
    async execute({ id }: DeleteCustomerProps) {

        // Validação inicial: Verifica se o ID foi realmente passado para o serviço.
        if (!id) {
            throw new Error("Solicitação invalida.")
        }

        // Verifica a existência do registro:
        // Antes de tentar deletar, busca no banco para ver se esse ID pertence a um cliente real.
        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id: id
            }
        })

        // Se a busca retornar nulo, significa que o cliente não existe no banco.
        // Lança um erro para impedir a tentativa de exclusão de algo inexistente.
        if (!findCustomer) {
            throw new Error("Cliente não existe!");
        }

        // Executa a remoção do registro no banco de dados utilizando o ID validado.
        await prismaClient.customer.delete({
            where: {
                id: findCustomer.id
            }
        })

        // Retorna uma mensagem de feedback confirmando o sucesso da operação.
        return { message: "Deletado com sucesso!" };

    }
}

// Exporta o serviço para ser utilizado no DeleteCustomerController
export { DeleteCustomerService };