import { hasUncaughtExceptionCaptureCallback } from "process";
// Importa o cliente do Prisma para realizar as operações no banco de dados
import prismaClient from "../prisma";

// Interface que define os tipos de dados que o serviço espera receber.
interface EditBebidaProps {
    id: string;
    name: string;
    price: number;
}

class EditBebidaService {
    // Método execute: Contém a regra de negócio para editar uma bebida existente
    async execute({ id, name, price }: EditBebidaProps) {
        
        // Validação de segurança: O ID é obrigatório para saber qual registro alterar.
        if (!id) {
            throw new Error("Solicitação invalida.");
        }

        // Passo 1: Busca o registro atual no banco de dados antes de tentar editar.
        // Usamos 'findUnique' pois o ID é único.
        const existingBebida = await prismaClient.bebida.findUnique({
            where: {
                id: id
            }
        });

        // Se a busca retornar nulo, a bebida não existe, então interrompemos o fluxo.
        if (!existingBebida) {
            throw new Error("Bebida não existe!");
        }

        // Passo 2: Realiza a atualização no banco de dados.
        const updateBebida = await prismaClient.bebida.update({
            where: {
                id: id // Define qual registro será atualizado
            },

            // Lógica condicional para os dados (Atualização Inteligente):
            // Aqui usamos o operador ternário para verificar se o dado foi enviado.
            // Exemplo: 'name !== undefined ? name : existingBebida.name'
            // Tradução: "O novo nome foi informado? Se sim, use o novo nome. 
            //            Se não (undefined), mantenha o nome antigo (existingBebida.name)."
            // Isso impede que campos não preenchidos apaguem os dados que já existiam.
            data: {
                name: name !== undefined ? name : existingBebida.name,
                price: price !== undefined ? price : existingBebida.price,
            },
        });

        // Retorna a bebida com os dados já atualizados.
        return updateBebida;
    }
}

// Exporta a classe para ser usada no Controller.
export { EditBebidaService };