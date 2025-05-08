document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("itemsContainer");
  const itemModal = document.getElementById("itemModal");
  const closeModal = document.querySelector(".close");
  const modalServiceName = document.getElementById("modalServiceName");
  const servicePrice = document.getElementById("servicePrice").querySelector("span");
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

        // Torna o item clicável
        serviceItem.addEventListener("click", () => {
          selectedService = service;
          modalServiceName.textContent = service.nome;
          serviceDropdown.innerHTML = ""; // Limpa as opções anteriores
          servicePrice.textContent = "0.00";

          // Faz uma requisição para buscar as variações do serviço
          fetch(`/servico/${service.idservico}/variacoes`)
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar variações");
              return res.json();
            })
            .then((variacoes) => {
              if (variacoes.length > 0) {
                variacoes.forEach((variacao) => {
                  const option = document.createElement("option");
                  option.value = variacao.nome;
                  option.setAttribute("data-price", variacao.preco);
                  option.textContent = variacao.nome;
                  serviceDropdown.appendChild(option);
                });

                // Define o preço da primeira variação como inicial
                const precoInicial = parseFloat(variacoes[0].preco);
                servicePrice.textContent = precoInicial.toFixed(2);
              } else {
                // Sem variações, usar valor padrão do serviço
                const option = document.createElement("option");
                option.value = service.nome;
                option.setAttribute("data-price", service.valor || 0);
                option.textContent = service.nome;
                serviceDropdown.appendChild(option);

                servicePrice.textContent = (service.valor || 0).toFixed(2);
              }

              serviceQuantity.value = 1;
              budgetResult.textContent = "";
              itemModal.style.display = "flex";
            })
            .catch((err) => {
              console.error("Erro ao buscar variações:", err);
              alert("Erro ao carregar variações do serviço.");
            });
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

  serviceDropdown.addEventListener("change", () => {
    const selectedOption = serviceDropdown.selectedOptions[0];
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    servicePrice.textContent = price.toFixed(2);
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
      showCustomAlert("Por favor, insira uma quantidade válida.");
      return;
    }

    if (!selectedService) {
      showCustomAlert("Por favor, selecione um serviço.");
      return;
    }

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
          servico_idservico: selectedService.idservico,
          quantidade: quantity,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar pedido");

      const data = await response.json();
      budgetResult.textContent = `✅ Pedido criado com sucesso! ID ${data.id}`;
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      budgetResult.textContent = "❌ Erro ao criar o pedido.";
    } finally {
      calculateBudget.disabled = false;
      calculateBudget.textContent = "Fazer Orçamento";
      setTimeout(() => {
        budgetResult.textContent = "";
      }, 5000);
    }
  });

  placeOrder.addEventListener("click", () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const selectedOption = serviceDropdown.selectedOptions[0];
    const optionName = selectedOption.textContent;
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    const total = price * quantity;

    const mensagem = `Olá! Gostaria de fazer um pedido. 📸

Serviço: ${selectedService.nome}
Opção: ${optionName}
Quantidade: ${quantity}
Total: R$${total.toFixed(2)}

Por favor, me avise sobre a disponibilidade e confirme os valores. Aguardo seu retorno! 😊`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=5514999034536&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(whatsappURL, "_blank");
  });
});
