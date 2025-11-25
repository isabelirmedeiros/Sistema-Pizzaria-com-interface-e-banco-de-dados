// Importa ícones da biblioteca react-icons
// Adicionei ícones novos: FiTruck, FiHome, FiDollarSign, FiCreditCard
import { FiTrash, FiPlus, FiCheck, FiTruck, FiHome, FiDollarSign, FiCreditCard } from "react-icons/fi";
// Importa a configuração da API (Axios)
import { api } from "./services/api";
// Importa hooks do React
import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";

// Interface para descrever a estrutura de uma Pizza
interface PizzaProps {
  id: string;
  name: string;
  ingredients: string;
  price: number;
}

// Interface para descrever a estrutura de uma Bebida
interface BebidaProps {
  id: string;
  name: string;
  price: number;
}

// Interface para descrever a estrutura de uma Sobremesa
interface SobremesaProps {
  id: string;
  name: string;
  ingredients: string;
  price: number;
}

// Interface para descrever a estrutura de um Cliente
interface CustomerProps {
  id: string;
  name: string;
  cpf: string;
  email: string;
  telefone: string;
}

// Interface para cada item que será adicionado ao pedido
interface OrderItem {
  type: "pizza" | "bebida" | "sobremesa";
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Componente principal para criar pedidos
export default function Pedidos() {
  // Estados para armazenar os produtos disponíveis
  const [pizzas, setPizzas] = useState<PizzaProps[]>([]);
  const [bebidas, setBebidas] = useState<BebidaProps[]>([]);
  const [sobremesas, setSobremesas] = useState<SobremesaProps[]>([]);

  // Estado para armazenar o cliente selecionado
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProps | null>(null);
  
  // Estado para armazenar itens do pedido
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // Estado de loading
  const [loading, setLoading] = useState(false);

  // === NOVOS ESTADOS PARA CONTROLE DE PAGAMENTO E ENTREGA ===
  const [paymentMethod, setPaymentMethod] = useState<"dinheiro" | "cartao" | "pix">("dinheiro");
  const [deliveryMethod, setDeliveryMethod] = useState<"retirada" | "entrega">("retirada");

  // Referências para inputs
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const pizzaCodeRef = useRef<HTMLInputElement | null>(null);
  const pizzaQuantityRef = useRef<HTMLInputElement | null>(null);
  const bebidaCodeRef = useRef<HTMLInputElement | null>(null);
  const bebidaQuantityRef = useRef<HTMLInputElement | null>(null);
  const sobremesaCodeRef = useRef<HTMLInputElement | null>(null);
  const sobremesaQuantityRef = useRef<HTMLInputElement | null>(null);

  // Carrega dados iniciais
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setLoading(true);
      const [, pizzasRes, bebidasRes, sobremesasRes] = await Promise.all([
        api.get("/customers"),
        api.get("/pizzas"),
        api.get("/bebidas"),
        api.get("/sobremesas"),
      ]);

      setPizzas(pizzasRes.data);
      setBebidas(bebidasRes.data);
      setSobremesas(sobremesasRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      alert("Erro ao carregar dados dos produtos.");
    } finally {
      setLoading(false);
    }
  }

  // Busca cliente por CPF
  async function handleSearchCustomerByCpf() {
    if (!cpfRef.current || cpfRef.current.value.trim() === "") {
      alert("Digite um CPF para buscar.");
      return;
    }

    try {
      const response = await api.get(`/customer/${cpfRef.current.value}`);
      setSelectedCustomer(response.data);
      alert(`Cliente encontrado: ${response.data.name}`);
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
      setSelectedCustomer(null);
      alert("Cliente não encontrado.");
    }
  }

