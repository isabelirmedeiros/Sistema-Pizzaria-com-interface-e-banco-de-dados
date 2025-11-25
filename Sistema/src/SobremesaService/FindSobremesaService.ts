import { PrismaClient } from "@prisma/client/extension";
// Importa a instância do cliente Prisma para realizar a consulta no banco de dados
import prismaClient from "../prisma";

class FindSobremesaService {
  // Método execute: Responsável pela lógica de buscar uma sobremesa pelo nome
  async execute(name: string) {
    
    // Validação de entrada: Verifica se o nome foi enviado na requisição.
    if (!name) {
      throw new Error("Nome não enviado");
    }

    // Consulta ao Banco de Dados:
    // Utiliza 'findFirst' para buscar a primeira sobremesa cujo nome corresponda ao parâmetro recebido.
    const sobremesa = await prismaClient.sobremesa.findFirst({
      where: { name },
    });

    // ATENÇÃO: Erro de Lógica e Digitação.
    // 1. O código está verificando '!name' novamente (o que já foi checado no início).
    //    O correto seria verificar a variável do resultado: if (!sobremesa).
    // 2. A mensagem de erro diz "BEb não encontrado", o que parece ser um resto de cópia do código de "Bebida".
    if (!name) {
      throw new Error("BEb não encontrado");
    }

    // Retorna o objeto da sobremesa encontrada (ou null, caso o erro lógico acima permaneça).
    return sobremesa;
  }
}

// Exporta o serviço para ser utilizado no FindSobremesaController
export { FindSobremesaService };