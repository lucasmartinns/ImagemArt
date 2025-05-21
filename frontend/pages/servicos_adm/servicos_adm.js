// ---------- CONSTANTES DE ELEMENTOS ----------
const createItemImg = document.getElementById("createItemImg");
const itemModalAdm = document.getElementById("itemModalAdm");
const closeModal = document.getElementsByClassName("close")[0];
const saveBtnAdm = document.getElementById("saveBtnAdm");
const deleteBtnAdm = document.getElementById("deleteBtnAdm");
const itemsContainerAdm = document.getElementById("itemsContainerAdm");
const serviceFormAdm = document.getElementById("serviceFormAdm");
const detailsTable = document
  .getElementById("detailsTable")
  .getElementsByTagName("tbody")[0];
const selectedImageAdm = document.getElementById("selectedImageAdm");
const imageInputAdm = document.getElementById("imageInputAdm");
const addItemFormAdm = document.querySelector(".addItemFormAdm");
const modalPlusSymbolAdm = document.getElementById("modalPlusSymbolAdm");
let currentItem = null;

// ---------- FUNÇÕES UTILITÁRIAS ----------

// Limpa o formulário e a tabela de detalhes
function clearForm() {
  serviceFormAdm.reset();
  detailsTable.innerHTML = "";
  addEmptyRow();
  selectedImageAdm.src = "";
  selectedImageAdm.style.display = "none";
  modalPlusSymbolAdm.style.display = "block ";
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
      // Se o item já estiver criado, atualiza seus detalhes sempre que uma célula perder o foco
      if (currentItem) {
        currentItem.dataset.details = JSON.stringify(getDetailsFromTable());
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
      detail: row.cells[0].innerText.trim(),
      price: row.cells[1].innerText.trim(),
      quantity: row.cells[2].innerText.trim(),
    };
    if (detail.detail && detail.price && detail.quantity) {
      details.push(detail);
    }
  }
  console.log("Detalhes coletados:", details);
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
      if (currentItem) {
        currentItem.dataset.details = JSON.stringify(getDetailsFromTable());
      }
    };
  });
  addEmptyRow();
}

// ---------- EVENTOS ----------

// Abrir modal ao clicar na imagem para criar item
createItemImg.onclick = function () {
  clearForm();
  currentItem = null;
  itemModalAdm.style.display = "flex";
  deleteBtnAdm.style.display = "none";
  selectedImageAdm.src = "";
  selectedImageAdm.style.display = "none";
  modalPlusSymbolAdm.style.display = "block";
  imageInputAdm.value = "";
};

// Fechar modal ao clicar no botão fechar
closeModal.onclick = function () {
  itemModalAdm.style.display = "none";
};

// Salvar item
saveBtnAdm.onclick = function () {
  // Força a finalização da edição de qualquer célula em foco
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }

  const serviceName = document.getElementById("serviceName").value;
  const serviceImage = imageInputAdm.files[0];

  if (!serviceName) {
    showCustomAlert("Por favor, preencha o nome do serviço.");
    return;
  }

  if (!serviceImage && !currentItem) {
    showCustomAlert("Por favor, selecione uma imagem para o serviço.");
    return;
  }

  const updatedDetails = getDetailsFromTable();

  const reader = new FileReader();
  reader.onload = function (e) {
    if (currentItem) {
      currentItem.querySelector(".service-image").src =
        e.target.result || currentItem.dataset.image;
      currentItem.dataset.image = e.target.result || currentItem.dataset.image;
      currentItem.querySelector("h3").innerText = serviceName;
      currentItem.dataset.details = JSON.stringify(updatedDetails); // <-- atualiza aqui!
    } else {
      const item = document.createElement("div");
      item.className = "service-item";
      item.dataset.details = JSON.stringify(updatedDetails);
      item.dataset.image = e.target.result; // Adiciona a imagem ao dataset
      item.innerHTML = `
        <div class="image-container">
          <img class="background-image" src="../../assets/img/servicos/backgroundImage.png" alt="${serviceName}" />
          <img src="${e.target.result}" alt="${serviceName}" class="service-image"/>
        </div>
        <h3>${serviceName}</h3>
      `;

      item.onclick = function () {
        currentItem = item;
        document.getElementById("serviceName").value =
          item.querySelector("h3").innerText;
        selectedImageAdm.src = item.dataset.image;
        selectedImageAdm.style.display = "block";
        modalPlusSymbolAdm.style.display = "none";
        imageInputAdm.value = "";
        loadDetailsToTable(JSON.parse(item.dataset.details || "[]"));
        deleteBtnAdm.style.display = "block";
        itemModalAdm.style.display = "flex";
      };

      const addItemBlock = document.querySelector(".addItem");

      // Insere o novo item antes do bloco de criação, mas mantém o bloco de criação no topo
      itemsContainerAdm.insertBefore(item, addItemBlock.nextSibling);
    }
    itemModalAdm.style.display = "none";
  };

  // Se não tiver imagem nova, só salva com os dados existentes
  if (!serviceImage && currentItem) {
    currentItem.dataset.details = JSON.stringify(updatedDetails);
    currentItem.querySelector("h3").innerText = serviceName;
    itemModalAdm.style.display = "none";
  } else {
    reader.readAsDataURL(serviceImage);
  }
};

// Remover item selecionado
deleteBtnAdm.onclick = function () {
  if (currentItem) {
    itemsContainerAdm.removeChild(currentItem);
    currentItem = null;
    itemModalAdm.style.display = "none";
  }
};

// Simula clique no input de arquivo ao clicar no formulário de adição de item
addItemFormAdm.addEventListener("click", function () {
  imageInputAdm.click();
});

// Carregar imagem selecionada
imageInputAdm.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImageAdm.src = e.target.result;
      selectedImageAdm.style.display = "block";
      modalPlusSymbolAdm.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Inicializar com uma linha em branco
addEmptyRow();

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  let tipo = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      tipo = payload.tipo;
    } catch {
      tipo = null;
    }
  }
  if (!token || tipo !== 1) {
    window.location.href = "/home";
  }
});
