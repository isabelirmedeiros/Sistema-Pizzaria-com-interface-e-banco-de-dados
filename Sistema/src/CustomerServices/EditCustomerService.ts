import { hasUncaughtExceptionCaptureCallback } from "process";
// Importa o cliente do Prisma para comunicação com o banco de dados
import prismaClient from "../prisma";

// Interface que define a estrutura de dados esperada para a edição.
// Note que todos os campos estão listados, mas na lógica abaixo veremos que nem todos são obrigatórios.
interface EditCustomerProps {
    id: string;
    name: string;
    cpf: string;
    email: string;
    telefone: string;
}

class EditCustomerService {
    // Método execute: Contém a regra de negócio para atualizar um cliente
    async execute({ id, name, cpf, email, telefone }: EditCustomerProps) {
        
        // Validação: O ID é crucial para identificar quem será editado.
        if (!id) {
            throw new Error("Solicitação invalida.");
        }

        // Passo 1: Busca os dados atuais do cliente no banco.
        // Isso é necessário para garantir que ele existe e para preencher os campos 
        // que o usuário decidiu não alterar (mantendo os dados antigos).
        const existingCustomer = await prismaClient.customer.findUnique({
            where: {
                id: id
            }
        });

        // Se não encontrar o cliente, interrompe o fluxo com erro.
        if (!existingCustomer) {
            throw new Error("Cliente não existe!");
        }

        // Passo 2: Executa a atualização no banco.
        const updateCustomer = await prismaClient.customer.update({
            where: {
                id: id // Define qual registro será alterado
            },

            // Lógica de Atualização Parcial (Smart Update):
            // Utiliza operadores ternários para decidir qual valor salvar.
            // Exemplo: 'name !== undefined ? name : existingCustomer.name'
            // Significa: "Se um novo nome foi enviado, use ele. Caso contrário (undefined), mantenha o nome antigo."
            // Isso permite que a API receba apenas o campo "telefone" para atualizar, sem apagar o "nome" ou "email".
            data: {
                name: name !== undefined ? name : existingCustomer.name,
                email: email !== undefined ? email : existingCustomer.email,
                cpf: cpf !== undefined ? cpf : existingCustomer.cpf,
                telefone: telefone !== undefined ? telefone : existingCustomer.telefone,
            },
        });

        // Retorna o objeto do cliente já com os dados atualizados.
        return updateCustomer;
    }
}

// Exporta o serviço para ser utilizado no Controller correspondente.
export { EditCustomerService };