import prismaClient from "../prisma";
// Importa a instância configurada do Prisma Client para realizar a conexão e operações no banco de dados

// Interface que define a "forma" dos dados esperados pelo serviço (DTO).
// Garante que quem chamar esse serviço precisa enviar um 'name' e um 'price'.
interface CreateBebidaProps {
    name: string;
    price: number;
}

class CreateBebidaService {
    // Método execute: Centraliza a regra de negócio da criação.
    // Recebe os dados desestruturados ({ name, price }) respeitando a interface definida acima.
    async execute({ name, price }: CreateBebidaProps) {
        
        // Validação de entrada: Verifica se os valores são válidos (não nulos ou vazios).
        // Se faltar algum dado obrigatório, lança um erro e impede a gravação no banco.
        if (!name || !price) {
            throw new Error("Preencha todos os campos");
        }

        // Operação de Banco de Dados:
        // Usa o método .create() do Prisma na tabela/model 'bebida'.
        // O 'await' aguarda o banco confirmar que o registro foi salvo.
        const bebida = await prismaClient.bebida.create({
            data: {
                name,
                price,
            }
        });

        // Retorna o objeto recém-criado. 
        // Geralmente esse retorno contém o ID gerado automaticamente e datas de criação.
        return bebida;
    }
}

// Exporta o serviço para ser utilizado dentro do Controller
export { CreateBebidaService };