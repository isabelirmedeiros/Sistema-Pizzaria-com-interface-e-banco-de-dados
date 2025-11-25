// Importa ícones para botões (trash - deletar, edit - editar, search - buscar)
import { FiTrash, FiEdit, FiSearch } from "react-icons/fi";
// Importa configuração da API para comunicação com o backend
import { api } from "./services/api";
// Importa hooks essenciais do React
import { useEffect, useState, useRef } from "react";
// Importa tipo para eventos de formulário
import type { FormEvent } from "react";
// Importa tipo para respostas HTTP do Axios
import type { AxiosResponse } from "axios";

// Interface que define a estrutura de uma Sobremesa
interface SobremesaProps {
  id: string;           // Identificador único
  name: string;         // Nome da sobremesa
  ingredients: string;  // Ingredientes da sobremesa
  price: number;        // Preço em reais
}

// Componente principal para gerenciar sobremesas (CRUD)
export default function Sobremesas() {
  // Estado que armazena a lista completa de sobremesas
  const [sobremesas, setSobremesas] = useState<SobremesaProps[]>([]);
  // Estado que marca qual sobremesa está sendo editada (null se nenhuma)
  const [editingSobremesa, setEditingSobremesa] = useState<SobremesaProps | null>(null);
  // Estado para o valor do input de busca
  const [searchId, setSearchId] = useState<string>("");
  // Estado que armazena o resultado da busca
  const [searchResult, setSearchResult] = useState<SobremesaProps | null>(null);

  // Referências diretas aos elementos DOM (inputs)
  const nameRef = useRef<HTMLInputElement | null>(null);          // Input de nome
  const ingredientsRef = useRef<HTMLInputElement | null>(null);   // Input de ingredientes
  const priceRef = useRef<HTMLInputElement | null>(null);         // Input de preço
  const searchNameRef = useRef<HTMLInputElement | null>(null);    // Input de busca

  // Função para limpar todos os inputs do formulário
  function clearInputs() {
    // Reseta cada input para vazio
    if (nameRef.current) nameRef.current.value = "";
    if (ingredientsRef.current) ingredientsRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
    // Cancela modo de edição
    setEditingSobremesa(null);
  }

  // Hook que executa uma única vez ao montar o componente
  useEffect(() => {
    // Carrega as sobremesas do backend ao inicializar
    loadSobremesas();
  }, []); // Array vazio = executa apenas uma vez

  // Função assíncrona para buscar sobremesas do backend
  async function loadSobremesas() {
    try {
      // Faz requisição GET para obter todas as sobremesas
      const response = await api.get("/sobremesas");
      // Armazena no estado
      setSobremesas(response.data);
    } catch (err) {
      // Se houver erro, registra no console
      console.error("Erro ao carregar sobremesas:", err);
    }
  }

  // Função para salvar uma sobremesa (criar nova ou editar existente)
  async function handleSubmit(event: FormEvent) {
    // Previne comportamento padrão (recarregar a página)
    event.preventDefault();

    // Valida se todos os campos obrigatórios foram preenchidos
    if (!nameRef.current || !ingredientsRef.current || !priceRef.current) {
      alert("Preencha todos os campos.");
      return; // Sai se algum campo estiver vazio
    }

    // Cria objeto com os dados da sobremesa
    const sobremesaData = {
      name: nameRef.current.value,                    // Nome da sobremesa
      ingredients: ingredientsRef.current.value,      // Ingredientes
      price: Number(priceRef.current.value),         // Preço convertido para número
    };

    try {
      // Variável para armazenar resposta do servidor
      let response: AxiosResponse<SobremesaProps>;
      
      // Verifica se está no modo edição ou criação
      if (editingSobremesa) {
        // MODO EDIÇÃO: Envia PUT com os dados da sobremesa a editar
        response = await api.put("/sobremesa", {
          id: editingSobremesa.id,      // ID da sobremesa sendo editada
          ...sobremesaData,             // Espalha os dados
        });

        // Atualiza a lista: substitui a sobremesa antiga pela nova
        setSobremesas((prev) =>
          prev.map((sobremesa) =>
            sobremesa.id === editingSobremesa.id ? response.data : sobremesa
          )
        );
        // Sai do modo edição
        setEditingSobremesa(null);
      } else {
        // MODO CRIAR: Envia POST para criar nova sobremesa
        response = await api.post("/sobremesa", sobremesaData);
        // Adiciona a nova sobremesa ao final da lista
        setSobremesas((prevSobremesas) => [...prevSobremesas, response.data]);
      }

      // Limpa o formulário
      clearInputs();

      // Se estava fazendo busca, limpa também
      if (searchResult) {
        clearSearch();
      }
    } catch (err) {
      console.error("Erro ao salvar sobremesa:", err);
      alert("Ocorreu um erro ao salvar a sobremesa.");
    }
  }

  // Função para deletar uma sobremesa
  async function handleDelete(id: string) {
    // Pede confirmação do usuário antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar esta sobremesa?")) {
      return; // Cancela se usuário disser não
    }

    try {
      // Envia DELETE para remover do backend
      await api.delete("/sobremesa", {
        params: { id }, // Passa ID como parâmetro
      });

      // Remove da lista local (mantém apenas as que têm IDs diferentes)
      setSobremesas((prev) => prev.filter((sobremesa) => sobremesa.id !== id));

      // Se a deletada era resultado de busca, limpa a busca
      if (searchResult?.id === id) {
        clearSearch();
      }
    } catch (err) {
      console.error("Erro ao deletar sobremesa:", err);
      alert("Ocorreu um erro ao deletar a sobremesa.");
    }
  }

  // Função para entrar em modo de edição
  function handleEdit(sobremesa: SobremesaProps) {
    // Marca qual sobremesa vai editar
    setEditingSobremesa(sobremesa);
  }

  // Função para cancelar edição
  function handleCancelEdit() {
    // Sai do modo edição
    setEditingSobremesa(null);
    // Limpa o formulário
    clearInputs();
  }

  // Função para buscar sobremesa pelo nome
  async function handleSearchByName() {
    // Valida se o campo de busca foi preenchido
    if (!searchNameRef.current || searchNameRef.current.value.trim() === "") {
      alert("Digite um nome para buscar.");
      return;
    }

    // Pega o nome a buscar
    const nameToSearch = searchNameRef.current.value;

    try {
      // Faz requisição GET procurando sobremesa pelo nome
      const response = await api.get(`/sobremesa/${nameToSearch}`);
      // Armazena o resultado
      setSearchResult(response.data);
    } catch (err) {
      console.error("Erro ao buscar sobremesa:", err);
      alert("Sobremesa não encontrada.");
      // Reseta se não encontrar
      setSearchResult(null);
    }
  }

  // Função para limpar busca e voltar à lista completa
  function clearSearch() {
    // Remove resultado de busca
    setSearchResult(null);
    // Limpa input de busca
    if (searchNameRef.current) searchNameRef.current.value = "";
    // Reseta estado
    setSearchId("");
    // Recarrega todas as sobremesas
    loadSobremesas();
  }

  // Define qual lista mostrar: se tem resultado de busca, mostra só esse; senão mostra todas
  const displayList = searchResult ? [searchResult] : sobremesas;

  return (
    <div>
      <div className="content-header">
        <h1>Gerenciamento de Sobremesas</h1>
      </div>

      <div className="form-container">
        <h2>{editingSobremesa ? "Editar Sobremesa" : "Cadastrar Sobremesa"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              placeholder="Digite a sobremesa..."
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
              placeholder="Digite o preço..."
              ref={priceRef}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingSobremesa ? "Salvar Edição" : "Cadastrar"}
            </button>
            {editingSobremesa && (
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
        <h2>Pesquisar Sobremesa por Nome</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Digite um nome..."
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
        <h2>{searchResult ? "Resultado da Busca" : "Lista de Sobremesas"}</h2>
        {displayList.length === 0 ? (
          <p className="list-empty">
            {searchResult === null && sobremesas.length === 0
              ? "Nenhuma sobremesa cadastrada."
              : "Nenhuma sobremesa encontrada."}
          </p>
        ) : (
          displayList.map((sobremesa) => (
            <article key={sobremesa.id} className="list-item">
              <p>
                <span>Nome:</span> {sobremesa.name}
              </p>
              <p>
                <span>Ingredientes:</span> {sobremesa.ingredients}
              </p>
              <p>
                <span>Preço:</span> R$ {sobremesa.price.toFixed(2)}
              </p>

              <div className="list-item-actions">
                <button
                  onClick={() => handleEdit(sobremesa)}
                  className="btn-edit"
                >
                  <FiEdit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sobremesa.id)}
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
