import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de buscar uma pizza específica (neste caso, pelo nome)
import { FindPizzaService } from "../PizzaServices/FindPizzaService";

class FindPizzaController {
  // Método handle: Gerencia a requisição de busca recebida pela rota
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai a propriedade 'name' dos parâmetros de rota (request.params).
    // Isso indica que o dado é passado na estrutura da URL (Path Parameter).
    // Exemplo de rota: GET /pizza/calabresa (onde "calabresa" é o valor de :name)
    const { name } = request.params as { name: string };

    // Instancia o serviço de busca de pizzas
    const findPizzaService = new FindPizzaService();

    // Executa a lógica de busca passando o nome extraído da URL.
    // O 'await' pausa a execução até que o banco de dados retorne o resultado.
    const pizza = await findPizzaService.execute(name);

    // Envia a resposta de volta ao cliente com o objeto da pizza encontrada
    return reply.send(pizza);
  }
}

// Exporta o controller para ser vinculado a uma rota na aplicação
export { FindPizzaController };