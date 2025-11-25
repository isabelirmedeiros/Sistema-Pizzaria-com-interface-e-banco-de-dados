// OrderService/SalesReportService.ts
import prismaClient from '../prisma';

// Define o formato dos dados de saída para o relatório diário
interface DailyReportItem {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

// Define o formato dos dados de saída para o relatório mensal
interface MonthlyReportItem {
  month: string;
  totalOrders: number;
  totalRevenue: number;
}

class SalesReportService {

  // Método para gerar o relatório diário (agrupado por dia)
  async getDailySalesReport(startDate?: string, endDate?: string): Promise<DailyReportItem[]> {
    
    // === 1. Construção do Filtro ($match) ===
    const matchStage: any = {};
    
    // Se houver datas para filtrar, configuramos o filtro no campo 'createdAt'
    if (startDate || endDate) {
      matchStage.createdAt = {};
      
      // Data inicial: Busca registros maiores ou iguais ($gte) a data informada
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      
      // Data final: Precisamos incluir o dia inteiro. 
      // Se o usuário manda "2023-10-10", o sistema entende 00:00.
      // Adicionamos +1 dia para pegar tudo até as 23:59 do dia solicitado (menor que o dia seguinte).
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        matchStage.createdAt.$lt = endOfDay; // $lt = less than (menor que)
      }
    }

    // === 2. Construção do Pipeline de Agregação (MongoDB) ===
    const pipeline: any[] = [];

    // Adiciona o estágio de filtro se houver critérios definidos acima
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        // Estágio de Agrupamento ($group)
        $group: {
          _id: {
            // Extrai as partes da data para agrupar corretamente
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          // Conta quantos pedidos existem nesse grupo (soma 1 para cada documento)
          totalOrders: { $sum: 1 },
          // Soma o valor do campo 'totalPrice' para obter a receita total
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        // Estágio de Projeção ($project): Formata como os dados serão mostrados
        $project: {
          _id: 0, // Remove o ID complexo criado pelo grupo
          date: {
            // Reconstrói a data em string legível ("AAAA-MM-DD")
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          totalOrders: 1, // Mantém o campo
          totalRevenue: 1, // Mantém o campo
        },
      },
      {
        // Ordena pela data de forma ascendente (antigo -> recente)
        $sort: { date: 1 },
      }
    );

    // === 3. Execução da Consulta ===
    // Executa o pipeline bruto (Raw) diretamente no MongoDB via Prisma.
    // Isso é necessário pois o Prisma padrão não suporta agrupações complexas por data nativamente.
    const rawResult = await prismaClient.order.aggregateRaw({ pipeline });

    // Forçamos a tipagem do resultado bruto para o nosso array de interface
    const result = rawResult as unknown as DailyReportItem[];

    // Mapeia o resultado final para garantir formatação numérica (casas decimais)
    return result.map(item => ({
      date: item.date,
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue ? parseFloat(item.totalRevenue.toFixed(2)) : 0,
    }));
  }

  // Método para gerar o relatório mensal (agrupado por mês)
  async getMonthlySalesReport(year?: number): Promise<MonthlyReportItem[]> {
    const matchStage: any = {};
    
    // Se um ano for informado, filtra os registros desse ano específico.
    // De 01 de Jan do ano X até 01 de Jan do ano X+1.
    if (year) {
      matchStage.createdAt = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      };
    }

    const pipeline: any[] = [];

    // Adiciona o filtro ($match)
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        // Agrupamento: Desta vez ignoramos o dia, agrupando apenas por Ano e Mês
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        // Projeção: Formata a saída como "AAAA-MM"
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          totalOrders: 1,
          totalRevenue: 1,
        },
      },
      {
        // Ordena pelos meses
        $sort: { month: 1 },
      }
    );

    // Executa a agregação no banco
    const rawResult = await prismaClient.order.aggregateRaw({ pipeline });

    // Tipagem e tratamento dos dados
    const result = rawResult as unknown as MonthlyReportItem[];

    return result.map(item => ({
      month: item.month,
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue ? parseFloat(item.totalRevenue.toFixed(2)) : 0,
    }));
  }
}

export { SalesReportService };