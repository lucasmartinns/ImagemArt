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

  // Simulação de fetch de serviços com opções do backend
  const services = [
    {
      id: 1,
      nome: "Serviço 1",
      imagem: "../../assets/img/impressao.png",
      options: [
        { nome: "Foto", preco: 10 },
        { nome: "3x4", preco: 15 },
        { nome: "10x15", preco: 20 },
      ],
    },
    {
      id: 2,
      nome: "Serviço 2",
      imagem: "../../assets/img/servicos/servico2.png",
      options: [
        { nome: "Opção A", preco: 25 },
        { nome: "Opção B", preco: 30 },
      ],
    },
    {
      id: 3,
      nome: "Serviço 3",
      imagem: "../../assets/img/364547.png",
      options: [
        { nome: "Opção X", preco: 35 },
        { nome: "Opção Y", preco: 40 },
        { nome: "Opção Z", preco: 45 },
      ],
    },
  ];

  let selectedService = null;

  // Renderizar serviços
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
      // Atualizar dropdown com as opções do serviço selecionado
      serviceDropdown.innerHTML = "";
      service.options.forEach((opt, index) => {
        const option = document.createElement("option");
        option.value = opt.nome;
        option.setAttribute("data-price", opt.preco);
        option.textContent = opt.nome;
        serviceDropdown.appendChild(option);
      });
      // Configurar o preço exibido para a primeira opção
      const firstOption = service.options[0];
      servicePrice.textContent = firstOption.preco.toFixed(2);
      // Limpar quantidade e orçamento anterior
      serviceQuantity.value = 1;
      budgetResult.textContent = "";
      itemModal.style.display = "flex";
    });
    itemsContainer.appendChild(serviceItem);
  });

  // Fechar modal
  closeModal.addEventListener("click", () => {
    itemModal.style.display = "none";
  });

  // Atualizar o preço exibido ao mudar a opção do dropdown
  serviceDropdown.addEventListener("change", (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    servicePrice.textContent = price.toFixed(2);
  });

  // Calcular orçamento
  calculateBudget.addEventListener("click", () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const price = parseFloat(servicePrice.textContent);

    if (isNaN(quantity) || quantity <= 0) {
      showCustomAlert = "Por favor, insira uma quantidade válida.";
      return;
    }

    const total = quantity * price;
    budgetResult.textContent = `Orçamento: R$${total.toFixed(2)}`;
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
