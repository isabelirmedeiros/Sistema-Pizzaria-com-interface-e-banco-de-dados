import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de buscar um cliente específico (neste caso, pelo CPF)
import { FindCustomerService } from "../CustomerServices/FindCustomerService";

class FindCustomerController {
  // Método handle: Recebe a requisição para localizar um cliente
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai a propriedade 'cpf' dos parâmetros de rota (request.params).
    // Isso significa que o CPF é passado diretamente na URL como uma variável de caminho.
    // Exemplo de chamada esperada: "GET /cliente/12345678900" (onde 123... é o cpf)
    const { cpf } = request.params as { cpf: string };

    // Instancia o serviço de busca
    const service = new FindCustomerService();

    // Chama o método execute passando o CPF capturado da URL.
    // O 'await' aguarda a consulta ao banco de dados finalizar.
    const customer = await service.execute(cpf);

    // Retorna a resposta ao cliente com o objeto do consumidor encontrado
    return reply.send(customer);
  }
}

// Exporta o controller para ser vinculado a uma rota na aplicação
export { FindCustomerController };