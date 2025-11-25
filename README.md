# Sistema de Pedidos de Pizzaria

---

## Resumo do Projeto


Esse é um sistema de uma pizzaria produzido em **TypeScript, utilizando Fastify, Prisma, React, Vite e o banco de dados MongoDB**, para permitir que clientes façam pedidos de pizzas, bebidas e sobremesas de forma simples e intuitiva, e que a própria administração da pizzaria consiga administrar, adicionando novos clientes e produtos, podendo editá-los e excluí-los, também é possível criar novos pedidos manualmente pela interface do usuário.

---

## Tecnologias Utilizadas


| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 19.2.0 | Framework UI |
| **TypeScript** | 5.9.3 | Type-safety |
| **Vite** | 7.2.2 | Build tool |
| **Axios** | 1.13.2 | Requisições HTTP |
| **Fastify** | — | Backend / Servidor HTTP |
| **Prisma** | — | ORM / Acesso ao banco de dados |

---
## Diretórios Principais


- Sistema: Servidor
- adm: interface administrativa
- client: interface dos clientes 

---
##Como Rodar?

- Nas três pastas (sistema, adm, client) rodar:

```npm run dev```

- Irá iniciar o servidor e gerar as URL de adm e client

```http://localhost:5174``` - client

```http://localhost:5173``` - adm


---
## Adm

É a interface de quem administra a pizzaria, contendo opções de cadastrar, editar e excluir novos produtos(pizzas, sobremesas e bebidas) e clientes. Além da funcionalidade de poder fazer um novo pedido manualmente.

---
### Cadastrar

- Cadastro de clientes: inserir nome, CPF, e-mail e telefone
- Cadastro de pizzas: inserir nome do produto, ingredientes e valor.
- Cadastro de sobremesas: inserir nome do produto, ingredientes e valor.
- Cadastro de bebidas: inserir nome do produto e valor.

### Pedidos
- Busca o cliente pelo CPF.
- Escolha os produtos disponíveis de acordo com o banco de dados.
- Formas de retirada: retirar em loja ou entrega (taxa fixa de R$10,00)
- Formas de pagamento: dinheiro, cartão e pix. 

### Geração de Relatórios

- Possibilidade de ver o relatório diário e mensal da pizzaria 

---
## Client

Interface responsável por receber pedidos dos clientes da pizzaria, sendo possível a criação de cadastro e fazer novos pedidos.

---
### Cadastrar

- Cadastro: inserir nome, CPF, e-mail e telefone

### Pedidos
- Busca o cliente pelo CPF.
- Escolha os produtos disponíveis de acordo com o banco de dados.
- Formas de retirada: retirar em loja ou entrega (taxa fixa de R$10,00)
- Formas de pagamento: dinheiro, cartão e pix. 

---
## Sistema 

Local que é responsável por rodar todo o servidor da api.

---
## Autores

Projeto desenvolvido por Ana Carolina Santos - RA: 2506285, Ekaterini Kotsis Milani - RA: 2510337, Isabeli Rosa de Medeiros - RA: 2503388 e Raul dos Santos Machado - RA: 2521975 para um trabalho do Curso de Ciências da Computação, da matéria Programação TypeScript ministrada pelo Eduardo Popovici.





