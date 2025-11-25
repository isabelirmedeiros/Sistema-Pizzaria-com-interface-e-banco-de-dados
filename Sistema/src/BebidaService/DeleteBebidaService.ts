import prismaClient from "../prisma";
// Importa a instância do Prisma Client para realizar operações no banco de dados

// Interface que define o tipo de dado esperado para executar a exclusão (apenas o ID)
interface DeleteBebidaProps {
    id: string
}

class DeleteBebidaService {
    // Método principal que contém a lógica de remoção
    async execute({ id }: DeleteBebidaProps) {

        // Validação inicial: Verifica se o ID foi enviado.
        // Se a string estiver vazia ou nula, interrompe com um erro.
        if (!id) {
            throw new Error("Solicitação invalida.")
        }

        // Antes de deletar, verifica se o registro realmente existe no banco de dados.
        // O 'findFirst' procura o primeiro registro que corresponda ao filtro (where).
        const findBebida = await prismaClient.bebida.findFirst({
            where: {
                id: id
            }
        })

        // Se a variável 'findBebida' for nula, significa que o ID não foi encontrado no banco.
        // Lança um erro informando que não é possível deletar algo inexistente.
        if (!findBebida) {
            throw new Error("Bebida não existe!");
        }

        // Agora que garantimos que o registro existe, executamos o comando de delete.
        await prismaClient.bebida.delete({
            where: {
                id: findBebida.id
            }
        })

        // Retorna um objeto com uma mensagem de feedback confirmando o sucesso da operação.
        return { message: "Deletado com sucesso!" };

    }
}

// Exporta a classe para ser utilizada no Controller
export { DeleteBebidaService };