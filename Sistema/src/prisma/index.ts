import { PrismaClient } from "@prisma/client";
// Importa a classe PrismaClient da biblioteca oficial. 
// Essa classe é responsável por gerenciar a conexão e executar as queries no banco de dados.

const prismaClient = new PrismaClient();
// Cria uma instância única do cliente do Prisma.
// É uma boa prática instanciar o Prisma apenas uma vez e reutilizá-lo em toda a aplicação.
// Isso evita abrir múltiplas conexões desnecessárias com o banco de dados (Connection Pooling).

export default prismaClient;
// Exporta essa instância específica como "default".
// Assim, qualquer arquivo (Service, Controller) que importar este arquivo usará a mesma conexão ativa.