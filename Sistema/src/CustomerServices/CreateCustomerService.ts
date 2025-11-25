import prismaClient from "../prisma";
// Importa a instância configurada do Prisma Client para permitir operações no banco de dados

// Interface que define o contrato de dados (DTO) necessário para criar um cliente.
// Garante que quem chamar essa função envie name, email, cpf e telefone.
interface CreateCustomerProps {
    name: string;
    email: string;
    cpf: string;
    telefone: string;
}

class CreateCustomerServie {
    // Método execute: Responsável pela regra de negócio de criação.
    // Recebe os dados desestruturados conforme a interface definida acima.
    async execute({ name, email, cpf, telefone }: CreateCustomerProps) {
        
        // Validação de integridade: Verifica se todos os campos obrigatórios foram preenchidos.
        // Se algum estiver vazio, interrompe a execução lançando um erro.
        if (!name || !email || !cpf || !telefone) {
            throw new Error("Preencha todos os campos");
        }

        // Interação com o Banco de Dados:
        // Chama o método .create() na tabela/modelo 'customer'.
        // O 'await' aguarda a inserção ser concluída antes de prosseguir.
        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                cpf,
                telefone,
            }
        })

        // Retorna o objeto do cliente recém-criado (geralmente inclui o ID gerado e datas de criação).
        return customer
    }
}

// Exporta a classe para ser instanciada no CreateCustomerController
export { CreateCustomerServie };