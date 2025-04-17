// ---------- CONSTANTES DE ELEMENTOS ----------
const itemModal = document.getElementById("itemModal");
const closeModal = document.getElementsByClassName("close")[0];
const itemsContainer = document.getElementById("itemsContainer");
const detailsTable = document
  .getElementById("detailsTable")
  .getElementsByTagName("tbody")[0];
const selectedDetails = document.getElementById("selectedDetails");
const selectedQuantity = document.getElementById("selectedQuantity");
const confirmBtn = document.getElementById("confirmBtn");
let currentItem = null;

// ---------- FUNÇÕES UTILITÁRIAS ----------

// Limpa o formulário e a tabela de detalhes
function clearForm() {
  detailsTable.innerHTML = "";
  selectedDetails.innerText = "";
  selectedQuantity.value = 1;
}

// Carregar detalhes no modal
function loadDetailsToModal(details) {
  detailsTable.innerHTML = "";
  details.forEach((detail) => {
    const row = detailsTable.insertRow();
    row.innerHTML = `
      <td>${detail.detail}</td>
      <td>${detail.price}</td>
      <td>${detail.quantity}</td>
    `;
    row.onclick = function () {
      selectedDetails.innerText = detail.detail;
      selectedQuantity.max = detail.quantity;
      selectedQuantity.value = 1;
    };
  });
}

// ---------- EVENTOS ----------
// Abrir modal ao clicar em um item
itemsContainer.addEventListener("click", function (event) {
  const item = event.target.closest(".service-item");
  if (item) {
    currentItem = item;
    document.getElementById("serviceName").innerText =
      item.querySelector("h3").innerText;
    loadDetailsToModal(JSON.parse(item.dataset.details || "[]"));
    itemModal.style.display = "flex";
  }
});

// Fechar modal ao clicar no botão fechar
closeModal.onclick = function () {
  itemModal.style.display = "none";
};

// Confirmar seleção
confirmBtn.onclick = function () {
  const selectedDetail = selectedDetails.innerText;
  const quantity = selectedQuantity.value;

  if (!selectedDetail || !quantity) {
    alert("Por favor, selecione um detalhe e uma quantidade.");
    return;
  }

  alert(
    `Você selecionou: ${selectedDetail}, Quantidade: ${quantity}. Obrigado!`
  );
  itemModal.style.display = "none";
};
