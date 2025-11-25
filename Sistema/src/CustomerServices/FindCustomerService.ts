import { PrismaClient } from "@prisma/client/extension";
// Importa a instância do cliente Prisma configurado para acesso ao banco de dados
import prismaClient from "../prisma";

class FindCustomerService {
  // Método execute: Responsável pela lógica de buscar um cliente específico baseado no CPF
  async execute(cpf: string) {
    
    // Validação de entrada: Verifica se o CPF foi passado como argumento.
    // Se estiver vazio, lança um erro antes de tentar consultar o banco.
    if (!cpf) {
      throw new Error("CPF não enviado");
    }

    // Consulta ao Banco de Dados:
    // Utiliza o método 'findFirst' para procurar o primeiro registro onde o campo 'cpf' corresponda ao valor recebido.
    // O 'await' aguarda a conclusão da busca.
    const customer = await prismaClient.customer.findFirst({
      where: { cpf },
    });

    // Validação de resultado:
    // Se a busca retornar nulo (null), significa que não existe cliente com este CPF no banco.
    if (!customer) {
      throw new Error("Cliente não encontrado");
    }

    // Retorna o objeto do cliente encontrado para o controlador.
    return customer;
  }
}

// Exporta o serviço para ser utilizado no FindCustomerController
export { FindCustomerService };