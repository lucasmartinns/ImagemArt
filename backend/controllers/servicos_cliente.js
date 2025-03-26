document.addEventListener("DOMContentLoaded", function () {
  const itemsContainer = document.getElementById("itemsContainer");

  // Exemplo de dados de serviços
  const services = [
    {
      name: "Serviço 1",
      image: "../assets/img/servicos/service1.png",
      details: "Detalhes do Serviço 1",
    },
    {
      name: "Serviço 2",
      image: "../assets/img/servicos/service2.png",
      details: "Detalhes do Serviço 2",
    },
    {
      name: "Serviço 3",
      image: "../assets/img/servicos/service3.png",
      details: "Detalhes do Serviço 3",
    },
  ];

  // Função para carregar os serviços
  function loadServices() {
    services.forEach((service) => {
      const item = document.createElement("div");
      item.className = "service-item";
      item.innerHTML = `
        <div class="image-container">
          <img src="${service.image}" alt="${service.name}" class="service-image"/>
        </div>
        <h3>${service.name}</h3>
        <p>${service.details}</p>
      `;
      itemsContainer.appendChild(item);
    });
  }

  loadServices();
});