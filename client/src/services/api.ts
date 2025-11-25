// Importa a biblioteca axios para fazer requisições HTTP
import axios from "axios"

// Cria uma instância customizada do axios com configurações padrão
// Toda requisição feita com essa instância terá a baseURL configurada
export const api = axios.create({
    // Define a URL base do servidor (backend)
    // Assim, em vez de escrever a URL completa, basta escrever "/pizzas", "/clientes", etc
    baseURL: "http://localhost:3333"
})
