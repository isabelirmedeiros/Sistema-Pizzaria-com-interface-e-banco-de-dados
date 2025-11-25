import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço que contém a lógica de negócio para criar um cliente.
// (Nota: Parece haver um pequeno erro de digitação no nome da classe importada "Servie" em vez de "Service", mas a função é importar a lógica).
import { CreateCustomerServie } from "../CustomerServices/CreateCustomerService";

class CreateCustomerController {
    // Método handle: Recebe a requisição HTTP e gerencia o fluxo de resposta.
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Desestrutura e tipa os dados recebidos no corpo da requisição (request.body).
        // Aqui estamos extraindo name, email, cpf e telefone para passar ao serviço.
        const { name, email, cpf, telefone } = request.body as { name: string, email: string, cpf: string, telefone: string };
        
        // Logs para depuração: Imprime no terminal do servidor o nome e email recebidos.
        // Isso ajuda a verificar se os dados estão chegando corretamente na API.
        console.log(name);
        console.log(email);

        // Instancia a classe de serviço que contém a lógica de gravação no banco.
        const customerService = new CreateCustomerServie()

        // Executa o serviço passando os dados coletados.
        // O 'await' garante que a resposta só seja enviada após o cliente ser criado no banco.
        const customer = await customerService.execute({ name, email, cpf, telefone });

        // Retorna ao cliente (frontend/insomnia) o objeto do cliente que foi criado.
        reply.send(customer)
    }
}

// Exporta o controller para ser utilizado no arquivo de definição de rotas.
export { CreateCustomerController };