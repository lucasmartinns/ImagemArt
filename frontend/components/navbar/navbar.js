document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      initializeNavbar(); // Inicializa os eventos da navbar
    })
    .catch((error) => console.error("Erro ao carregar a navbar:", error));
});

function initializeNavbar() {
  const subMenu = document.getElementById("subMenu");

  // Simulação de estado: true = logado / false = não logado
  let isLoggedIn = true;

  window.toggleMenu = function () {
    subMenu.classList.toggle("open-menu");
  };

  function updateNavbarState() {
    if (isLoggedIn) {
      // Estado logado
      subMenu.innerHTML = `
      <div class="sub-menu">
          <div class="user-info">
            <img src="../../assets/img/navbar/user-black.png" alt="" />
            <h3>Nome do Usuário</h3>
          </div>
          <hr />
          <a href="#" class="sub-menu-link">
            <span class="material-symbols-outlined"> manage_accounts </span>
            <p>Editar Perfil</p>
          </a>
          <a href="#" class="sub-menu-link">
            <span class="material-symbols-outlined"> logout </span>
            <p>Sair</p>
          </a>
      </div>`;
      subMenu.classList.remove("not-logged");
    } else {
      // Estado não logado
      subMenu.innerHTML = `
      <div class="sub-menu">
          <a href="../../pages/login/login.html" class="sub-menu-link">
            <span class="material-symbols-outlined"> person </span>
            <p>Entrar</p>
          </a>
          <a href="../../pages/register/register.html" class="sub-menu-link">
            <span class="material-symbols-outlined"> person_add </span>
            <p>Cadastre-se</p>
          </a>
      </div>`;
      subMenu.classList.add("not-logged");
    }
  }
  updateNavbarState();
}
