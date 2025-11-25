import prismaClient from "../prisma";
// Importa a instância configurada do Prisma Client para realizar a comunicação com o banco de dados

// Interface que define a estrutura de dados (DTO) esperada para criar uma sobremesa.
// Garante que a função receba nome, ingredientes e preço.
interface CreateSobremesaProps {
    name: string;
    ingredients: string;
    price: number;
}

class CreateSobremesaServie {
    // Método execute: Contém a regra de negócio para registrar a sobremesa.
    // Recebe os dados desestruturados conforme a interface acima.
    async execute({ name, ingredients, price }: CreateSobremesaProps) {
        
        // Validação de entrada: Verifica se todos os campos obrigatórios foram preenchidos.
        // Se algum estiver vazio, nulo ou zero, lança um erro e impede a gravação.
        if (!name || !ingredients || !price) {
            throw new Error("Preencha todos os campos");
        }

        // Interação com o Banco de Dados:
        // Usa o método .create() na tabela/modelo 'sobremesa'.
        // O 'await' aguarda o banco confirmar que o registro foi salvo com sucesso.
        const sobremesa = await prismaClient.sobremesa.create({
            data: {
                name,
                ingredients,
                price,
            }
        })

        // Retorna o objeto da sobremesa recém-criada (com o ID gerado) para o controller.
        return sobremesa;
    }
}

// Exporta a classe para ser utilizada no CreateSobremesaController
export { CreateSobremesaServie };