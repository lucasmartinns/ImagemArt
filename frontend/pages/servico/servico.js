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
  let variacoesServico = []; // guarda as variações do serviço selecionado

  // Função para carregar imagens do banco
  const carregarImagens = async () => {
    try {
      const response = await fetch('/imagens'); // Fazendo a requisição para buscar as imagens
      const imagens = await response.json(); // Recebe as imagens do backend

      imagens.forEach(imagem => {
        const imgElement = document.createElement('img');
        imgElement.src = imagem.caminho; // Caminho da imagem no backend
        imgElement.alt = 'Imagem de Serviço'; // Texto alternativo para acessibilidade
        imgElement.classList.add('imagem-servico'); // Adiciona uma classe CSS para as imagens (opcional)

        // Adiciona a imagem ao container
        itemsContainer.appendChild(imgElement);
      });
    } catch (error) {
      console.error('Erro ao carregar as imagens:', error);
    }
  };

  // Carrega as imagens quando a página for carregada
  carregarImagens();

  // Função para atualizar o preço baseado na variação selecionada e quantidade
  function atualizaPrecoCalculado() {
    const quantity = parseInt(serviceQuantity.value, 10) || 1;
    const selectedOption = serviceDropdown.selectedOptions[0];
    if (!selectedOption) return;

    const precoBase = parseFloat(selectedOption.getAttribute("data-price"));
    const quantidadeMinima = parseInt(selectedOption.getAttribute("data-quantidade-minima")) || 1;

    // Encontrar o preço correto baseado na quantidade
    // Procura a maior quantidade_minima <= quantity e mesma descrição
    let precoFinal = precoBase;
    if (variacoesServico.length > 0) {
      const opDescricao = selectedOption.value;
      const variacoesValidas = variacoesServico
        .filter(v => v.quantidade_minima <= quantity && v.descricao === opDescricao)
        .sort((a,b) => b.quantidade_minima - a.quantidade_minima);

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
            modalServiceName.textContent = service.nome || "Serviço Indisponível";
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
                  option.setAttribute("data-quantidade-minima", variacao.quantidade_minima || 1);
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
      alert("Por favor, insira uma quantidade válida.");
      return;
    }

    if (!selectedService) {
      alert("Por favor, selecione um serviço.");
      return;
    }

    const selectedOption = serviceDropdown.selectedOptions[0];
    const quantidadeMinima = parseInt(selectedOption.getAttribute("data-quantidade-minima")) || 1;
    const quantidadeFinal = Math.max(quantity, quantidadeMinima);

    let precoBase = parseFloat(selectedOption.getAttribute("data-price"));
    let precoFinal = precoBase;
    if (variacoesServico.length > 0) {
      const opDescricao = selectedOption.value;
      const variacoesValidas = variacoesServico
        .filter(v => v.quantidade_minima <= quantidadeFinal && v.descricao === opDescricao)
        .sort((a,b) => b.quantidade_minima - a.quantidade_minima);

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
