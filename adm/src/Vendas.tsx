// Importa React e seus hooks (useState para estado, useEffect para side effects)
import React, { useState, useEffect } from 'react';
// Importa axios para fazer requisições HTTP ao backend
import axios from 'axios';

// Interface que define a estrutura de um relatório diário
interface DailyReportItem {
  date: string;         // Data do relatório
  totalOrders: number;  // Quantidade total de pedidos
  totalRevenue: number; // Receita total do dia
}

// Interface que define a estrutura de um relatório mensal
interface MonthlyReportItem {
  month: string;        // Mês/período do relatório
  totalOrders: number;  // Quantidade total de pedidos
  totalRevenue: number; // Receita total do mês
}

// URL base da API do backend
const API_BASE_URL = 'http://localhost:3333';

// Componente principal para exibir relatórios de vendas
const Vendas: React.FC = () => {
  // Estado para armazenar o relatório diário
  const [dailyReport, setDailyReport] = useState<DailyReportItem[]>([]);
  // Estado para armazenar o relatório mensal
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportItem[]>([]);
  // Estado para controlar se está carregando dados
  const [loading, setLoading] = useState(false);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Estado para armazenar a data inicial do filtro diário
  const [dailyStartDate, setDailyStartDate] = useState('');
  // Estado para armazenar a data final do filtro diário
  const [dailyEndDate, setDailyEndDate] = useState('');
  // Estado para armazenar o ano do filtro mensal (inicializa com ano atual)
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear().toString());

  // Função assíncrona para buscar relatório diário do backend
  const fetchDailyReport = async () => {
    // Marca como carregando
    setLoading(true);
    // Limpa mensagens de erro anteriores
    setError(null);
    try {
      // Cria objeto para armazenar parâmetros da URL
      const params = new URLSearchParams();
      // Se tem data inicial, adiciona ao parâmetro
      if (dailyStartDate) params.append('startDate', dailyStartDate);
      // Se tem data final, adiciona ao parâmetro
      if (dailyEndDate) params.append('endDate', dailyEndDate);

      // Faz requisição GET para obter relatório diário
      const response = await axios.get<DailyReportItem[]>(
        `${API_BASE_URL}/reports/daily`, // URL completa
        { params }                         // Passa os parâmetros
      );
      // Armazena os dados no estado
      setDailyReport(response.data);
    } catch (err: any) {
      // Se houver erro, registra no console
      console.error("Erro ao carregar relatório diário:", err);
      // Define mensagem de erro para mostrar ao usuário
      setError(
        err.response?.data?.error || "Falha ao carregar relatório diário."
      );
    } finally {
      // Sempre executa ao fim (sucesso ou erro) - marca como carregado
      setLoading(false);
    }
  };

  // Função assíncrona para buscar relatório mensal do backend
  const fetchMonthlyReport = async () => {
    // Marca como carregando
    setLoading(true);
    // Limpa mensagens de erro anteriores
    setError(null);
    try {
      // Cria objeto para armazenar parâmetros da URL
      const params = new URLSearchParams();
      // Se tem ano, adiciona ao parâmetro
      if (monthlyYear) params.append('year', monthlyYear);

      // Faz requisição GET para obter relatório mensal
      const response = await axios.get<MonthlyReportItem[]>(
        `${API_BASE_URL}/reports/monthly`, // URL completa
        { params }                          // Passa os parâmetros
      );
      // Armazena os dados no estado
      setMonthlyReport(response.data);
    } catch (err: any) {
      // Se houver erro, registra no console
      console.error("Erro ao carregar relatório mensal:", err);
      // Define mensagem de erro para mostrar ao usuário
      setError(
        err.response?.data?.error || "Falha ao carregar relatório mensal."
      );
    } finally {
      // Sempre executa ao fim (sucesso ou erro) - marca como carregado
      setLoading(false);
    }
  };

  // Hook que executa ao montar o componente
  useEffect(() => {
    // Carrega ambos os relatórios quando página abre
    fetchDailyReport();
    fetchMonthlyReport();
  }, []); // Array vazio = executa apenas uma vez

  return (
    <div>
      {/* Cabeçalho da página com título */}
      <div className="content-header">
        <h1>Relatórios de Vendas</h1>
      </div>

      {/* Mensagem de carregamento - mostra enquanto dados estão sendo buscados */}
      {loading && (
        <div className="alert alert-success">
          Carregando relatórios...
        </div>
      )}
      
      {/* Mensagem de erro - mostra se algo der errado */}
      {error && (
        <div className="alert alert-error">
          Erro: {error}
        </div>
      )}

      {/* SEÇÃO DE RELATÓRIO DIÁRIO */}
      <div className="form-container">
        <h2>Relatório Diário</h2>
        {/* Flexbox com inputs para filtros e botão */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {/* Campo para data inicial */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="dailyStartDate" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--dark-text)' }}>
              Data Início:
            </label>
            {/* Input date - seletor de data */}
            <input
              type="date"
              id="dailyStartDate"
              value={dailyStartDate}
              onChange={(e) => setDailyStartDate(e.target.value)} // Atualiza estado ao mudar
              className="form-group"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          
          {/* Campo para data final */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="dailyEndDate" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--dark-text)' }}>
              Data Fim:
            </label>
            {/* Input date - seletor de data */}
            <input
              type="date"
              id="dailyEndDate"
              value={dailyEndDate}
              onChange={(e) => setDailyEndDate(e.target.value)} // Atualiza estado ao mudar
              className="form-group"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          
          {/* Botão para gerar o relatório */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={fetchDailyReport} // Chama função ao clicar
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Gerar Diário
            </button>
          </div>
        </div>

        {/* Mostra tabela se há dados, senão mostra mensagem vazia */}
        {dailyReport.length > 0 ? (
          <div style={{ overflowX: 'auto' }}> {/* Permite scroll horizontal em telas pequenas */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '15px',
            }}>
              {/* Cabeçalho da tabela */}
              <thead>
                <tr style={{ backgroundColor: 'var(--accent-pink-light)' }}>
                  <th style={tableHeaderStyle}>Data</th>
                  <th style={tableHeaderStyle}>Total de Pedidos</th>
                  <th style={tableHeaderStyle}>Receita Total</th>
                </tr>
              </thead>
              {/* Corpo da tabela - mapeia cada item do relatório */}
              <tbody>
                {dailyReport.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={tableCellStyle}>{item.date}</td>
                    <td style={tableCellStyle}>{item.totalOrders}</td>
                    <td style={tableCellStyle}>
                      {/* Receita destaca da em verde/cor primária */}
                      <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        R$ {item.totalRevenue.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Mensagem quando não há dados para mostrar
          <p className="list-empty">Nenhum dado diário encontrado para os filtros selecionados.</p>
        )}
      </div>

      {/* SEÇÃO DE RELATÓRIO MENSAL */}
      <div className="form-container">
        <h2>Relatório Mensal</h2>
        {/* Flexbox com input de ano e botão */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {/* Campo para ano */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label htmlFor="monthlyYear" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--dark-text)' }}>
              Ano:
            </label>
            {/* Input number - campo para digitar o ano */}
            <input
              type="number"
              id="monthlyYear"
              value={monthlyYear}
              onChange={(e) => setMonthlyYear(e.target.value)} // Atualiza estado ao mudar
              className="form-group"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          
          {/* Botão para gerar o relatório mensal */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={fetchMonthlyReport} // Chama função ao clicar
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Gerar Mensal
            </button>
          </div>
        </div>

        {/* Mostra tabela se há dados, senão mostra mensagem vazia */}
        {monthlyReport.length > 0 ? (
          <div style={{ overflowX: 'auto' }}> {/* Permite scroll horizontal em telas pequenas */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '15px',
            }}>
              {/* Cabeçalho da tabela */}
              <thead>
                <tr style={{ backgroundColor: 'var(--accent-pink-light)' }}>
                  <th style={tableHeaderStyle}>Mês</th>
                  <th style={tableHeaderStyle}>Total de Pedidos</th>
                  <th style={tableHeaderStyle}>Receita Total</th>
                </tr>
              </thead>
              {/* Corpo da tabela - mapeia cada item do relatório */}
              <tbody>
                {monthlyReport.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={tableCellStyle}>{item.month}</td>
                    <td style={tableCellStyle}>{item.totalOrders}</td>
                    <td style={tableCellStyle}>
                      {/* Receita destaca em verde/cor primária */}
                      <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        R$ {item.totalRevenue.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Mensagem quando não há dados para mostrar
          <p className="list-empty">Nenhum dado mensal encontrado para os filtros selecionados.</p>
        )}
      </div>
    </div>
  );
};

// Estilos para o cabeçalho da tabela
// React.CSSProperties = tipo do TypeScript para objetos de estilo CSS
const tableHeaderStyle: React.CSSProperties = {
  padding: '14px',                            // Espaçamento interno
  textAlign: 'left',                          // Alinha texto à esquerda
  borderBottom: '2px solid var(--primary-color)', // Borda inferior verde
  fontWeight: '600',                          // Texto em negrito
  color: 'var(--dark-text)',                  // Cor do texto escuro
};

// Estilos para as células da tabela
const tableCellStyle: React.CSSProperties = {
  padding: '12px 14px',                       // Espaçamento interno
  textAlign: 'left',                          // Alinha texto à esquerda
  borderBottom: '1px solid var(--border-color)', // Borda inferior leve
  color: 'var(--dark-text)',                  // Cor do texto escuro
};

// Exporta o componente para ser usado em outro arquivo
export default Vendas;