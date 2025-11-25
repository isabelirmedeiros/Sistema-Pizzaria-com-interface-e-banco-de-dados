import { hasUncaughtExceptionCaptureCallback } from "process";
// Importa a instância do Prisma Client para realizar a comunicação com o banco de dados
import prismaClient from "../prisma";

// Interface que define os dados esperados para a edição.
// Note que definimos todos os campos, mas a lógica abaixo permite que alguns sejam opcionais na prática.
interface EditPizzaProps {
    id: string;
    name: string;
    ingredients: string;
    price: number;
}

class EditPizzaService {
    // Método execute: Contém a regra de negócio para atualizar uma pizza
    async execute({ id, name, ingredients, price }: EditPizzaProps) {
        
        // Validação de segurança: O ID é obrigatório para identificar qual registro alterar.
        if (!id) {
            throw new Error("Solicitação invalida.");
        }

        // Passo 1: Busca os dados atuais da pizza no banco.
        // Isso é fundamental para a estratégia de "manter dados antigos" caso o usuário não envie todos os campos.
        const existingPizza = await prismaClient.pizza.findUnique({
            where: {
                id: id
            }
        });

        // Se a busca retornar nulo, a pizza não existe e o processo é interrompido.
        if (!existingPizza) {
            throw new Error("Pizza não existe!");
        }

        // Passo 2: Executa a atualização no banco de dados.
        const updatePizza = await prismaClient.pizza.update({
            where: {
                id: id // Define qual registro será modificado
            },

            // Lógica de Atualização Condicional (Smart Update):
            // Utiliza o operador ternário para verificar se o novo valor foi fornecido.
            // Ex: 'price !== undefined ? price : existingPizza.price'
            // Tradução: "O novo preço foi enviado? Se sim, use-o. 
            //            Se não (undefined), mantenha o preço antigo (existingPizza.price)."
            // Isso permite atualizar apenas um campo (ex: preço) sem apagar o nome ou ingredientes.
            data: {
                name: name !== undefined ? name : existingPizza.name,
                ingredients: ingredients !== undefined ? ingredients : existingPizza.ingredients,
                price: price !== undefined ? price : existingPizza.price,
            },
        });

        // Retorna o objeto da pizza já com os dados atualizados.
        return updatePizza;
    }
}

// Exporta a classe para ser utilizada no EditPizzaController.
export { EditPizzaService };