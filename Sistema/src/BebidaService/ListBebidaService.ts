import prismaClient from "../prisma";
// Importa a instância do Prisma Client para permitir a comunicação com o banco de dados

class ListBebidaService {
    // Método execute: Neste caso, não recebe parâmetros, pois o objetivo é listar tudo o que existe.
    async execute() {

        // Utiliza o método .findMany() do Prisma.
        // Esse método é equivalente a um "SELECT * FROM tabela", retornando todos os registros encontrados.
        // O 'await' aguarda o banco devolver a lista completa de dados.
        const bebida = await prismaClient.bebida.findMany();

        // Retorna o array contendo todas as bebidas encontradas no banco.
        return bebida;

    }
}

// Exporta o serviço para ser utilizado pelo ListBebidasController
export { ListBebidaService };