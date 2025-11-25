import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar a conexão e consultas ao banco de dados

class ListSobremesaService {
    // Método execute: Responsável pela lógica de negócio para buscar todas as sobremesas.
    // Não recebe parâmetros, pois o objetivo é retornar a lista completa do que está cadastrado.
    async execute() {

        // Utiliza o método .findMany() do Prisma na tabela/model 'sobremesa'.
        // Esse método busca todos os registros armazenados no banco (equivalente a um "SELECT *").
        // O 'await' faz o código esperar a resposta do banco antes de continuar.
        const sobremesa = await prismaClient.sobremesa.findMany();

        // Retorna o array contendo todas as sobremesas encontradas para o controlador.
        return sobremesa;

    }
}

// Exporta a classe para ser utilizada no ListSobremesasController
export { ListSobremesaService };