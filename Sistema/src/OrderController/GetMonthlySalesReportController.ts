// OrderController/GetMonthlySalesReportController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
// Importa o serviço que contém a lógica de negócio para agregar as vendas e separar por mês
import { SalesReportService } from '../OrderService/SalesReportService';

// Define a interface para os parâmetros de query (parâmetros da URL).
// O 'year' é opcional (?) e vem como string pois tudo na URL é texto (ex: ...?year=2023).
interface GetMonthlyReportQuery {
  year?: string; 
}

class GetMonthlySalesReportController {
  // Método handle: Gerencia a requisição para gerar o relatório mensal
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    // Extrai o parâmetro 'year' da query string da URL.
    const { year } = request.query as GetMonthlyReportQuery;

    // Instancia o serviço de relatórios.
    const service = new SalesReportService();

    try {
      // Conversão de Tipos:
      // O ternário verifica: Se 'year' foi enviado, usa parseInt para converter de string ('2023') para número (2023).
      // O '10' indica que é sistema decimal. Se não foi enviado, fica undefined.
      const yearNum = year ? parseInt(year, 10) : undefined;

      // Validação de Entrada:
      // Se o usuário enviou um ano (year existe), mas a conversão falhou (isNaN - Not a Number),
      // significa que enviaram texto inválido (ex: ?year=abril). Retorna erro 400.
      if (year && isNaN(yearNum as number)) {
        return reply.status(400).send({ error: "Parâmetro 'year' deve ser um número válido." });
      }

      // Executa o serviço passando o ano já convertido numericamente.
      // O 'await' aguarda o processamento dos dados.
      const report = await service.getMonthlySalesReport(yearNum);
      
      // Retorna sucesso (200) com o objeto do relatório.
      return reply.status(200).send(report);

    } catch (error: any) {
      // Tratamento de erros inesperados:
      // Loga o erro no terminal para o desenvolvedor analisar.
      console.error("Erro ao gerar relatório mensal:", error);
      
      // Retorna erro 500 (Internal Server Error) para o cliente.
      return reply.status(500).send({ error: error.message || "Erro interno do servidor." });
    }
  }
}

export { GetMonthlySalesReportController };