  // Funções de adicionar itens (Pizza, Bebida, Sobremesa)
  function handleAddPizza() {
    if (!pizzaCodeRef.current || pizzaCodeRef.current.value.trim() === "") {
      alert("Digite o ID da pizza.");
      return;
    }
    if (!pizzaQuantityRef.current || pizzaQuantityRef.current.value === "") {
      alert("Digite a quantidade.");
      return;
    }

    const pizzaId = pizzaCodeRef.current.value;
    const pizza = pizzas.find((p) => p.id === pizzaId);

    if (!pizza) {
      alert("Pizza não encontrada.");
      return;
    }

    const quantity = parseInt(pizzaQuantityRef.current.value);
    const newItem: OrderItem = {
      type: "pizza",
      id: pizza.id,
      name: pizza.name,
      price: pizza.price,
      quantity,
    };

    setOrderItems([...orderItems, newItem]);
    pizzaCodeRef.current.value = "";
    pizzaQuantityRef.current.value = "";
  }

  function handleAddBebida() {
    if (!bebidaCodeRef.current || bebidaCodeRef.current.value.trim() === "") {
      alert("Digite o ID da bebida.");
      return;
    }
    if (!bebidaQuantityRef.current || bebidaQuantityRef.current.value === "") {
      alert("Digite a quantidade.");
      return;
    }

    const bebidaId = bebidaCodeRef.current.value;
    const bebida = bebidas.find((b) => b.id === bebidaId);

    if (!bebida) {
      alert("Bebida não encontrada.");
      return;
    }

    const quantity = parseInt(bebidaQuantityRef.current.value);
    const newItem: OrderItem = {
      type: "bebida",
      id: bebida.id,
      name: bebida.name,
      price: bebida.price,
      quantity,
    };

    setOrderItems([...orderItems, newItem]);
    bebidaCodeRef.current.value = "";
    bebidaQuantityRef.current.value = "";
  }

  function handleAddSobremesa() {
    if (!sobremesaCodeRef.current || sobremesaCodeRef.current.value.trim() === "") {
      alert("Digite o ID da sobremesa.");
      return;
    }
    if (!sobremesaQuantityRef.current || sobremesaQuantityRef.current.value === "") {
      alert("Digite a quantidade.");
      return;
    }

    const sobremesaId = sobremesaCodeRef.current.value;
    const sobremesa = sobremesas.find((s) => s.id === sobremesaId);

    if (!sobremesa) {
      alert("Sobremesa não encontrada.");
      return;
    }

    const quantity = parseInt(sobremesaQuantityRef.current.value);
    const newItem: OrderItem = {
      type: "sobremesa",
      id: sobremesa.id,
      name: sobremesa.name,
      price: sobremesa.price,
      quantity,
    };

    setOrderItems([...orderItems, newItem]);
    sobremesaCodeRef.current.value = "";
    sobremesaQuantityRef.current.value = "";
  }

  // Remove item da lista
  function handleRemoveItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  // === LÓGICA DE CÁLCULO ATUALIZADA ===
  
