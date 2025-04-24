document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("itemsContainer");
  const itemModal = document.getElementById("itemModal");
  const closeModal = document.querySelector(".close");
  const modalServiceName = document.getElementById("modalServiceName");
  const servicePrice = document.getElementById("servicePrice").querySelector("span");
  const serviceQuantity = document.getElementById("serviceQuantity");
  const calculateBudget = document.getElementById("calculateBudget");
  const budgetResult = document.getElementById("budgetResult");

  let selectedServiceId = null;

  const fetchServices = async () => {
    try {
      const response = await fetch("/servico");
      if (!response.ok) throw new Error("Erro ao carregar os serviços.");
      const services = await response.json();

      services.forEach((service) => {
        const serviceItem = document.createElement("div");
        serviceItem.className = "service-item";
        serviceItem.innerHTML = `
          <div class="image-container">
            <img src="${service.imagem}" alt="${service.nome}" />
          </div>
          <h3>${service.nome}</h3>
        `;
        serviceItem.addEventListener("click", () => {
          selectedServiceId = service.idservico;
          modalServiceName.textContent = service.nome;
          servicePrice.textContent = service.valor.toFixed(2);
          itemModal.style.display = "flex";
          budgetResult.textContent = ""; // Limpa texto anterior
        });
        itemsContainer.appendChild(serviceItem);
      });
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
      alert("Não foi possível carregar os serviços.");
    }
  };

  fetchServices();

  closeModal.addEventListener("click", () => {
    itemModal.style.display = "none";
    budgetResult.textContent = "";
  });

  calculateBudget.addEventListener("click", async () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const usuarioSalvo = localStorage.getItem("usuario");
    const userId = usuarioSalvo ? JSON.parse(usuarioSalvo).idusuario : null;

    if (!userId) {
      budgetResult.textContent = "Usuário não logado.";
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      budgetResult.textContent = "Por favor, insira uma quantidade válida.";
      return;
    }

    if (!selectedServiceId) {
      budgetResult.textContent = "Por favor, selecione um serviço.";
      return;
    }

    // Feedback visual
    calculateBudget.disabled = true;
    calculateBudget.textContent = "Enviando...";
    budgetResult.textContent = "Criando pedido...";

    try {
      const response = await fetch("/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_idusuario: userId,
          servico_idservico: selectedServiceId,
          quantidade: quantity,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar pedido");

      const data = await response.json();
      budgetResult.textContent = `✅ Pedido criado com sucesso! ID: ${data.id}`;
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      budgetResult.textContent = "❌ Erro ao criar o pedido.";
    } finally {
      calculateBudget.disabled = false;
      calculateBudget.textContent = "Fazer Orçamento";

      // Limpar feedback após 5 segundos
      setTimeout(() => {
        budgetResult.textContent = "";
      }, 5000);
    }
  });
});
