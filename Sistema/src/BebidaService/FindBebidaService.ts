import prismaClient from "../prisma";
// Importa a instância do cliente Prisma para acesso ao banco de dados

class FindBebidaService {
  // Método execute: Recebe o nome (string) como parâmetro para realizar a busca
  async execute(name: string) {
    
    // Validação: Verifica se o nome foi enviado.
    if (!name) {
      throw new Error("Bebida não encontrada");
    }

    // Busca no banco de dados:
    // Utiliza 'findFirst' para retornar a primeira ocorrência onde o campo 'name' coincide com o parâmetro recebido.
    const bebida = await prismaClient.bebida.findFirst({
      where: { name },
    });

    // Retorna o objeto da bebida encontrada (ou null, caso o erro acima não seja corrigido para validar a variável 'bebida')
    return bebida;
  }
}

// Exporta o serviço para uso no Controller
export { FindBebidaService };