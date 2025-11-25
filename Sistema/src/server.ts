/*
Ana Carolina Santos - RA: 2506285
Ekaterini Kotsis Milani - RA: 2510337
Isabeli Rosa de Medeiros - RA: 2503388 
Raul dos Santos Machado - RA: 2521975
*/ 

import Fastify from 'fastify';
// Importa o plugin de CORS. Isso é essencial para permitir que aplicações Frontend (React, Vue, etc.)
// hospedadas em outros domínios ou portas consigam fazer requisições para esta API.
import cors from '@fastify/cors'
// Importa o arquivo onde todas as rotas da aplicação foram definidas.
import { routes } from './routes';
// Importa a tipagem de erro do Fastify para garantir a tipagem correta no TypeScript.
import type { FastifyError } from 'fastify';

// Inicializa a instância do Fastify.
// A opção { logger: true } ativa os logs no terminal, permitindo ver cada requisição que chega,
// o tempo de resposta e possíveis erros, o que ajuda muito no desenvolvimento/debug.
const app = Fastify({logger: true})

// Define um manipulador de erros global (Global Error Handler).
// Sempre que um erro for lançado (throw new Error) em qualquer Service ou Controller e não for tratado lá,
// ele cairá nesta função. Aqui padronizamos a resposta de erro como Status 400 (Bad Request).
app.setErrorHandler((error: FastifyError, request, reply) => {
    reply.code(400).send({message: error.message})
})

// Função assíncrona responsável por configurar e "subir" o servidor.
const start = async () => {

    // Registra o plugin do CORS na aplicação.
    await app.register(cors, {
        origin: "*", // Libera o acesso para qualquer origem (URL). Em produção, recomenda-se colocar a URL específica do seu site.
        methods: ["GET", "POST", "PUT", "DELETE"] // Define quais métodos HTTP são permitidos.
    });

    // Registra as rotas da aplicação que importamos do arquivo './routes'.
    await app.register(routes);
    
    try{
        // Tenta iniciar o servidor escutando na porta 3333.
        // A API estará disponível em: http://localhost:3333
        await app.listen({port: 3333})
    } catch(err){
        // Se ocorrer algum erro fatal na inicialização (ex: porta já em uso), 
        // o processo do Node.js é encerrado com código de erro 1.
        process.exit(1)
    }
}

// Executa a função para iniciar o servidor.
start();