import { hasUncaughtExceptionCaptureCallback } from "process";
// Importa a instância do cliente Prisma para realizar as operações no banco de dados
import prismaClient from "../prisma";

// Interface que define os tipos de dados esperados para a edição.
// Note que definimos todos os campos, mas a lógica abaixo permite que alguns sejam opcionais na prática.
interface EditSobremesaProps {
    id: string;
    name: string;
    ingredients: string;
    price: number;
}

class EditSobremesaService {
    // Método execute: Contém a regra de negócio para atualizar uma sobremesa
    async execute({ id, name, ingredients, price }: EditSobremesaProps) {
        
        // Validação de segurança: O ID é obrigatório para identificar qual registro alterar.
        if (!id) {
            throw new Error("Solicitação invalida.");
        }

        // Passo 1: Busca os dados atuais da sobremesa no banco.
        // Isso é fundamental para a estratégia de "manter dados antigos" caso o usuário não envie todos os campos.
        const existingSobremesa = await prismaClient.sobremesa.findUnique({
            where: {
                id: id
            }
        });

        // Se a busca retornar nulo, a sobremesa não existe e o processo é interrompido.
        if (!existingSobremesa) {
            throw new Error("Sobremesa não existe!");
        }

        // Passo 2: Executa a atualização no banco de dados.
        const updateSobremesa = await prismaClient.sobremesa.update({
            where: {
                id: id // Define qual registro será modificado
            },

            // Lógica de Atualização Condicional (Smart Update):
            // Utiliza o operador ternário para verificar se o novo valor foi fornecido.
            // Ex: 'price !== undefined ? price : existingSobremesa.price'
            // Tradução: "O novo preço foi enviado? Se sim, use-o. 
            //            Se não (undefined), mantenha o preço antigo que pegamos no 'existingSobremesa'."
            // Isso permite atualizar apenas um campo (ex: preço) sem apagar o nome ou ingredientes.
            data: {
                name: name !== undefined ? name : existingSobremesa.name,
                ingredients: ingredients !== undefined ? ingredients : existingSobremesa.ingredients,
                price: price !== undefined ? price : existingSobremesa.price,
            },
        });

        // Retorna o objeto da sobremesa já com os dados atualizados.
        return updateSobremesa;
    }
}

// Exporta a classe para ser utilizada no EditSobremesaController.
export { EditSobremesaService };