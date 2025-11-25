import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para realizar conexões e consultas ao banco de dados

class ListCustomersService {
    // Método execute: Contém a lógica de negócio para buscar todos os clientes.
    // Não recebe parâmetros, pois a intenção é listar tudo o que está cadastrado.
    async execute() {

        // Utiliza o método .findMany() do Prisma na tabela 'customer'.
        // Esse comando recupera todos os registros armazenados, funcionando como um "SELECT *".
        // O 'await' aguarda o banco de dados retornar os dados antes de prosseguir.
        const customers = await prismaClient.customer.findMany();

        // Retorna a lista (array) de clientes encontrados para quem chamou o serviço (geralmente o Controller).
        return customers;

    }
}

// Exporta a classe para ser utilizada no ListCustomersController
export { ListCustomersService }