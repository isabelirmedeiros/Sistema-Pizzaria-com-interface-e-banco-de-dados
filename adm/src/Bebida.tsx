// Importa ícones para botões de trash (deletar), edit (editar) e search (buscar)
import { FiTrash, FiEdit, FiSearch } from "react-icons/fi";
// Importa configuração da API (Axios) para comunicação com backend
import { api } from "./services/api";
// Importa hooks do React: useEffect (side effects), useState (estado), useRef (referência DOM)
import { useEffect, useState, useRef } from "react";
// Importa tipo para eventos de formulário
import type { FormEvent } from "react";
// Importa tipo para respostas do Axios
import type { AxiosResponse } from "axios";

// Interface que define a estrutura de dados de uma Bebida
interface BebidaProps {
  id: string;      // Identificador único da bebida
  name: string;    // Nome da bebida
  price: number;   // Preço em reais
}

// Componente principal para gerenciar bebidas (CRUD operations)
export default function Bebidas() {
  // Estado que armazena a lista completa de bebidas do backend
  const [bebidas, setBebidas] = useState<BebidaProps[]>([]);
  // Estado que armazena a bebida sendo editada (null quando não está em modo edição)
  const [editingBebida, setEditingBebida] = useState<BebidaProps | null>(null);
  // Estado para armazenar o valor do campo de busca
  const [searchId, setSearchId] = useState<string>("");
  // Estado que armazena o resultado da busca por nome
  const [searchResult, setSearchResult] = useState<BebidaProps | null>(null);

  // Referências diretas ao DOM dos inputs do formulário
  const nameRef = useRef<HTMLInputElement | null>(null);       // Input de nome da bebida
  const priceRef = useRef<HTMLInputElement | null>(null);      // Input de preço
  const searchNameRef = useRef<HTMLInputElement | null>(null); // Input de busca

  // Função para limpar todos os inputs do formulário
  // Reseta valores e cancela edição em andamento
  function clearInputs() {
    // Limpa o input de nome
    if (nameRef.current) nameRef.current.value = "";
    // Limpa o input de preço
    if (priceRef.current) priceRef.current.value = "";
    // Cancela o modo de edição
    setEditingBebida(null);
  }

  // Hook que executa ao montar o componente
  // O array vazio [] significa que executa apenas uma vez
  useEffect(() => {
    // Carrega todas as bebidas do backend ao inicializar
    loadBebidas();
  }, []);

  // Função assíncrona para buscar todas as bebidas do backend
  async function loadBebidas() {
    try {
      // Faz requisição GET para obter bebidas do servidor
      const response = await api.get("/bebidas");
      // Armazena as bebidas no estado
      setBebidas(response.data);
    } catch (err) {
      // Se houver erro, registra no console
      console.error("Erro ao carregar bebidas:", err);
    }
  }

  // Função para salvar uma bebida (criar nova ou editar existente)
  async function handleSubmit(event: FormEvent) {
    // Previne comportamento padrão do formulário (recarregar página)
    event.preventDefault();

    // Valida se todos os campos foram preenchidos
    if (!nameRef.current || !priceRef.current) {
      alert("Preencha todos os campos.");
      return; // Sai da função se faltarem campos
    }

    // Prepara o objeto com dados da bebida para enviar ao backend
    const bebidaData = {
      name: nameRef.current.value,                  // Pega valor do input de nome
      price: Number(priceRef.current.value),       // Converte string para número
    };

    try {
      // Variável para armazenar resposta do servidor
      let response: AxiosResponse<BebidaProps>;
      
      // Verifica se está editando ou criando nova bebida
      if (editingBebida) {
        // MODO EDIÇÃO: Envia PUT com ID da bebida sendo editada
        response = await api.put("/bebida", {
          id: editingBebida.id,        // ID da bebida a editar
          ...bebidaData,               // Espalha os dados da bebida
        });

        // Atualiza a lista: substitui a bebida antiga pela atualizada
        setBebidas((prev) =>
          prev.map((bebida) =>
            bebida.id === editingBebida.id ? response.data : bebida
          )
        );
        // Sai do modo edição
        setEditingBebida(null);
      } else {
        // MODO CRIAR: Envia POST para criar nova bebida
        response = await api.post("/bebida", bebidaData);
        // Adiciona nova bebida à lista
        setBebidas((prevBebidas) => [...prevBebidas, response.data]);
      }

      // Limpa todos os inputs do formulário
      clearInputs();

      // Se havia uma busca ativa, limpa também
      if (searchResult) {
        clearSearch();
      }
    } catch (err) {
      // Se houver erro, registra no console
      console.error("Erro ao salvar bebida:", err);
      alert("Ocorreu um erro ao salvar a bebida.");
    }
  }

  // Função para deletar uma bebida
  async function handleDelete(id: string) {
    // Pede confirmação do usuário antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar esta bebida?")) {
      return; // Cancela se usuário disser não
    }

    try {
      // Envia DELETE para remover bebida do backend
      await api.delete("/bebida", {
        params: { id }, // Passa ID como parâmetro de query
      });

      // Remove a bebida da lista local
      // filter mantém apenas as bebidas com IDs diferentes
      setBebidas((prev) => prev.filter((bebida) => bebida.id !== id));

      // Se a bebida deletada era resultado de uma busca, limpa a busca
      if (searchResult?.id === id) {
        clearSearch();
      }
    } catch (err) {
      console.error("Erro ao deletar bebida:", err);
      alert("Ocorreu um erro ao deletar a bebida.");
    }
  }

  // Função para entrar em modo de edição
  // Marca a bebida selecionada para edição
  function handleEdit(bebida: BebidaProps) {
    setEditingBebida(bebida);
  }

  // Função para cancelar a edição
  function handleCancelEdit() {
    // Sai do modo edição
    setEditingBebida(null);
    // Limpa os campos do formulário
    clearInputs();
  }

  // Função para buscar uma bebida pelo nome
  async function handleSearchByName() {
    // Valida se o campo de busca foi preenchido
    if (!searchNameRef.current || searchNameRef.current.value.trim() === "") {
      alert("Digite um nome para buscar.");
      return;
    }

    // Pega o nome a buscar
    const nameToSearch = searchNameRef.current.value;

    try {
      // Faz requisição GET buscando bebida pelo nome
      const response = await api.get(`/bebida/${nameToSearch}`);
      // Armazena o resultado da busca
      setSearchResult(response.data);
    } catch (err) {
      console.error("Erro ao buscar bebida:", err);
      alert("Bebida não encontrada.");
      // Se não encontrar, reseta o resultado
      setSearchResult(null);
    }
  }

  // Função para limpar a busca e voltar à lista completa
  function clearSearch() {
    // Remove resultado de busca
    setSearchResult(null);
    // Limpa o input de busca
    if (searchNameRef.current) searchNameRef.current.value = "";
    // Reseta estado de busca
    setSearchId("");
    // Recarrega todas as bebidas
    loadBebidas();
  }

  // Define qual lista mostrar na tela
  // Se existe resultado de busca, mostra apenas esse; senão mostra todas
  const displayList = searchResult ? [searchResult] : bebidas;

  return (
    <div>
      <div className="content-header">
        <h1>Gerenciamento de Bebidas</h1>
      </div>

      <div className="form-container">
        <h2>{editingBebida ? "Editar Bebida" : "Cadastrar Bebida"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              placeholder="Digite a bebida..."
              ref={nameRef}
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
              {editingBebida ? "Salvar Edição" : "Cadastrar"}
            </button>
            {editingBebida && (
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
        <h2>Pesquisar Bebida por Nome</h2>
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
        <h2>{searchResult ? "Resultado da Busca" : "Lista de Bebidas"}</h2>
        {displayList.length === 0 ? (
          <p className="list-empty">
            {searchResult === null && bebidas.length === 0
              ? "Nenhuma bebida cadastrada."
              : "Nenhuma bebida encontrada."}
          </p>
        ) : (
          displayList.map((bebida) => (
            <article key={bebida.id} className="list-item">
              <p>
                <span>Nome:</span> {bebida.name}
              </p>
              <p>
                <span>Preço:</span> R$ {bebida.price.toFixed(2)}
              </p>

              <div className="list-item-actions">
                <button
                  onClick={() => handleEdit(bebida)}
                  className="btn-edit"
                >
                  <FiEdit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(bebida.id)}
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
