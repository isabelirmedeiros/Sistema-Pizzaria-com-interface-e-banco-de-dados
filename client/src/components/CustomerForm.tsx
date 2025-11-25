// Importa React e hooks necessários
import React, { useRef } from "react";
// Importa tipo para eventos de formulário
import type { FormEvent } from "react";
// Importa a interface de cliente do arquivo de tipos
import type { CustomerProps } from "../types/customer";

// Interface que define as props (propriedades) que esse componente recebe
interface CustomerFormProps {
  onSubmit: (customerData: Omit<CustomerProps, "id">) => Promise<void>; // Função chamada ao submeter (sem o ID)
  isEditing: boolean;                                                     // Se está em modo edição
  editingCustomer: CustomerProps | null;                                  // Cliente sendo editado (null se criando)
  onCancel: () => void;                                                   // Função chamada ao cancelar
}

// Componente do formulário de cliente - reutilizável para criar e editar
export default function CustomerForm({
  onSubmit,      // Função para quando clicar em "Cadastrar" ou "Salvar Edição"
  isEditing,     // Boolean: true se editando, false se criando
  editingCustomer, // Objeto com dados do cliente se estiver editando
  onCancel,      // Função para quando clicar em "Cancelar"
}: CustomerFormProps) {
  // Referências diretas aos inputs do formulário (acessar DOM)
  const nameRef = useRef<HTMLInputElement | null>(null);       // Input de nome
  const cpfRef = useRef<HTMLInputElement | null>(null);        // Input de CPF
  const emailRef = useRef<HTMLInputElement | null>(null);      // Input de email
  const telefoneRef = useRef<HTMLInputElement | null>(null);   // Input de telefone

  // Função para manipular o envio do formulário
  async function handleSubmit(event: FormEvent) {
    // Previne comportamento padrão do formulário (recarregar página)
    event.preventDefault();

    // Valida se todos os inputs foram preenchidos
    if (!nameRef.current || !cpfRef.current || !emailRef.current || !telefoneRef.current) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const cleanCpf = cpfRef.current.value.replace(/[^\d]/g, ""); // Remove pontos e traços

    if (cleanCpf.length !== 11) {
      alert("CPF deve conter 11 dígitos numéricos!");
      return;
    }

    // Cria objeto com os dados do cliente
    const customerData = {
      name: nameRef.current.value,          // Nome digitado
      cpf: cleanCpf,                        // CPF digitado
      email: emailRef.current.value,        // Email digitado
      telefone: telefoneRef.current.value,  // Telefone digitado
    };

    try {
      // Chama a função onSubmit (passada como prop) com os dados
      await onSubmit(customerData);
      // Se sucesso, limpa os inputs
      clearInputs();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
    }
  }

  // Função para limpar todos os inputs
  function clearInputs() {
    // Reseta cada input para string vazia
    if (nameRef.current) nameRef.current.value = "";
    if (cpfRef.current) cpfRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (telefoneRef.current) telefoneRef.current.value = "";
  }

  // Hook que executa quando isEditing ou editingCustomer mudam
  React.useEffect(() => {
    // Se está editando e há cliente para editar
    if (isEditing && editingCustomer) {
      // Preenche cada input com os dados do cliente
      if (nameRef.current) nameRef.current.value = editingCustomer.name;
      if (cpfRef.current) cpfRef.current.value = editingCustomer.cpf;
      if (emailRef.current) emailRef.current.value = editingCustomer.email;
      if (telefoneRef.current) telefoneRef.current.value = editingCustomer.telefone;
    } else {
      // Se não está editando, limpa os inputs
      clearInputs();
    }
  }, [isEditing, editingCustomer]); // Dependências: executa quando mudam

  return (
    // Container do formulário
    <div className="form-container">
      {/* Título dinâmico: muda entre "Editar" e "Cadastrar" */}
      <h2>{isEditing ? "Editar Cliente" : "Cadastrar Cliente"}</h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        {/* Campo de nome */}
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            placeholder="Digite o seu nome.."
            ref={nameRef} // Referência ao input
            required     // Campo obrigatório
          />
        </div>

        {/* Campo de CPF */}
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input
            id="cpf"
            type="text"
            placeholder="Digite o seu cpf.."
            ref={cpfRef}
            required
          />
        </div>

        {/* Campo de email */}
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            placeholder="Digite o seu email.."
            ref={emailRef}
            required
          />
        </div>

        {/* Campo de telefone */}
        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <input
            id="telefone"
            type="text"
            placeholder="Digite o seu telefone.."
            ref={telefoneRef}
            required
          />
        </div>

        {/* Container dos botões */}
        <div className="form-buttons">
          {/* Botão submit: texto muda entre "Cadastrar" e "Salvar Edição" */}
          <button type="submit" className="btn-primary">
            {isEditing ? "Salvar Edição" : "Cadastrar"}
          </button>
          
          {/* Botão cancelar: só aparece se está editando */}
          {isEditing && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
