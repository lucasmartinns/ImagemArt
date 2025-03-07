// Obter elementos
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

let currentItem = null;

// Abrir modal ao clicar na imagem de criar item
createItemImg.onclick = function () {
  clearForm();
  currentItem = null;
  itemModal.style.display = "block";
  deleteBtn.style.display = "none"; // Esconder botão de excluir ao criar novo item
  serviceImagePreview.style.display = "none"; // Esconder a pré-visualização da imagem
};

// Fechar modal ao clicar no X
closeModal.onclick = function () {
  itemModal.style.display = "none";
};

// Fechar modal ao clicar fora do modal
window.onclick = function (event) {
  if (event.target == itemModal) {
    itemModal.style.display = "none";
  }
};

// Limpar formulário
function clearForm() {
  serviceForm.reset();
  detailsTable.innerHTML = ""; // Limpar tabela de detalhes
  addEmptyRow(); // Adicionar linha em branco
}

// Adicionar linha em branco à tabela
function addEmptyRow() {
  const row = detailsTable.insertRow();
  row.innerHTML = `
    <td contenteditable="true">Clique para adicionar detalhes</td>
    <td contenteditable="true" class="price">Clique para adicionar preço</td>
    <td contenteditable="true" class="quantity">Clique para adicionar quantidade</td>
    <td></td>
  `;
  row.querySelector(".price").onblur = formatPrice;
  row.querySelector(".quantity").onblur = validateQuantity;
}

// Formatar preço como valor em reais
function formatPrice(event) {
  let value = event.target.innerText.replace("R$", "").trim();
  value = parseFloat(value.replace(",", ".")).toFixed(2);
  if (!isNaN(value)) {
    event.target.innerText = `R$ ${value.replace(".", ",")}`;
  } else {
    event.target.innerText = "";
  }
}

// Validar quantidade como número inteiro
function validateQuantity(event) {
  let value = event.target.innerText;
  value = parseInt(value, 10);
  if (!isNaN(value) && value > 0) {
    event.target.innerText = value;
  } else {
    event.target.innerText = "";
  }
}

// Salvar item
saveBtn.onclick = function () {
  const serviceName = document.getElementById("serviceName").value;
  const serviceImage = document.getElementById("serviceImage").files[0];

  if (serviceName) {
    if (serviceImage || currentItem) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (currentItem) {
          // Atualizar item existente
          if (serviceImage) {
            currentItem.querySelector(".service-image").src = e.target.result;
          }
          currentItem.querySelector("h3").innerText = serviceName;
          currentItem.dataset.details = JSON.stringify(getDetailsFromTable());
        } else {
          // Criar novo item
          const item = document.createElement("div");
          item.className = "service-item";
          item.innerHTML = `
            <img src="${e.target.result}" alt="${serviceName}" class="service-image"/>
            <h3>${serviceName}</h3>
          `;
          item.dataset.details = JSON.stringify(getDetailsFromTable());
          item.onclick = function () {
            currentItem = item;
            itemModal.style.display = "block";
            document.getElementById("serviceName").value = serviceName;
            loadDetailsToTable(JSON.parse(item.dataset.details));
            deleteBtn.style.display = "block"; // Mostrar botão de excluir ao editar item
            serviceImagePreview.src = item.querySelector(".service-image").src;
            serviceImagePreview.style.display = "block"; // Mostrar a pré-visualização da imagem
          };
          itemsContainer.appendChild(item);
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
      alert("Por favor, selecione uma imagem.");
    }
  } else {
    alert("Por favor, preencha o nome do serviço.");
  }
};

// Excluir item
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
      <td><button type="button" class="deleteDetailBtn">Excluir</button></td>
    `;
    row.querySelector(".deleteDetailBtn").onclick = function () {
      detailsTable.deleteRow(row.rowIndex - 1);
      if (detailsTable.rows.length === 0) {
        addEmptyRow();
      }
    };
    row.querySelector(".price").onblur = formatPrice;
    row.querySelector(".quantity").onblur = validateQuantity;
  });
  addEmptyRow(); // Adicionar linha em branco no final
}

// Inicializar com uma linha em branco
addEmptyRow();

document.addEventListener("DOMContentLoaded", function () {
  const detailsTable = document
    .getElementById("detailsTable")
    .getElementsByTagName("tbody")[0];

  detailsTable.addEventListener("input", function (event) {
    const rows = detailsTable.getElementsByClassName("editable-row");
    const lastRow = rows[rows.length - 1];
    const isLastRowEmpty = Array.from(lastRow.cells).every(
      (cell) => cell.textContent.trim() === ""
    );

    if (!isLastRowEmpty) {
      const newRow = lastRow.cloneNode(true);
      Array.from(newRow.cells).forEach((cell) => (cell.textContent = ""));
      detailsTable.appendChild(newRow);
    }
  });
});
