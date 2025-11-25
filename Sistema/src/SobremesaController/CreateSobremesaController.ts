import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de negócio de criar a sobremesa
import { CreateSobremesaServie } from "../SobremesaService/CreateSobremesaService";

class CreateSobremesaController {
    // Método handle: Gerencia a requisição HTTP recebida pela rota
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai 'name', 'ingredients' e 'price' do corpo da requisição (JSON).
        // A tipagem 'as { ... }' ajuda o TypeScript a entender o formato dos dados recebidos.
        const { name, ingredients, price } = request.body as { name: string, ingredients: string, price: number };

        // Instancia a classe de serviço para poder utilizar a lógica de criação.
        const sobremesaService = new CreateSobremesaServie()

        // Chama o método execute do serviço passando os dados recebidos.
        // O 'await' aguarda o banco de dados processar a criação antes de continuar.
        const sobremesa = await sobremesaService.execute({ name, ingredients, price });

        // Envia a resposta (o objeto da sobremesa criada) de volta ao cliente.
        reply.send(sobremesa)
    }
}

// Exporta o controller para ser usado no arquivo de rotas.
export { CreateSobremesaController };