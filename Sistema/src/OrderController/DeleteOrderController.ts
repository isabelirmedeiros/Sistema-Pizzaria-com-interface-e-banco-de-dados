// OrderController/DeleteOrderController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
// Importa a instância do cliente Prisma para acesso direto ao banco de dados
import prismaClient from '../prisma';

// Interface para tipar os dados esperados nos parâmetros de consulta (Query Params)
interface DeleteOrderParams {
  id: string;
}

class DeleteOrderController {
  // Método handle: Gerencia a requisição de deleção
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai o ID da URL.
    // Exemplo de requisição: DELETE /order?id=valor_do_id
    // O 'as DeleteOrderParams' garante ao TypeScript que esperamos um objeto com a propriedade 'id'.
    const { id } = request.query as DeleteOrderParams;

    try {
      // Validação de entrada: Se o ID não for enviado na URL, retorna erro 400 (Bad Request).
      if (!id) {
        return reply.status(400).send({ error: 'ID do pedido é obrigatório' });
      }

      // Verificação de existência:
      // Antes de deletar, busca no banco para ver se o pedido existe.
      // Isso é importante para diferenciar um erro de sistema de um erro de "não encontrado".
      const orderExists = await prismaClient.order.findUnique({
        where: { id },
      });

      // Se a busca retornar nulo, retorna erro 404 (Not Found).
      if (!orderExists) {
        return reply.status(404).send({ error: 'Pedido não encontrado' });
      }

      // Se o pedido existe, executa o comando de deleção no banco de dados.
      await prismaClient.order.delete({
        where: { id },
      });

      // Retorna uma mensagem de sucesso para o cliente.
      return reply.send({ message: 'Pedido deletado com sucesso!' });

    } catch (error: any) {
      // Tratamento de erros inesperados (ex: banco fora do ar, erro de constraint, etc).
      // Loga o erro no console para o desenvolvedor ver.
      console.error('Erro ao deletar pedido:', error);
      // Retorna status 500 (Internal Server Error) para o cliente.
      return reply.status(500).send({ error: error.message });
    }
  }
}

export { DeleteOrderController };