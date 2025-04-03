// ---------- CONSTANTES DE ELEMENTOS ----------
const createItemImg = document.getElementById("createItemImg");
const itemModal = document.getElementById("itemModal");
const closeModal = document.getElementsByClassName("close")[0];
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const itemsContainer = document.getElementById("itemsContainer");
const serviceForm = document.getElementById("serviceForm");
const detailsTable = document
  .getElementById("detailsTable")
  .getElementsByTagName("tbody")[0];
const selectedImage = document.getElementById("selectedImage");
const imageInput = document.getElementById("imageInput");
const addItemForm = document.querySelector(".addItemForm");
const modalPlusSymbol = document.getElementById("modalPlusSymbol");
// Note: backgroundImage e serviceImagePreview foram removidos por não serem utilizados

let currentItem = null; // Armazena o item atualmente sendo editado

// ---------- FUNÇÕES UTILITÁRIAS ----------

// Limpa o formulário e a tabela de detalhes
function clearForm() {
  serviceForm.reset();
  detailsTable.innerHTML = "";
  addEmptyRow();
  selectedImage.src = "";
  selectedImage.style.display = "none";
  modalPlusSymbol.style.display = "block";
}

// Adiciona uma linha vazia na tabela de detalhes
function addEmptyRow() {
  const row = detailsTable.insertRow();
  row.innerHTML = `
    <td contenteditable="true" data-placeholder="Adicione detalhes sobre seu serviço"></td>
    <td contenteditable="true" class="price" data-placeholder="Adicione o valor do seu serviço"></td>
    <td contenteditable="true" class="quantity" data-placeholder="Adicione a quantidade mínima"></td>
    <td></td>
  `;

  const cells = row.querySelectorAll("[contenteditable='true']");
  cells.forEach((cell) => {
    cell.onfocus = function () {
      cell.removeAttribute("data-placeholder");
    };
    cell.onblur = function () {
      if (!cell.innerText.trim()) {
        cell.setAttribute(
          "data-placeholder",
          cell.getAttribute("data-placeholder")
        );
      }
    };
    cell.addEventListener("input", checkLastRow);
  });

  row.querySelector(".price").onblur = formatPrice;
  row.querySelector(".quantity").onblur = validateQuantity;
}

// Verifica se a última linha foi preenchida e adiciona uma nova linha vazia
function checkLastRow() {
  const rows = detailsTable.rows;
  const lastRow = rows[rows.length - 1];
  const isLastRowFilled = Array.from(lastRow.cells).some(
    (cell) => cell.innerText.trim() !== ""
  );

  if (isLastRowFilled) {
    addEmptyRow();
  }
}

// Formatar preço para moeda brasileira
function formatPrice(event) {
  let value = event.target.innerText.replace("R$", "").trim();
  value = parseFloat(value.replace(",", ".")).toFixed(2);
  if (!isNaN(value)) {
    event.target.innerText = `R$ ${value.replace(".", ",")}`;
  } else {
    event.target.innerText = "";
  }
}

// Validar se a quantidade é um número inteiro válido
function validateQuantity(event) {
  let value = parseInt(event.target.innerText, 10);
  if (!isNaN(value) && value > 0) {
    event.target.innerText = value;
  } else {
    event.target.innerText = "";
  }
}

// Obter detalhes da tabela
function getDetailsFromTable() {
  const details = [];
  for (let i = 0; i < detailsTable.rows.length; i++) {
    const row = detailsTable.rows[i];
    const detail = {
      detail: row.cells[0].innerText,
      price: row.cells[1].innerText,
      quantity: row.cells[2].innerText,
    };
    if (detail.detail && detail.price && detail.quantity) {
      details.push(detail);
    }
  }
  return details;
}

// Carregar detalhes na tabela
function loadDetailsToTable(details) {
  detailsTable.innerHTML = "";
  details.forEach((detail) => {
    const row = detailsTable.insertRow();
    row.innerHTML = `
      <td contenteditable="true">${detail.detail}</td>
      <td contenteditable="true" class="price">${detail.price}</td>
      <td contenteditable="true" class="quantity">${detail.quantity}</td>
      <td><button type="button" class="deleteRowBtn" style="text-align: center;">x</button></td>
    `;

    row.querySelector(".deleteRowBtn").onclick = function () {
      detailsTable.deleteRow(row.rowIndex - 1);
    };
  });
  addEmptyRow();
}

// ---------- EVENTOS ----------

// Abrir modal ao clicar na imagem para criar item
createItemImg.onclick = function () {
  clearForm();
  currentItem = null;
  itemModal.style.display = "flex";
  deleteBtn.style.display = "none";
  selectedImage.src = "";
  selectedImage.style.display = "none";
  modalPlusSymbol.style.display = "block";
  imageInput.value = "";
};

// Fechar modal ao clicar no botão fechar
closeModal.onclick = function () {
  itemModal.style.display = "none";
};

// Salvar item
saveBtn.onclick = function () {
  const serviceName = document.getElementById("serviceName").value;
  const serviceImage = imageInput.files[0];

  if (!serviceName) {
    showCustomAlert("Por favor, preencha o nome do serviço.");
    return;
  }

  if (!serviceImage && !currentItem) {
    showCustomAlert("Por favor, selecione uma imagem para o serviço.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    if (currentItem) {
      currentItem.querySelector(".service-image").src =
        e.target.result || currentItem.dataset.image;
      currentItem.dataset.image = e.target.result || currentItem.dataset.image;
      currentItem.querySelector("h3").innerText = serviceName;
      currentItem.dataset.details = JSON.stringify(getDetailsFromTable());
    } else {
      const item = document.createElement("div");
      item.className = "service-item";
      item.innerHTML = `
        <div class="image-container">
          <img src="../../assets/img/servicos/backgroundImage.png" alt="${serviceName}" />
          <img src="${e.target.result}" alt="${serviceName}" class="service-image"/>
        </div>
        <h3>${serviceName}</h3>
      `;
      item.dataset.details = JSON.stringify(getDetailsFromTable());
      item.dataset.image = e.target.result;
      item.onclick = function () {
        currentItem = item;
        itemModal.style.display = "flex";
        document.getElementById("serviceName").value = serviceName;
        loadDetailsToTable(JSON.parse(item.dataset.details));
        deleteBtn.style.display = "block";
        selectedImage.src = item.dataset.image;
        selectedImage.style.display = "block";
        modalPlusSymbol.style.display = "none";
      };
      itemsContainer.insertBefore(item, itemsContainer.lastElementChild);
    }
    itemModal.style.display = "none";
    clearForm();
  };

  if (serviceImage) {
    reader.readAsDataURL(serviceImage);
  } else {
    itemModal.style.display = "none";
    clearForm();
  }
};

// Remover item selecionado
deleteBtn.onclick = function () {
  if (currentItem) {
    itemsContainer.removeChild(currentItem);
    currentItem = null;
    itemModal.style.display = "none";
  }
};

// Simula clique no input de arquivo ao clicar no formulário de adição de item
addItemForm.addEventListener("click", function () {
  imageInput.click();
});

// Carregar imagem selecionada
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImage.src = e.target.result;
      selectedImage.style.display = "block";
      modalPlusSymbol.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Inicializar com uma linha em branco
addEmptyRow();
