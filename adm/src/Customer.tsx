// Importa ícones da biblioteca react-icons para os botões
import { FiTrash, FiEdit, FiSearch } from "react-icons/fi";
// Importa a configuração da API (Axios)
import { api } from "./services/api";
// Importa hooks do React para gerenciar estado e efeitos
import { useEffect, useState, useRef } from "react";
// Importa tipos do Axios para type-safety das requisições HTTP
import type { AxiosResponse } from "axios";
// Importa a interface do cliente (tipos)
import type { CustomerProps } from "./types/customer";
// Importa o componente reutilizável de formulário
import CustomerForm from "./components/CustomerForm";

// Componente principal para gerenciar clientes
export default function Customer() {
  // Estado para armazenar a lista de clientes buscada do backend
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  
  // Estado para saber qual cliente está sendo editado (null = não está editando)
  const [editingCustomer, setEditingCustomer] = useState<CustomerProps | null>(null);
  
  // Estado para armazenar o CPF digitado no campo de busca
  const [searchCpf, setSearchCpf] = useState<string>("");
  
  // Estado para armazenar o resultado da busca por CPF (null = nenhum resultado)
  const [searchResult, setSearchResult] = useState<CustomerProps | null>(null);
  
  // Referência para o input do CPF de busca (para acessar o valor direto do DOM)
  const searchCpfRef = useRef<HTMLInputElement | null>(null);

  // Hook que executa quando o componente é montado
  // Carrega a lista inicial de clientes
  useEffect(() => {
    loadCustomers();
  }, []);

  // Função para carregar todos os clientes do backend
  async function loadCustomers() {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  }

  // Função que é chamada quando o formulário é submetido
  // Trata tanto a criação quanto a edição de clientes
  async function handleFormSubmit(customerData: Omit<CustomerProps, "id">) {
    try {
      let response: AxiosResponse<CustomerProps>;
      
      if (editingCustomer) {
        // Se está editando, faz um PUT (atualização) com o ID do cliente
        console.log("Editando cliente com ID:", editingCustomer.id, "Dados:", customerData);
        response = await api.put("/customer", {
          id: editingCustomer.id,
          ...customerData,
        });
        console.log("Cliente editado com sucesso!");
        
        // Atualiza o cliente na lista local
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === editingCustomer.id ? response.data : customer
          )
        );
        setEditingCustomer(null);
      } else {
        // Se não está editando, faz um POST (criação) de novo cliente
        console.log("Criando novo cliente com dados:", customerData);
        response = await api.post("/customer", customerData);
        console.log("Cliente criado com sucesso!");
        // Adiciona o novo cliente à lista local
        setCustomers((prevCustomers) => [...prevCustomers, response.data]);
      }
      
      // Se tinha uma busca aberta, limpa ela
      if (searchResult) {
        clearSearch();
      }
      
      alert(editingCustomer ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert("Ocorreu um erro ao salvar o cliente.");
    }
  }

  // Função para deletar um cliente
  async function handleDelete(id: string) {
    // Pede confirmação antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar este cliente?")) {
      return;
    }

    try {
      console.log("Deletando cliente com ID:", id);
      await api.delete("/customer", {
        params: { id },
      });
      console.log("Cliente deletado com sucesso!");

      // Remove o cliente da lista local
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id)
      );

      // Se o cliente deletado era resultado da busca, limpa a busca
      if (searchResult?.id === id) {
        clearSearch();
      }
      
      alert("Cliente deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
      alert("Ocorreu um erro ao deletar o cliente.");
    }
  }

  // Função para preparar um cliente para edição
  // Apenas marca o cliente como "em edição" - o formulário carrega os dados
  function handleEdit(customer: CustomerProps) {
    console.log("Editando cliente:", customer);
    setEditingCustomer(customer);
  }

  // Função para cancelar a edição
  function handleCancelEdit() {
    setEditingCustomer(null);
  }

  // Função para buscar cliente por CPF
  async function handleSearchByCpf() {
    // Valida se o CPF foi preenchido
    if (!searchCpfRef.current || searchCpfRef.current.value.trim() === "") {
      alert("Por favor, digite um CPF para buscar.");
      return;
    }

    const cpfToSearch = searchCpfRef.current.value;

    try {
      // Faz uma requisição GET com o CPF como parâmetro
      const response = await api.get(`/customer/${cpfToSearch}`);
      setSearchResult(response.data);
    } catch (err) {
      console.error("Erro ao buscar cliente por CPF:", err);
      alert("Cliente não encontrado ou ocorreu um erro na busca.");
      setSearchResult(null);
    }
  }

  // Função para limpar o resultado da busca e voltar a mostrar todos
  function clearSearch() {
    setSearchResult(null);
    if (searchCpfRef.current) searchCpfRef.current.value = "";
    setSearchCpf("");
    loadCustomers(); // Recarrega a lista completa
  }

  // Define qual lista mostrar: resultado da busca ou todos os clientes
  const displayList = searchResult ? [searchResult] : customers;

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="content-header">
        <h1>Gerenciamento de Clientes</h1>
      </div>

      {/* Componente de formulário reutilizável */}
      {/* Passa as funções e estados necessários como props */}
      <CustomerForm
        onSubmit={handleFormSubmit}
        isEditing={editingCustomer !== null}
        editingCustomer={editingCustomer}
        onCancel={handleCancelEdit}
      />

      {/* Seção de busca por CPF */}
      <div className="search-container">
        <h2>Pesquisar Cliente por CPF</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Digite o CPF para buscar..."
            ref={searchCpfRef}
            value={searchCpf}
            onChange={(e) => setSearchCpf(e.target.value)}
          />
          <button onClick={handleSearchByCpf} className="btn-search">
            <FiSearch size={18} />
            Pesquisar
          </button>
          {/* Só mostra o botão "Limpar Busca" se houver um resultado */}
          {searchResult && (
            <button onClick={clearSearch} className="btn-secondary">
              ✕ Limpar Busca
            </button>
          )}
        </div>
      </div>

      {/* Seção da lista de clientes */}
      <div className="list-container">
        <h2>{searchResult ? "Resultado da Busca" : "Lista de Clientes"}</h2>
        
        {/* Se não há clientes, mostra mensagem vazia */}
        {displayList.length === 0 ? (
          <p className="list-empty">
            {searchResult === null && customers.length === 0
              ? "Nenhum cliente cadastrado."
              : "Nenhum cliente encontrado."}
          </p>
        ) : (
          // Caso contrário, renderiza cada cliente como um card
          displayList.map((customer) => (
            <article key={customer.id} className="list-item">
              <p>
                <span>Nome:</span> {customer.name}
              </p>
              <p>
                <span>CPF:</span> {customer.cpf}
              </p>
              <p>
                <span>E-mail:</span> {customer.email}
              </p>
              <p>
                <span>Telefone:</span> {customer.telefone}
              </p>

              {/* Botões de ação (Editar e Deletar) */}
              <div className="list-item-actions">
                <button
                  onClick={() => handleEdit(customer)}
                  className="btn-edit"
                >
                  <FiEdit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="btn-delete"
                >
                  <FiTrash size={16} />
                  Deletar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}