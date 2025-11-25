import { useRef } from "react";
import type { FormEvent } from "react";
// Importa a instância do Axios configurada (que aponta para http://localhost:3333)
import { api } from "./services/api"; 
import { FiCheck } from "react-icons/fi"; // Ícone para embelezar o botão

export default function CreateCustomer() {
  // === GERENCIAMENTO DE ESTADO (Refs) ===
  // Utilizamos o hook useRef para criar referências diretas aos elementos de input no DOM.
  // Diferente do useState, o useRef não causa re-renderização a cada letra digitada,
  // o que é mais performático para formulários simples como este ("Uncontrolled Components").
  const nameRef = useRef<HTMLInputElement | null>(null);
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const telefoneRef = useRef<HTMLInputElement | null>(null);

  // === FUNÇÃO DE SUBMISSÃO ===
  async function handleCreateCustomer(event: FormEvent) {
    // Previne o comportamento padrão do navegador de recarregar a página ao enviar o form
    event.preventDefault();

    // Validação básica: Verifica se as referências existem e se os valores não estão vazios.
    // O '?' (optional chaining) evita erros caso o ref seja nulo.
    if (
      !nameRef.current?.value ||
      !cpfRef.current?.value ||
      !emailRef.current?.value ||
      !telefoneRef.current?.value
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Monta o objeto com os dados, acessando a propriedade .value de cada input
    const customerData = {
      name: nameRef.current.value,
      cpf: cpfRef.current.value,
      email: emailRef.current.value,
      telefone: telefoneRef.current.value,
    };

    try {
      // Comunicação com o Backend:
      // Faz uma requisição POST para a rota "/customer" definida no Fastify.
      await api.post("/customer", customerData);

      alert("Cadastro realizado!");

      // Limpeza dos campos:
      // Como não usamos useState, limpamos manualmente o valor dos inputs no DOM.
      nameRef.current.value = "";
      cpfRef.current.value = "";
      emailRef.current.value = "";
      telefoneRef.current.value = "";

    } catch (err) {
      // Tratamento de erros (ex: Servidor fora do ar, CPF duplicado, etc)
      console.error("Erro ao criar cliente:", err);
      alert("Erro ao cadastrar o cliente.");
    }
  }

  // === RENDERIZAÇÃO (JSX) ===
  return (
    // Usa a classe "form-container" (provavelmente definida no CSS global) para manter o padrão visual
    <div className="form-container">
      <h2>Crie o seu cadastro</h2>

      <form onSubmit={handleCreateCustomer}>
        {/* Agrupamento do input Nome */}
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            placeholder="Digite o nome completo"
            ref={nameRef} // Conecta este input à variável nameRef
            className="input"
            required // Atributo HTML que exige preenchimento
          />
        </div>

        {/* Agrupamento do input CPF */}
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input
            id="cpf"
            type="text"
            placeholder="Digite o CPF"
            ref={cpfRef} // Conecta ao cpfRef
            className="input"
            required
          />
        </div>

        {/* Agrupamento do input Email */}
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            placeholder="Digite o e-mail"
            ref={emailRef} // Conecta ao emailRef
            className="input"
            required
          />
        </div>

        {/* Agrupamento do input Telefone */}
        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <input
            id="telefone"
            type="text"
            placeholder="Digite o telefone"
            ref={telefoneRef} // Conecta ao telefoneRef
            className="input"
            required
          />
        </div>

        {/* Botão de Envio */}
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {/* Ícone de check para feedback visual */}
            <FiCheck size={18} style={{ marginRight: "8px" }} />
            Cadastrar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}