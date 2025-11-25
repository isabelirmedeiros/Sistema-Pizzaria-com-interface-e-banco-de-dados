import prismaClient from "../prisma";
// Importa a instância configurada do Prisma Client para permitir a comunicação com o banco de dados

// Interface que define o "contrato" de dados (DTO) para criar uma pizza.
// Garante que a função receba exatamente um nome, os ingredientes e o preço.
interface CreatePizzaProps {
    name: string;
    ingredients: string;
    price: number;
}

class CreatePizzaServie {
    // Método execute: Responsável pela regra de negócio de criação.
    // Recebe os parâmetros desestruturados conforme a interface definida acima.
    async execute({ name, ingredients, price }: CreatePizzaProps) {
        
        // Validação de entrada: Verifica se todos os campos obrigatórios foram preenchidos.
        // Se faltar nome, ingredientes ou preço, lança um erro e interrompe o fluxo.
        if (!name || !ingredients || !price) {
            throw new Error("Preencha todos os campos");
        }

        // Interação com o Banco de Dados:
        // Chama o método .create() na tabela/modelo 'pizza'.
        // O 'await' aguarda o banco de dados confirmar que o registro foi salvo.
        const pizza = await prismaClient.pizza.create({
            data: {
                name,
                ingredients,
                price,
            }
        })

        // Retorna o objeto da pizza recém-criada (que agora inclui o ID gerado pelo banco).
        return pizza;
    }
}

// Exporta a classe para ser instanciada e usada no CreatePizzaController
export { CreatePizzaServie };