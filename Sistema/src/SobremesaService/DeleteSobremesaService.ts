import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar operações no banco de dados

// Interface que define o dado necessário para executar a exclusão (apenas o ID)
interface DeleteSobremesaProps {
    id: string
}

class DeleteSobremesaService {
    // Método execute: Contém a regra de negócio para remover uma sobremesa
    async execute({ id }: DeleteSobremesaProps) {

        // Validação inicial: Verifica se o ID foi enviado para o serviço.
        // Se estiver vazio ou nulo, lança um erro e não prossegue.
        if (!id) {
            throw new Error("Solicitação invalida.")
        }

        // Verificação de existência:
        // Antes de tentar deletar, faz uma busca no banco para garantir que o registro existe.
        // O 'findFirst' procura a primeira sobremesa que corresponda ao ID informado.
        const findSobremesa = await prismaClient.sobremesa.findFirst({
            where: {
                id: id
            }
        })

        // Se a variável 'findSobremesa' for nula, significa que o ID não existe no banco.
        // Lança um erro informando que não é possível deletar algo que não existe.
        if (!findSobremesa) {
            throw new Error("Sobremesa não existe!");
        }

        // Executa a operação de exclusão definitiva no banco de dados.
        // Usa o ID recuperado da busca anterior para garantir a consistência.
        await prismaClient.sobremesa.delete({
            where: {
                id: findSobremesa.id
            }
        })

        // Retorna um objeto com uma mensagem de feedback simples confirmando o sucesso.
        return { message: "Deletado com sucesso!" };

    }
}

// Exporta o serviço para ser utilizado no DeleteSobremesaController
export { DeleteSobremesaService };