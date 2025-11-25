import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para pesquisar a bebida no banco de dados
import { FindBebidaService } from "../BebidaService/FindBebidaService";

class FindBebidaController {
  // Método handle: Recebe a requisição de busca
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai o 'name' dos parâmetros de rota (request.params).
    // Isso indica que a rota foi definida com uma variável no caminho, por exemplo: "/bebida/:name".
    // Diferente do 'query' (?nome=valor) ou 'body' (JSON), aqui o valor faz parte direta da URL (ex: /bebida/refrigerante).
    const { name } = request.params as { name: string };

    // Instancia o serviço responsável pela busca
    const findBebidaService = new FindBebidaService();

    // Chama o método execute passando o nome extraído da URL.
    // O 'await' espera a consulta ao banco de dados finalizar.
    const bebida = await findBebidaService.execute(name);

    // Devolve a resposta ao cliente com os dados da bebida encontrada
    return reply.send(bebida);
  }
}

// Exporta o controller para ser vinculado a uma rota na aplicação
export { FindBebidaController };