// Interface que define a estrutura de dados de um Cliente (Customer)
// As propriedades definem quais campos um cliente deve ter
export interface CustomerProps {
  id: string;       // ID único do cliente (gerado pelo backend)
  name: string;     // Nome completo do cliente
  cpf: string;      // CPF do cliente (usualmente para identificação)
  email: string;    // Email do cliente para contato
  telefone: string; // Telefone do cliente para contato
}

