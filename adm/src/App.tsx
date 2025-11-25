import { useState } from "react";
// Importa todos os componentes de página da aplicação
import Customer from "./Customer";
import Pizza from "./Pizza";
import Sobremesa from "./Sobremesa";
import Bebida from "./Bebida";
import Pedidos from "./Pedidos";
import Vendas from "./Vendas";

// Componente principal da aplicação - gerencia o layout e navegação
export default function App() {
  // Estado para controlar qual página está sendo visualizada
  // Começa mostrando a página de clientes por padrão
  const [page, setPage] = useState("customers");

  // Função que renderiza o componente correto baseado na página selecionada
  // Funciona como um sistema de "abas" usando switch/case
  function renderPage() {
    switch (page) {
      case "customers":
        return <Customer />;
      case "pizzas":
        return <Pizza />;
      case "sobremesas":
        return <Sobremesa />;
      case "bebidas":
        return <Bebida />;
      case "pedidos":
        return <Pedidos />;
      case "vendas":
        return <Vendas />;
      default:
        return <Customer />;
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar - menu lateral com os botões de navegação */}
      <aside className="sidebar">
        <h1>Sistema de Pizzaria</h1>
        
        {/* Lista de botões do menu */}
        <ul className="sidebar-menu">
          {/* Cada li contém um botão que muda a página */}
          {/* A classe 'active' é aplicada quando a página atual corresponde ao botão */}
          
          <li>
            <button
              onClick={() => setPage("customers")}
              className={page === "customers" ? "active" : ""}
            >
              Clientes
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage("pizzas")}
              className={page === "pizzas" ? "active" : ""}
            >
              Pizzas
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage("sobremesas")}
              className={page === "sobremesas" ? "active" : ""}
            >
              Sobremesas
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage("bebidas")}
              className={page === "bebidas" ? "active" : ""}
            >
              Bebidas
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage("pedidos")}
              className={page === "pedidos" ? "active" : ""}
            >
              Pedidos
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage("vendas")}
              className={page === "vendas" ? "active" : ""}
            >
              Vendas
            </button>
          </li>
        </ul>
      </aside>

      {/* Área principal de conteúdo onde o componente selecionado é renderizado */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
