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
  const deleteServiceBtn = document.getElementById("deleteServiceBtn");

  let selectedService = null;
  let variacoesServico = []; // guarda as variações do serviço selecionado

  // Função para atualizar o preço baseado na variação selecionada e quantidade
  function atualizaPrecoCalculado() {
    const quantity = parseInt(serviceQuantity.value, 10) || 1;
    const selectedOption = serviceDropdown.selectedOptions[0];
    if (!selectedOption) return;

    const precoBase = parseFloat(selectedOption.getAttribute("data-price"));
    const quantidadeMinima =
      parseInt(selectedOption.getAttribute("data-quantidade-minima")) || 1;

    // Encontrar o preço correto baseado na quantidade
    // Procura a maior quantidade_minima <= quantity e mesma descrição
    let precoFinal = precoBase;
    if (variacoesServico.length > 0) {
      const opDescricao = selectedOption.value;
      const variacoesValidas = variacoesServico
        .filter(
          (v) => v.quantidade_minima <= quantity && v.descricao === opDescricao
        )
        .sort((a, b) => b.quantidade_minima - a.quantidade_minima);

      if (variacoesValidas.length > 0) {
        precoFinal = variacoesValidas[0].preco;
      }
    }

    const quantidadeFinal = Math.max(quantity, quantidadeMinima);
    const total = precoFinal * quantidadeFinal;
    servicePrice.textContent = total.toFixed(2);
  }

  // Função para buscar serviços e montar itens clicáveis
  const fetchServices = async () => {
    try {
      const response = await fetch("/servico");
      if (!response.ok) throw new Error("Erro ao carregar os serviços.");
      const services = await response.json();

      console.log(services);

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
          if (service) {
            selectedService = service;
            modalServiceName.textContent =
              service.nome || "Serviço Indisponível";
          } else {
            modalServiceName.textContent = "Serviço Indisponível";
          }

          serviceDropdown.innerHTML = "";
          servicePrice.textContent = "0.00";

          fetch(`/servico/${service.idservico}/variacoes`)
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar variações");
              return res.json();
            })
            .then((variacoes) => {
              variacoesServico = variacoes;
              serviceDropdown.innerHTML = "";

              if (variacoes && variacoes.length > 0) {
                variacoes.forEach((variacao) => {
                  const option = document.createElement("option");
                  option.value = variacao.descricao;
                  option.setAttribute("data-price", variacao.preco);
                  option.setAttribute(
                    "data-quantidade-minima",
                    variacao.quantidade_minima || 1
                  );
                  option.textContent = variacao.descricao;
                  serviceDropdown.appendChild(option);
                });

                atualizaPrecoCalculado();
              } else {
                const option = document.createElement("option");
                option.value = service.nome;
                option.setAttribute("data-price", service.valor || 0);
                option.setAttribute("data-quantidade-minima", 1);
                option.textContent = service.nome;
                serviceDropdown.appendChild(option);

                servicePrice.textContent = (service.valor || 0).toFixed(2);
              }

              serviceQuantity.value = 1;
              budgetResult.textContent = "";
              itemModal.style.display = "flex";
              if (isAdmin()) {
                deleteServiceBtn.style.display = "inline-block";
                deleteServiceBtn.onclick = async function () {
                  if (
                    await showCustomConfirm(
                      `Tem certeza que deseja deletar o serviço "${service.nome}"?`
                    )
                  ) {
                    try {
                      const response = await fetch(
                        `/deletarservico/${service.idservico}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );

                      if (!response.ok)
                        throw new Error("Erro ao deletar o serviço.");

                      showCustomAlert("Serviço deletado com sucesso!");

                      itemModal.style.display = "none";
                      loadServices(); // Atualiza a lista
                    } catch (err) {
                      console.error("Erro ao deletar serviço:", err);
                      showCustomAlert("Erro ao deletar o serviço.");
                    }
                  }
                };
              } else {
                deleteServiceBtn.style.display = "none";
              }
            })

            .catch((err) => {
              console.error("Erro ao buscar variações:", err);
              showCustomAlert("Erro ao carregar variações do serviço.");
            });
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

  serviceDropdown.addEventListener("change", atualizaPrecoCalculado);
  serviceQuantity.addEventListener("input", atualizaPrecoCalculado);

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

    const selectedOption = serviceDropdown.selectedOptions[0];
    const quantidadeMinima =
      parseInt(selectedOption.getAttribute("data-quantidade-minima")) || 1;
    const quantidadeFinal = Math.max(quantity, quantidadeMinima);

    let precoBase = parseFloat(selectedOption.getAttribute("data-price"));
    let precoFinal = precoBase;
    if (variacoesServico.length > 0) {
      const opDescricao = selectedOption.value;
      const variacoesValidas = variacoesServico
        .filter(
          (v) =>
            v.quantidade_minima <= quantidadeFinal &&
            v.descricao === opDescricao
        )
        .sort((a, b) => b.quantidade_minima - a.quantidade_minima);

      if (variacoesValidas.length > 0) {
        precoFinal = variacoesValidas[0].preco;
      }
    }

    const total = precoFinal * quantidadeFinal;
    budgetResult.textContent = `Total: R$ ${total.toFixed(2)}`;

    calculateBudget.disabled = true;
    calculateBudget.textContent = "Enviando...";

    try {
      const response = await fetch("/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_idusuario: userId,
          servico_idservico: selectedService.idservico,
          quantidade: quantidadeFinal,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar pedido");

      const data = await response.json();
      budgetResult.textContent = `✅ Pedido criado com sucesso! ID ${data.id}`;
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      budgetResult.textContent = "❌ Erro ao criar o pedido.";
    } finally {
      // calculateBudget.disabled = false;
      // calculateBudget.textContent = "Fazer Orçamento";
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
Total: R$${total.toFixed(2)}`;
    console.log(mensagem);

    const whatsappURL = `https://api.whatsapp.com/send?phone=5514999034536&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(whatsappURL, "_blank");
  });
});

// -------------- ADM --------------
// ---------- CONSTANTES DE ELEMENTOS ----------
const createItemImgAdm = document.getElementById("createItemImgAdm");
const itemModalAdm = document.getElementById("itemModalAdm");
const closeModalAdm = document.getElementsByClassName("closeAdm")[0];
const saveBtnAdm = document.getElementById("saveBtnAdm");
const deleteBtnAdm = document.getElementById("deleteBtnAdm");
const itemsContainerAdm = document.getElementById("itemsContainerAdm");
const serviceFormAdm = document.getElementById("serviceFormAdm");
const detailsTableAdm = document
  .getElementById("detailsTableAdm")
  .getElementsByTagName("tbody")[0];
const selectedImageAdm = document.getElementById("selectedImageAdm");
const imageInputAdm = document.getElementById("imageInputAdm");
const addItemFormAdm = document.querySelector(".addItemFormAdm");
const modalPlusSymbolAdm = document.getElementById("modalPlusSymbolAdm");
let currentItemAdm = null;

if (!isAdmin()) {
  const addItemAdm = document.querySelector(".addItemAdm");
  const itemModalAdm = document.getElementById("itemModalAdm");

  if (addItemAdm) addItemAdm.remove();
  if (itemModalAdm) itemModalAdm.remove();
}

// ---------- FUNÇÕES UTILITÁRIAS ----------

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
addEmptyRowAdm();

// Função para verificar se o usuário é administrador
function isAdmin() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.tipo === 1; // Retorna true se o tipo for 1 (administrador)
    } catch {
      return false;
    }
  }
  return false;
}

// Configurar funcionalidades específicas para administradores
function configureAdminFeatures() {
  if (isAdmin()) {
    createItemImgAdm.style.display = "block"; // Exibe o botão de adicionar
    createItemImgAdm.onclick = function () {
      clearFormAdm();
      currentItemAdm = null;
      itemModalAdm.style.display = "flex";
      deleteBtnAdm.style.display = "none";
      selectedImageAdm.src = "";
      selectedImageAdm.style.display = "none";
      modalPlusSymbolAdm.style.display = "block";
      imageInputAdm.value = "";
    };
  } else {
    createItemImgAdm.style.display = "none"; // Oculta o botão de adicionar
  }
}

// Função para carregar os serviços
function loadServices() {
  if (!itemsContainerAdm) {
    console.warn("itemsContainerAdm não encontrado.");
    return;
  }
  console.log("Iniciando o carregamento dos serviços...");
  fetch("/servico", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Enviar token do usuário
    },
  })
    .then((response) => {
      console.log("Resposta da API recebida:", response);
      if (!response.ok) {
        throw new Error(
          `Erro na resposta da API: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((services) => {
      console.log("Serviços recebidos da API:", services);
      if (!services || services.length === 0) {
        throw new Error("Nenhum serviço encontrado.");
      }

      // Renderizar os serviços na interface
      itemsContainerAdm.innerHTML = ""; // Limpar container antes de renderizar
      services.forEach((service) => {
        const serviceElement = document.createElement("div");
        serviceElement.className = "service-item";
        serviceElement.innerHTML = `
          <h3>${service.nome}</h3>
          <p>Preço: R$${service.valor}</p>
        `;
        itemsContainerAdm.appendChild(serviceElement);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar serviços:", error);
      showCustomAlert(
        "Não foi possível carregar os serviços. Verifique sua conexão ou tente novamente mais tarde."
      );
    });
}

// Limpa o formulário e a tabela de detalhes
function clearFormAdm() {
  serviceFormAdm.reset();
  detailsTableAdm.innerHTML = "";
}

// Adiciona uma linha vazia na tabela de detalhes
function addEmptyRowAdm() {
  const row = detailsTableAdm.insertRow();
  row.innerHTML = `
    <td contenteditable="true" data-placeholder="Adicione opções para seu serviço"></td>
    <td contenteditable="true" class="priceAdm" data-placeholder="Adicione o valor do seu serviço"></td>
    <td contenteditable="true" class="quantityAdm" data-placeholder="Adicione a quantidade mínima"></td>
    <td></td>
  `;

  const cells = row.querySelectorAll("[contenteditable='true']");
  cells.forEach((cell) => {
    cell.onfocus = function () {
      cell.removeAttribute("data-placeholder");
    };
    cell.onblur = function () {
      if (!cell.innerText.trim()) {
        // Recupera o placeholder original do atributo HTML
        const originalPlaceholder =
          cell.getAttribute("data-placeholder-original") ||
          cell.getAttribute("data-placeholder");
        cell.setAttribute("data-placeholder", originalPlaceholder);
      }
      // Se o item já estiver criado, atualiza seus detalhes sempre que uma célula perder o foco
      if (currentItemAdm) {
        currentItemAdm.dataset.details = JSON.stringify(
          getDetailsFromTableAdm()
        );
      }
    };
    // Salva o placeholder original na primeira vez
    if (
      !cell.getAttribute("data-placeholder-original") &&
      cell.getAttribute("data-placeholder")
    ) {
      cell.setAttribute(
        "data-placeholder-original",
        cell.getAttribute("data-placeholder")
      );
    }
    cell.addEventListener("input", checkLastRowAdm);
  });

  // Exemplo ao adicionar linha:
  row.querySelector(".priceAdm").onblur = formatPriceAdm;
  row.querySelector(".quantityAdm").onblur = validateQuantityAdm;
}

// Verifica se a última linha foi preenchida e adiciona uma nova linha vazia
function checkLastRowAdm() {
  const rows = detailsTableAdm.rows;
  const lastRow = rows[rows.length - 1];
  const isLastRowFilled = Array.from(lastRow.cells).some(
    (cell) => cell.innerText.trim() !== ""
  );

  if (isLastRowFilled) {
    addEmptyRowAdm();
  }
}

// Formatar preço para moeda brasileira
function formatPriceAdm(event) {
  let value = event.target.innerText.replace(/[^\d.,]/g, "").replace(",", ".");
  if (!value) {
    event.target.innerText = "";
    // Restaurar placeholder se vazio
    const originalPlaceholder =
      event.target.getAttribute("data-placeholder-original") ||
      event.target.getAttribute("data-placeholder");
    event.target.setAttribute("data-placeholder", originalPlaceholder);
    return;
  }
  let number = Number(value);
  if (isNaN(number)) {
    event.target.innerText = "";
    const originalPlaceholder =
      event.target.getAttribute("data-placeholder-original") ||
      event.target.getAttribute("data-placeholder");
    event.target.setAttribute("data-placeholder", originalPlaceholder);
    return;
  }
  event.target.innerText = `R$ ${number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Validar se a quantidade é um número inteiro válido
function validateQuantityAdm(event) {
  let value = event.target.innerText.replace(/\D/g, "");
  if (!value) {
    event.target.innerText = "";
    // Restaurar placeholder se vazio
    const originalPlaceholder =
      event.target.getAttribute("data-placeholder-original") ||
      event.target.getAttribute("data-placeholder");
    event.target.setAttribute("data-placeholder", originalPlaceholder);
    return;
  }
  event.target.innerText = BigInt(value).toString();
}

// Obter detalhes da tabela
function getDetailsFromTableAdm() {
  const details = [];
  for (let i = 0; i < detailsTableAdm.rows.length; i++) {
    const row = detailsTableAdm.rows[i];
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
function loadDetailsToTableAdm(details) {
  detailsTableAdm.innerHTML = "";
  details.forEach((detail) => {
    const row = detailsTableAdm.insertRow();
    row.innerHTML = `
      <td contenteditable="true">${detail.detail}</td>
      <td contenteditable="true" class="priceAdm">${detail.price}</td>
      <td contenteditable="true" class="quantityAdm">${detail.quantity}</td>
      <td><button type="button" class="deleteRowBtnAdm" style="text-align: center;">x</button></td>
    `;
    row.querySelector(".deleteRowBtnAdm").onclick = function () {
      detailsTableAdm.deleteRow(row.rowIndex - 1);
      if (currentItemAdm) {
        currentItemAdm.dataset.details = JSON.stringify(
          getDetailsFromTableAdm()
        );
      }
    };
  });
  addEmptyRowAdm();
}

// ---------- EVENTOS ----------

// Abrir modal ao clicar na imagem para criar item (somente para administradores)
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente carregado. Iniciando configurações...");
  if (isAdmin()) {
    loadServices();
    configureAdminFeatures();
  } else {
    const addItemAdm = document.querySelector(".addItemAdm");
    const itemModalAdm = document.getElementById("itemModalAdm");
    if (addItemAdm) addItemAdm.remove();
    if (itemModalAdm) itemModalAdm.remove();
  }
});

// Fechar modal ao clicar no botão fechar
closeModalAdm.onclick = function () {
  itemModalAdm.style.display = "none";
};

// Salvar item
saveBtnAdm.onclick = async function () {
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }

  const serviceNameAdm = document.getElementById("serviceNameAdm").value;
  const serviceImageAdm = imageInputAdm.files[0];
  const updatedDetails = getDetailsFromTableAdm();

  if (!serviceNameAdm) {
    showCustomAlert("Por favor, preencha o nome do serviço.");
    return;
  }

  if (!serviceImageAdm) {
    showCustomAlert("Por favor, selecione uma imagem para o serviço.");
    return;
  }

  // Montar FormData
  const formData = new FormData();
  formData.append("nome", serviceNameAdm);
  formData.append("imagem", serviceImageAdm);
  formData.append(
    "variacoes",
    JSON.stringify(
      updatedDetails.map((v) => ({
        descricao: v.detail,
        preco: parseFloat(v.price.replace("R$", "").replace(",", ".").trim()),
        quantidade_minima: parseInt(v.quantity) || 1,
      }))
    )
  );

  try {
    const response = await fetch("/criarservico", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao criar serviço.");
    }

    const data = await response.json();
    console.log("Serviço criado com sucesso:", data);

    showCustomAlert("Serviço criado com sucesso!");

    // Fecha modal
    itemModalAdm.style.display = "none";

    // Atualiza lista
    loadServices();
  } catch (err) {
    console.error("Erro ao criar serviço:", err);
    showCustomAlert("Erro ao criar o serviço.");
  }
};

// Remover item selecionado
deleteBtnAdm.onclick = function () {
  // Exemplo para exclusão instantânea do DOM
  if (currentItemAdm) {
    itemsContainerAdm.removeChild(currentItemAdm);
    currentItemAdm = null;
    itemModalAdm.style.display = "none";
    loadServices(); // Atualiza lista
  }
};

// Simula clique no input de arquivo ao clicar no formulário de adição de item
addItemFormAdm.addEventListener("click", function () {
  imageInputAdm.click();
});

// // Carregar imagem selecionada
// imageInputAdm.addEventListener("change", function (event) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       selectedImageAdm.src = e.target.result;
//       selectedImageAdm.style.display = "block";
//       modalPlusSymbolAdm.style.display = "none";
//     };
//     reader.readAsDataURL(file);
//   }
// });

// Inicializar com uma linha em branco
addEmptyRowAdm();

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
});

document.addEventListener("DOMContentLoaded", () => {
  const createItemImgAdm = document.getElementById("createItemImgAdm");
  const itemModalAdm = document.getElementById("itemModalAdm");
  const deleteBtnAdm = document.getElementById("deleteBtnAdm");
  const selectedImageAdm = document.getElementById("selectedImageAdm");
  const modalPlusSymbolAdm = document.getElementById("modalPlusSymbolAdm");
  const imageInputAdm = document.getElementById("imageInputAdm");

  createItemImgAdm.onclick = function () {
    console.log("clicou!");
    itemModalAdm.style.display = "flex";
    deleteBtnAdm.style.display = "none";
    selectedImageAdm.src = "";
    selectedImageAdm.style.display = "none";
    modalPlusSymbolAdm.style.display = "block";
    imageInputAdm.value = "";
  };
});
