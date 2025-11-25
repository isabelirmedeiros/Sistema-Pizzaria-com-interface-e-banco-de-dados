// Importa ícones da biblioteca react-icons para os botões
import { FiTrash, FiEdit, FiSearch } from "react-icons/fi";
// Importa a configuração da API (Axios)
import { api } from "./services/api";
// Importa hooks do React para gerenciar estado e side effects
import { useEffect, useState, useRef } from "react";
// Importa tipos do React para eventos de formulário
import type { FormEvent } from "react";
// Importa tipo do Axios para tipagem de respostas HTTP
import type { AxiosResponse } from "axios";

// Interface que define a estrutura de dados de uma Pizza
// Todos os campos são strings ou números conforme o tipo de cada propriedade
interface PizzaProps {
  id: string;           // Identificador único da pizza
  name: string;         // Nome da pizza
  ingredients: string;  // Ingredientes da pizza
  price: number;        // Preço da pizza em reais
}

// Componente principal para gerenciar pizzas (CRUD - Create, Read, Update, Delete)
export default function Pizza() {
  // Estado que armazena a lista completa de pizzas carregadas do backend
  const [pizzas, setPizzas] = useState<PizzaProps[]>([]);
  // Estado que armazena a pizza sendo editada (null quando não está editando)
  const [editingPizza, setEditingPizza] = useState<PizzaProps | null>(null);
  // Estado para armazenar o valor da busca (input de pesquisa)
  const [searchId, setSearchId] = useState<string>("");
  // Estado que armazena o resultado da busca por nome
  const [searchResult, setSearchResult] = useState<PizzaProps | null>(null);

  // Referências (refs) para acessar os valores dos inputs do formulário diretamente do DOM
  const nameRef = useRef<HTMLInputElement | null>(null);          // Campo de nome
  const ingredientsRef = useRef<HTMLInputElement | null>(null);   // Campo de ingredientes
  const priceRef = useRef<HTMLInputElement | null>(null);         // Campo de preço
  const searchNameRef = useRef<HTMLInputElement | null>(null);    // Campo de busca

  // Função para limpar todos os inputs do formulário
  // Reseta os valores para string vazia e cancela qualquer edição em andamento
  function clearInputs() {
    if (nameRef.current) nameRef.current.value = "";
    if (ingredientsRef.current) ingredientsRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
    setEditingPizza(null); // Cancela modo de edição
  }

  // Hook que executa quando o componente é montado (carrega as pizzas do backend)
  useEffect(() => {
    loadPizzas();
  }, []); // [] garante que execute apenas uma vez

  // Função para carregar todas as pizzas do backend
  async function loadPizzas() {
    try {
      // Faz requisição GET para obter todas as pizzas
      const response = await api.get("/pizzas");
      // Armazena as pizzas no estado
      setPizzas(response.data);
    } catch (err) {
      console.error("Erro ao carregar pizzas:", err);
    }
  }

  // Função para salvar uma pizza (criar nova ou editar existente)
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Impede comportamento padrão do formulário

    // Valida se todos os campos foram preenchidos
    if (!nameRef.current || !ingredientsRef.current || !priceRef.current) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Prepara os dados da pizza para enviar ao backend
    const pizzaData = {
      name: nameRef.current.value,
      ingredients: ingredientsRef.current.value,
      price: Number(priceRef.current.value), // Converte string para número
    };

    try {
      let response: AxiosResponse<PizzaProps>;
      
      // Verifica se está editando ou criando nova pizza
      if (editingPizza) {
        // EDITAR: Envia PUT com o ID da pizza sendo editada
        response = await api.put("/pizza", {
          id: editingPizza.id,
          ...pizzaData,
        });
        
        // Atualiza a lista de pizzas: substitui a pizza antiga pela atualizada
        setPizzas((prevPizzas) =>
          prevPizzas.map((pizza) =>
            pizza.id === editingPizza.id ? response.data : pizza
          )
        );
        setEditingPizza(null); // Sai do modo edição
      } else {
        // CRIAR: Envia POST para criar nova pizza
        response = await api.post("/pizza", pizzaData);
        // Adiciona a nova pizza à lista
        setPizzas((prevPizzas) => [...prevPizzas, response.data]);
      }
      
      clearInputs(); // Limpa o formulário

      // Se tinha uma busca ativa, limpa também
      if (searchResult) {
        clearSearch();
      }
    } catch (err) {
      console.error("Erro ao salvar a pizza:", err);
      alert("Ocorreu um erro ao salvar a pizza.");
    }
  }

  // Função para deletar uma pizza
  async function handleDelete(id: string) {
    // Pede confirmação antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar esta pizza?")) {
      return;
    }

    try {
      // Envia DELETE para remover a pizza do backend
      await api.delete("/pizza", {
        params: { id }, // Passa o ID como parâmetro de query
      });

      // Remove a pizza da lista local
      setPizzas((prevPizzas) =>
        prevPizzas.filter((pizza) => pizza.id !== id)
      );

      // Se a pizza deletada era o resultado de uma busca, limpa a busca
      if (searchResult?.id === id) {
        clearSearch();
      }
    } catch (err) {
      console.error("Erro ao deletar pizza:", err);
      alert("Ocorreu um erro ao deletar a pizza.");
    }
  }

  // Função para entrar no modo de edição de uma pizza
  function handleEdit(pizza: PizzaProps) {
    setEditingPizza(pizza); // Marca a pizza para edição
  }

  // Função para cancelar a edição
  function handleCancelEdit() {
    setEditingPizza(null); // Sai do modo edição
    clearInputs();        // Limpa os campos
  }

  // Função para buscar uma pizza por nome
  async function handleSearchByName() {
    // Valida se o campo de busca foi preenchido
    if (!searchNameRef.current || searchNameRef.current.value.trim() === "") {
      alert("Por favor, digite um nome para buscar.");
      return;
    }

    const nameToSearch = searchNameRef.current.value;

    try {
      // Faz requisição GET para buscar pizza pelo nome
      const response = await api.get(`/pizza/${nameToSearch}`);
      // Armazena o resultado da busca
      setSearchResult(response.data);
    } catch (err) {
      console.error("Erro ao buscar pizza por nome:", err);
      alert("Pizza não encontrada ou ocorreu um erro na busca.");
      setSearchResult(null);
    }
  }

  // Função para limpar a busca e voltar a mostrar todas as pizzas
  function clearSearch() {
    setSearchResult(null); // Remove resultado de busca
    if (searchNameRef.current) searchNameRef.current.value = ""; // Limpa input
    setSearchId(""); // Reseta estado de busca
    loadPizzas(); // Recarrega todas as pizzas
  }

  // Define qual lista mostrar: se existe resultado de busca, mostra apenas esse;
  // caso contrário, mostra todas as pizzas
  const displayList = searchResult ? [searchResult] : pizzas;

  return (
    <div>
      <div className="content-header">
        <h1>Gerenciamento de Pizzas</h1>
      </div>

      <div className="form-container">
        <h2>{editingPizza ? "Editar Pizza" : "Cadastrar Pizza"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              placeholder="Digite a pizza..."
              ref={nameRef}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredientes:</label>
            <input
              id="ingredients"
              type="text"
              placeholder="Ingredientes..."
              ref={ingredientsRef}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço:</label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="Digite o preço.."
              ref={priceRef}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingPizza ? "Salvar Edição" : "Cadastrar"}
            </button>
            {editingPizza && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="search-container">
        <h2>Pesquisar Pizza por Nome</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Digite uma pizza para buscar..."
            ref={searchNameRef}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearchByName} className="btn-search">
            <FiSearch size={18} />
            Pesquisar
          </button>
          {searchResult && (
            <button onClick={clearSearch} className="btn-secondary">
              ✕ Limpar Busca
            </button>
          )}
        </div>
      </div>

      <div className="list-container">
        <h2>{searchResult ? "Resultado da Busca" : "Lista de Pizzas"}</h2>
        {displayList.length === 0 ? (
          <p className="list-empty">
            {searchResult === null && pizzas.length === 0
              ? "Nenhuma pizza cadastrada."
              : "Nenhuma pizza encontrada."}
          </p>
        ) : (
          displayList.map((pizza) => (
            <article key={pizza.id} className="list-item">
              <p>
                <span>Nome:</span> {pizza.name}
              </p>
              <p>
                <span>Ingredientes:</span> {pizza.ingredients}
              </p>
              <p>
                <span>Preço:</span> R$ {pizza.price.toFixed(2)}
              </p>

              <div className="list-item-actions">
                <button
                  onClick={() => handleEdit(pizza)}
                  className="btn-edit"
                >
                  <FiEdit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(pizza.id)}
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