  // Calcula apenas a soma dos produtos (Subtotal)
  function calculateSubtotal(): number {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Retorna o valor da taxa (10 se entrega, 0 se retirada)
  function getDeliveryFee(): number {
    return deliveryMethod === "entrega" ? 10.00 : 0.00;
  }

  // Calcula o total final (Subtotal + Taxa)
  function calculateFinalTotal(): number {
    return calculateSubtotal() + getDeliveryFee();
  }

  // Função para finalizar o pedido
  async function handleSubmitOrder(event: FormEvent) {
    event.preventDefault();

    if (!selectedCustomer) {
      alert("Selecione um cliente.");
      return;
    }

    if (orderItems.length === 0) {
      alert("Adicione pelo menos um item ao pedido.");
      return;
    }

    try {
      const orderData = {
        customerId: selectedCustomer.id,
        subtotal: calculateSubtotal(),
        deliveryFee: getDeliveryFee(),
        total: calculateFinalTotal(), // Envia o total já com a taxa
        paymentMethod: paymentMethod, // Envia o método de pagamento
        deliveryMethod: deliveryMethod, // Envia se é entrega ou retirada
        items: orderItems.map((item) => ({
          productType: item.type.toUpperCase(),
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post("/orders", orderData);

      alert("Pedido criado com sucesso!");

      // Limpa tudo
      setSelectedCustomer(null);
      setOrderItems([]);
      setPaymentMethod("dinheiro"); // Reseta para padrão
      setDeliveryMethod("retirada"); // Reseta para padrão
      
      // Limpa inputs
      if (cpfRef.current) cpfRef.current.value = "";
      if (pizzaCodeRef.current) pizzaCodeRef.current.value = "";
      if (pizzaQuantityRef.current) pizzaQuantityRef.current.value = "";
      if (bebidaCodeRef.current) bebidaCodeRef.current.value = "";
      if (bebidaQuantityRef.current) bebidaQuantityRef.current.value = "";
      if (sobremesaCodeRef.current) sobremesaCodeRef.current.value = "";
      if (sobremesaQuantityRef.current) sobremesaQuantityRef.current.value = "";
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      alert("Erro ao criar pedido. Verifique o console.");
    }
  }

  return (
    <div>
      <div className="content-header">
        <h1>Criar Pedido</h1>
      </div>

      {loading && (
        <div className="alert alert-success">
          Carregando produtos...
        </div>
      )}

      {/* ===== SEÇÃO 1: SELEÇÃO DE CLIENTE ===== */}
      <div className="form-container">
        <h2>Selecionar Cliente</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Digite o CPF do cliente..."
            ref={cpfRef}
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "10px 12px",
              border: "2px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSearchCustomerByCpf}
            className="btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            Buscar Cliente
          </button>
        </div>

        {selectedCustomer && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "var(--accent-pink-very-light)",
              borderRadius: "8px",
              border: "2px solid var(--accent-pink)",
            }}
          >
            <p><span style={{ fontWeight: "600" }}>Cliente:</span> {selectedCustomer.name}</p>
            <p><span style={{ fontWeight: "600" }}>CPF:</span> {selectedCustomer.cpf}</p>
          </div>
        )}
      </div>

      {/* ===== SEÇÃO 2: ADICIONAR PRODUTOS ===== */}
      <div className="form-container">
        <h2>Adicionar Produtos</h2>

        {/* Pizza */}
        <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
          <h3 style={{ color: "var(--primary-color)", marginBottom: "12px" }}>Pizza</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="ID da pizza..."
              ref={pizzaCodeRef}
              list="pizzas-list"
              style={{ flex: 1, minWidth: "200px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }}
            />
            <datalist id="pizzas-list">
              {pizzas.map((p) => (<option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>))}
            </datalist>
            <input type="number" placeholder="Qtd" ref={pizzaQuantityRef} min="1" style={{ width: "70px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }} />
            <button onClick={handleAddPizza} className="btn-primary" style={{ whiteSpace: "nowrap" }}><FiPlus size={16} /> Adicionar</button>
          </div>
        </div>

        {/* Bebida */}
        <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
          <h3 style={{ color: "var(--primary-color)", marginBottom: "12px" }}>Bebida</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="ID da bebida..."
              ref={bebidaCodeRef}
              list="bebidas-list"
              style={{ flex: 1, minWidth: "200px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }}
            />
            <datalist id="bebidas-list">
              {bebidas.map((b) => (<option key={b.id} value={b.id}>{b.name} - R$ {b.price.toFixed(2)}</option>))}
            </datalist>
            <input type="number" placeholder="Qtd" ref={bebidaQuantityRef} min="1" style={{ width: "70px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }} />
            <button onClick={handleAddBebida} className="btn-primary" style={{ whiteSpace: "nowrap" }}><FiPlus size={16} /> Adicionar</button>
          </div>
        </div>

        {/* Sobremesa */}
        <div>
          <h3 style={{ color: "var(--primary-color)", marginBottom: "12px" }}>Sobremesa</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="ID da sobremesa..."
              ref={sobremesaCodeRef}
              list="sobremesas-list"
              style={{ flex: 1, minWidth: "200px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }}
            />
            <datalist id="sobremesas-list">
              {sobremesas.map((s) => (<option key={s.id} value={s.id}>{s.name} - R$ {s.price.toFixed(2)}</option>))}
            </datalist>
            <input type="number" placeholder="Qtd" ref={sobremesaQuantityRef} min="1" style={{ width: "70px", padding: "10px 12px", border: "2px solid var(--border-color)", borderRadius: "8px", fontSize: "14px" }} />
            <button onClick={handleAddSobremesa} className="btn-primary" style={{ whiteSpace: "nowrap" }}><FiPlus size={16} /> Adicionar</button>
          </div>
        </div>
      </div>

      {/* ===== SEÇÃO 3: RESUMO, ENTREGA E PAGAMENTO ===== */}
      <div className="list-container">
        <h2>Resumo do Pedido</h2>

        {orderItems.length === 0 ? (
          <p className="list-empty">Nenhum item adicionado ao pedido.</p>
        ) : (
          <>
            {/* Lista de itens */}
            {orderItems.map((item, index) => (
              <article key={index} className="list-item">
                <p><span>Tipo:</span> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                <p><span>Produto:</span> {item.name}</p>
                <p><span>Qtd:</span> {item.quantity}</p>
                <p><span>Valor Un.:</span> R$ {item.price.toFixed(2)}</p>
                <p><span>Subtotal:</span> R$ <strong style={{ color: "var(--primary-color)" }}>{(item.price * item.quantity).toFixed(2)}</strong></p>
                <div className="list-item-actions">
                  <button onClick={() => handleRemoveItem(index)} className="btn-delete"><FiTrash size={16} /> Remover</button>
                </div>
              </article>
            ))}

            {/* === NOVA SEÇÃO: OPÇÕES DE ENTREGA E PAGAMENTO === */}
            <div className="form-container" style={{ marginTop: "25px", border: "2px solid var(--primary-color)" }}>
              
              {/* 1. Tipo de Entrega */}
              <div style={{ marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                  <FiTruck /> Método de Entrega
                </h3>
                <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap" }}>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="retirada" 
                      checked={deliveryMethod === "retirada"} 
                      onChange={() => setDeliveryMethod("retirada")}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span><FiHome style={{ marginRight: "4px" }}/> Retirada na Loja (Grátis)</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="entrega" 
                      checked={deliveryMethod === "entrega"} 
                      onChange={() => setDeliveryMethod("entrega")}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span><FiTruck style={{ marginRight: "4px" }}/> Entrega (+ R$ 10,00)</span>
                  </label>

                </div>
              </div>

              {/* 2. Forma de Pagamento */}
              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                  <FiDollarSign /> Forma de Pagamento
                </h3>
                <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap" }}>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="dinheiro" 
                      checked={paymentMethod === "dinheiro"} 
                      onChange={() => setPaymentMethod("dinheiro")}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span>Dinheiro</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cartao" 
                      checked={paymentMethod === "cartao"} 
                      onChange={() => setPaymentMethod("cartao")}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span><FiCreditCard style={{ marginRight: "4px" }}/> Cartão</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="pix" 
                      checked={paymentMethod === "pix"} 
                      onChange={() => setPaymentMethod("pix")}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span>💠 Pix</span>
                  </label>
                </div>
              </div>
            </div>

            {/* === CARD COM TOTAIS (SUBTOTAL + TAXA) === */}
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "var(--accent-pink-light)",
                borderRadius: "8px",
                textAlign: "right",
              }}
            >
              {/* Subtotal */}
              <p style={{ fontSize: "16px", color: "var(--dark-text)", marginBottom: "4px" }}>
                Subtotal dos Itens: R$ {calculateSubtotal().toFixed(2)}
              </p>

              {/* Mostra a taxa apenas se for entrega */}
              {deliveryMethod === "entrega" && (
                <p style={{ fontSize: "16px", color: "#d9534f", marginBottom: "8px" }}>
                  + Taxa de Entrega: R$ 10.00
                </p>
              )}

              {/* Linha separadora */}
              <div style={{ borderTop: "1px solid #ccc", margin: "8px 0" }}></div>

              {/* Total Final */}
              <p style={{ fontSize: "20px", fontWeight: "600", color: "var(--dark-text)" }}>
                Total Final:{" "}
                <span style={{ color: "var(--primary-color)", fontSize: "26px" }}>
                  R$ {calculateFinalTotal().toFixed(2)}
                </span>
              </p>
            </div>

            {/* Botão Finalizar */}
            <form onSubmit={handleSubmitOrder} style={{ marginTop: "20px" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                <FiCheck size={22} style={{ marginRight: "8px" }} />
                Finalizar Pedido
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}