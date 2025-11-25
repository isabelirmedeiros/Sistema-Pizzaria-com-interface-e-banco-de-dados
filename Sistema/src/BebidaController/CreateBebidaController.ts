import { FastifyRequest, FastifyReply } from "fastify";
// Importa o serviço responsável pela lógica de negócio (regras de criação) da bebida
import { CreateBebidaService } from "../BebidaService/CreateBebidaService";

class CreateBebidaController {
    // Método handle: Responsável por receber a requisição HTTP e devolver a resposta.
    // É assíncrono (async) pois operações de banco de dados geralmente levam tempo.
    async handle(request: FastifyRequest, reply: FastifyReply) {
        
        // Extrai as propriedades 'name' e 'price' do corpo da requisição (JSON enviado pelo cliente).
        // O uso de 'as { ... }' serve para tipar esses dados, garantindo que o TypeScript reconheça o formato esperado.
        const { name, price } = request.body as { name: string, price: number };

        // Instancia a classe de serviço. É aqui que a lógica real de salvar no banco de dados reside,
        // mantendo o Controller limpo e focado apenas em receber/enviar dados.
        const bebidaService = new CreateBebidaService();

        // Executa o serviço passando os dados extraídos.
        // O 'await' faz o código esperar a conclusão da criação da bebida antes de continuar.
        const bebida = await bebidaService.execute({ name, price });

        // Utiliza o objeto 'reply' do Fastify para enviar a resposta (a bebida criada) de volta ao cliente.
        reply.send(bebida);
    }
}

// Exporta a classe do Controller para que ela possa ser importada e usada no arquivo de rotas.
export { CreateBebidaController };