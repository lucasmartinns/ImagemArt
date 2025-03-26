// Captura os elementos da interface que serão manipulados no código
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
const serviceImagePreview = document.getElementById("serviceImagePreview");
const addItemForm = document.querySelector(".addItemForm");
const backgroundImage = document.getElementById("backgroundImage");
const selectedImage = document.getElementById("selectedImage");
const imageInput = document.getElementById("imageInput");
const modalPlusSymbol = document.getElementById("modalPlusSymbol");

// Variável que armazena o item atualmente sendo editado
let currentItem = null;

// Abrir modal ao clicar na imagem de criar item
createItemImg.onclick = function () {
  clearForm(); // Limpa o formulário antes de abrir o modal
  currentItem = null; // Reseta a variável para indicar um novo item
  itemModal.style.display = "flex"; // Exibe o modal
  deleteBtn.style.display = "none"; // Esconde o botão de excluir
  serviceImagePreview.style.display = "none"; // Esconde a pré-visualização da imagem
  selectedImage.style.display = "none"; // Esconde a imagem selecionada
  selectedImage.src = ""; // Limpa a imagem selecionada
  modalPlusSymbol.style.display = "block"; // Mostra o símbolo de mais no modal
  imageInput.value = ""; // Limpa o input de imagem
};

// Fechar modal ao clicar no botão de fechar
closeModal.onclick = function () {
  itemModal.style.display = "none";
};

// Fechar modal ao clicar fora dele
window.onclick = function (event) {
  if (event.target == itemModal) {
    itemModal.style.display = "none";
  }
};

// Limpa o formulário e a tabela de detalhes
function clearForm() {
  serviceForm.reset(); // Reseta os campos do formulário
  detailsTable.innerHTML = ""; // Remove todas as linhas da tabela
  addEmptyRow(); // Adiciona uma linha em branco
  selectedImage.src = ""; // Limpa a imagem selecionada
  selectedImage.style.display = "none"; // Esconde a imagem selecionada
  modalPlusSymbol.style.display = "block"; // Mostra o símbolo de mais no modal
}

// Adiciona uma linha vazia na tabela de detalhes
function addEmptyRow() {
  const row = detailsTable.insertRow();
  row.innerHTML = `
    <td contenteditable="true" data-placeholder="Adicione detalhes sobre seu serviço"></td>
    <td contenteditable="true" class="price" data-placeholder="Adicione o valor do seu serviço"></td>
    <td contenteditable="true" class="quantity" data-placeholder="Adicione a quantidade referente ao valor do seu serviço"></td>
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

    // Adiciona evento para verificar se a última linha foi preenchida
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
  let value = event.target.innerText;
  value = parseInt(value, 10);
  if (!isNaN(value) && value > 0) {
    event.target.innerText = value;
  } else {
    event.target.innerText = "";
  }
}

// Salvar um item
saveBtn.onclick = function () {
  const serviceName = document.getElementById("serviceName").value;
  const serviceImage = imageInput.files[0];

  if (serviceName) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (currentItem) {
        // Atualizar item existente
        if (serviceImage) {
          currentItem.querySelector(".service-image").src = e.target.result;
          currentItem.dataset.image = e.target.result;
        }
        currentItem.querySelector("h3").innerText = serviceName;
        currentItem.dataset.details = JSON.stringify(getDetailsFromTable());
      } else {
        // Criar novo item
        const item = document.createElement("div");
        item.className = "service-item";
        item.innerHTML = `
          <div class="image-container">
            <img src="../assets/img/servicos/backgroundImage.png" alt="${serviceName}" />
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
      reader.onload();
    }
  } else {
    alert("Por favor, preencha o nome do serviço.");
  }
};

// Excluir item
// Remove o item atualmente selecionado
deleteBtn.onclick = function () {
  if (currentItem) {
    itemsContainer.removeChild(currentItem);
    currentItem = null;
    itemModal.style.display = "none";
  }
};

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

// Inicializar com uma linha em branco
addEmptyRow();

// Adiciona um evento de clique ao formulário de adição de item
addItemForm.addEventListener("click", function () {
  // Simula um clique no input de arquivo para selecionar uma imagem
  imageInput.click();
});

// Adiciona um evento de mudança ao input de arquivo para carregar a imagem selecionada
imageInput.addEventListener("change", function (event) {
  // Obtém o arquivo selecionado
  const file = event.target.files[0];

  // Verifica se um arquivo foi selecionado
  if (file) {
    // Cria um FileReader para ler o conteúdo do arquivo
    const reader = new FileReader();

    // Define a função de callback para quando a leitura do arquivo estiver completa
    reader.onload = function (e) {
      // Define a imagem selecionada como a imagem de fundo do item
      selectedImage.src = e.target.result;
      selectedImage.style.display = "block";
      modalPlusSymbol.style.display = "none";
    };

    // Lê o conteúdo do arquivo como uma URL de dados
    reader.readAsDataURL(file);
  }
});
