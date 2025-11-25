import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de buscar uma sobremesa específica (neste caso, pelo nome)
import { FindSobremesaService } from "../SobremesaService/FindSobremesaService";

class FindSobremesaController {
  // Método handle: Gerencia a requisição de busca recebida pela rota
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai a propriedade 'name' dos parâmetros de rota (request.params).
    // Isso indica que o valor é passado diretamente na URL, como parte do caminho.
    // Exemplo de rota esperada: GET /sobremesa/:name (ex: /sobremesa/pudim)
    const { name } = request.params as { name: string };

    // Instancia o serviço de busca de sobremesas
    const findSobremesaService = new FindSobremesaService();

    // Executa a lógica de busca passando o nome capturado da URL.
    // O 'await' aguarda a consulta ao banco de dados ser finalizada.
    const sobremesa = await findSobremesaService.execute(name);

    // Envia a resposta de volta ao cliente com o objeto da sobremesa encontrada
    return reply.send(sobremesa);
  }
}

// Exporta o controller para ser vinculado a uma rota na aplicação
export { FindSobremesaController };