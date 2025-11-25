import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar a conexão e consultas ao banco de dados

class ListPizzasService {
    // Método execute: Responsável pela lógica de negócio para buscar todas as pizzas.
    // Não recebe nenhum parâmetro, pois o objetivo é retornar a lista completa.
    async execute() {

        // Utiliza o método .findMany() do Prisma na tabela 'pizza'.
        // Esse método busca todos os registros armazenados no banco (equivalente a um "SELECT *").
        // O 'await' faz o código esperar a resposta do banco antes de continuar.
        const pizzas = await prismaClient.pizza.findMany();

        // Retorna o array contendo todas as pizzas encontradas para o controlador.
        return pizzas;

    }
}

// Exporta a classe para ser utilizada no ListPizzasController
export { ListPizzasService };