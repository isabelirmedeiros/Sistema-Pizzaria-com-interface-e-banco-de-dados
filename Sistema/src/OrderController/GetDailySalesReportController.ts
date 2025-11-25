// OrderController/GetDailySalesReportController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
// Importa o serviço que contém a lógica pesada de buscar as vendas e agrupar os dados
import { SalesReportService } from '../OrderService/SalesReportService';

// Define a interface para os parâmetros de query (parâmetros de URL).
// O símbolo '?' indica que esses campos são opcionais.
// Se o usuário não enviar, o serviço provavelmente assumirá uma data padrão (ex: hoje).
interface GetDailyReportQuery {
  startDate?: string;
  endDate?: string;
}

class GetDailySalesReportController {
  // Método handle: Ponto de entrada da requisição para gerar o relatório
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai as datas da query string da URL.
    // Exemplo de chamada: GET /relatorio/vendas?startDate=2023-01-01&endDate=2023-01-31
    const { startDate, endDate } = request.query as GetDailyReportQuery;

    // Instancia o serviço de relatórios
    const service = new SalesReportService();

    try {
      // Chama o método do serviço passando as datas (se existirem).
      // O 'await' espera o processamento (consultas ao banco, somas, etc) terminar.
      const report = await service.getDailySalesReport(startDate, endDate);
      
      // Se tudo der certo, retorna o status 200 (OK) com o JSON do relatório.
      return reply.status(200).send(report);

    } catch (error: any) {
      // Se ocorrer algum erro durante a geração do relatório:
      // 1. Loga o erro no console do servidor para o desenvolvedor analisar.
      console.error("Erro ao gerar relatório diário:", error);
      
      // 2. Retorna o status 500 (Internal Server Error) para o cliente/frontend,
      // com uma mensagem de erro amigável ou a mensagem original do erro.
      return reply.status(500).send({ error: error.message || "Erro interno do servidor." });
    }
  }
}

export { GetDailySalesReportController };