// Importa o hook 'useState' do React para gerenciar o estado da aplicação
import { useState } from "react";

// Importa os componentes que representam as telas do sistema
import Pedidos from "./Pedidos";
// Importe o componente de cadastro de clientes
// (Nota: O caminho "./Cadastro" assume que o arquivo se chama Cadastro.tsx ou index.tsx dentro de uma pasta Cadastro)
import CreateCustomer from "./Cadastro";

export default function App() {
  // 1. Estado de Navegação:
  // Define qual tela está sendo exibida no momento.
  // Iniciamos com "cadastro" como valor padrão (a primeira tela que o usuário vê).
  const [page, setPage] = useState("cadastro");

  // 2. Função de Renderização Condicional:
  // Esta função age como um "roteador" simples.
  // Ela verifica o valor do estado 'page' e retorna o componente correspondente.
  function renderPage() {
    switch (page) {
      case "pedidos":
        return <Pedidos />;
      case "cadastro":
        return <CreateCustomer />; // Renderiza o formulário de cadastro
      default:
        // Caso o estado seja algo desconhecido, retorna Pedidos por segurança
        return <Pedidos />;
    }
  }

  return (
    // Container principal que engloba toda a aplicação (Sidebar + Conteúdo)
    <div className="app-container">
      
      {/* Sidebar: Barra lateral fixa com o menu de navegação */}
      <aside className="sidebar">
        <h1>Pizzaria</h1>
        <ul className="sidebar-menu">
          
          {/* Botão de Cadastro */}
          <li>
            <button 
              // Ao clicar, atualiza o estado 'page' para "cadastro".
              // Isso força o React a renderizar o componente novamente e executar 'renderPage()'
              onClick={() => setPage("cadastro")}
              
              // Estilização Condicional:
              // Se a página atual for "cadastro", adiciona a classe CSS "active".
              // Isso serve para deixar o botão destacado visualmente (ex: cor diferente).
              className={page === "cadastro" ? "active" : ""}
            >
             Cadastro
            </button>
          </li>

          {/* Botão de Pedidos */}
          <li>
            <button 
              // Ao clicar, muda o estado para "pedidos"
              onClick={() => setPage("pedidos")}
              // Verifica se "pedidos" é a página ativa para destacar o botão
              className={page === "pedidos" ? "active" : ""}
            >
              Meus Pedidos
            </button>
          </li>

        </ul>
      </aside>

      {/* 3. Área Principal (Main Content): */}
      {/* É aqui que o conteúdo dinâmico aparece. */}
      <main className="main-content">
        {/* Chamamos a função para renderizar o componente escolhido no switch acima */}
        {renderPage()}
      </main>
    </div>
  );
}