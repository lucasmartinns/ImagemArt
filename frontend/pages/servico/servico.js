document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("itemsContainer");
  const itemModal = document.getElementById("itemModal");
  const closeModal = document.querySelector(".close");
  const modalServiceName = document.getElementById("modalServiceName");
  const servicePrice = document
    .getElementById("servicePrice")
    .querySelector("span");
  const serviceQuantity = document.getElementById("serviceQuantity");
  const serviceDropdown = document.getElementById("serviceDropdown");
  const calculateBudget = document.getElementById("calculateBudget");
  const budgetResult = document.getElementById("budgetResult");
  const placeOrder = document.getElementById("placeOrder");

  let selectedService = null;

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
            <img src="../../assets/img/servicos/backgroundImage.png"/>
            <img src="${service.imagem}" class="service-image"/>
          </div>
          <h3>${service.nome}</h3>
        `;
        serviceItem.addEventListener("click", () => {
          selectedService = service;
          modalServiceName.textContent = service.nome;

          // Clear the dropdown first
          serviceDropdown.innerHTML = "";

          // Check if service has options property and it's an array
          if (
            service.options &&
            Array.isArray(service.options) &&
            service.options.length > 0
          ) {
            // Populate dropdown with service options
            service.options.forEach((opt) => {
              const option = document.createElement("option");
              option.value = opt.nome;
              option.setAttribute("data-price", opt.preco);
              option.textContent = opt.nome;
              serviceDropdown.appendChild(option);
            });

            // Set price to first option's price
            const firstOption = service.options[0];
            servicePrice.textContent = firstOption.preco.toFixed(2);
          } else {
            // If no options, create a default option with the service's main price
            const option = document.createElement("option");
            option.value = service.nome;
            option.setAttribute("data-price", service.preco || 0);
            option.textContent = service.nome;
            serviceDropdown.appendChild(option);

            // Set price display
            servicePrice.textContent = (service.preco || 0).toFixed(2);
          }

          // Reset quantity and budget result
          serviceQuantity.value = 1;
          budgetResult.textContent = "";
          itemModal.style.display = "flex";
        });
        itemsContainer.appendChild(serviceItem);
      });
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
      showCustomAlert("Não foi possível carregar os serviços.");
    }
  };

  fetchServices();

  closeModal.addEventListener("click", () => {
    itemModal.style.display = "none";
    budgetResult.textContent = "";
  });

  // Update selected service's price when dropdown selection changes
  serviceDropdown.addEventListener("change", () => {
    const selectedOption = serviceDropdown.selectedOptions[0];
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    servicePrice.textContent = price.toFixed(2);
  });

  // Calcular orçamento
  calculateBudget.addEventListener("click", async () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const usuarioSalvo = localStorage.getItem("usuario");

    if (isNaN(quantity) || quantity <= 0) {
      showCustomAlert("Por favor, insira uma quantidade válida.");
      return;
    }

    if (!selectedService) {
      showCustomAlert("Por favor, selecione um serviço.");
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
          servico_idservico: selectedService.idservico, // Use the ID from the selected service object
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

  // Simular pedido via WhatsApp
  placeOrder.addEventListener("click", () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const selectedOption = serviceDropdown.selectedOptions[0];
    const optionName = selectedOption.textContent;
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    const total = price * quantity;

    const mensagem = `Olá! Gostaria de fazer um pedido. 📸
  
  *Serviço:* ${selectedService.nome}
  *Opção:* ${optionName}
  *Quantidade:* ${quantity}
  *Total:* R$${total.toFixed(2)}
  
  Por favor, me avise sobre a disponibilidade e confirme os valores. Aguardo seu retorno! 😊`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=5514999034536&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(whatsappURL, "_blank");
  });
});
