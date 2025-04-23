document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("itemsContainer");
  const itemModal = document.getElementById("itemModal");
  const closeModal = document.querySelector(".close");
  const modalServiceName = document.getElementById("modalServiceName");
  const serviceDropdown = document.getElementById("serviceDropdown");
  const serviceQuantity = document.getElementById("serviceQuantity");
  const servicePrice = document
    .getElementById("servicePrice")
    .querySelector("span");
  const calculateBudget = document.getElementById("calculateBudget");
  const budgetResult = document.getElementById("budgetResult");

  // Mock de serviços (substituir com fetch do backend)
  const services = [
    { id: 1, nome: "Serviço 1", valor: 100 },
    { id: 2, nome: "Serviço 2", valor: 200 },
    { id: 3, nome: "Serviço 3", valor: 300 },
  ];

  // Renderizar serviços
  services.forEach((service) => {
    const serviceItem = document.createElement("div");
    serviceItem.className = "service-item";
    serviceItem.textContent = service.nome;
    serviceItem.addEventListener("click", () => {
      modalServiceName.textContent = service.nome;
      servicePrice.textContent = service.valor.toFixed(2);
      itemModal.style.display = "flex";
    });
    itemsContainer.appendChild(serviceItem);
  });

  // Fechar modal
  closeModal.addEventListener("click", () => {
    itemModal.style.display = "none";
  });

  // Calcular orçamento
  calculateBudget.addEventListener("click", () => {
    const quantity = parseInt(serviceQuantity.value, 10);
    const price = parseFloat(servicePrice.textContent);

    if (isNaN(quantity) || quantity <= 0) {
      budgetResult.textContent = "Por favor, insira uma quantidade válida.";
      return;
    }

    const total = quantity * price;
    budgetResult.textContent = `Orçamento: R$${total.toFixed(2)}`;
  });
});
