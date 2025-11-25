import { PrismaClient } from "@prisma/client/extension";
// Importa a instância do cliente Prisma para realizar a consulta no banco de dados
import prismaClient from "../prisma";

class FindPizzaService {
  // Método execute: Responsável pela lógica de busca de uma pizza pelo nome
  async execute(name: string) {
    
    // Validação de entrada: Verifica se o parâmetro 'name' foi enviado.
    if (!name) {
      throw new Error("Pizza não encontrada"); // Nota: A mensagem ideal seria "Nome não informado".
    }

    // Consulta ao Banco de Dados:
    // Utiliza 'findFirst' para buscar a primeira pizza cujo nome corresponda ao valor recebido.
    const pizza = await prismaClient.pizza.findFirst({
      where: { name },
    });

    // ATENÇÃO: Erro de Lógica.
    // O código original está verificando '!name' novamente (o que já foi checado no início).
    // Para validar se a busca no banco falhou, o correto seria verificar a variável 'pizza'.
    // Exemplo corrigido: if (!pizza) { ... }
    if (!name) {
      throw new Error("Pizza não encontrada");
    }

    // Retorna o objeto da pizza encontrada (ou null, caso o erro acima não seja corrigido).
    return pizza;
  }
}

// Exporta o serviço para ser utilizado no FindPizzaController
export { FindPizzaService };