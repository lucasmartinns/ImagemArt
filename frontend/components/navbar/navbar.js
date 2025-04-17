document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      initializeNavbar();
    })
    .catch((error) => console.error("Erro ao carregar a navbar:", error));
});

// Simulação de usuário para testes
let simulatedUser = {
  nome: "Usuario Teste",
  tipo_usuario_idtipo_usuario: 2,
};

function toggleUserType() {
  simulatedUser.tipo_usuario_idtipo_usuario =
    simulatedUser.tipo_usuario_idtipo_usuario === 1 ? 2 : 1;
  initializeNavbar();
}

function initializeNavbar() {
  const subMenu = document.getElementById("subMenu");

  const user = simulatedUser;
  const isLoggedIn = true;
  const isAdmin = user.tipo_usuario_idtipo_usuario === 1;

  // Atualiza o estado do menu de navegação com base no login e tipo de usuário
  const navLinks = document.querySelector("nav ul li");
  if (navLinks) {
    navLinks.innerHTML = `
      <a href="../../pages/home/home.html">Home</a>
      <a href="../../pages/${
        isAdmin ? "servicos_adm/servicos_adm.html" : "servico/servico.html"
      }">Serviços</a>
      ${
        isAdmin
          ? '<a href="../../pages/calendario/calendario_adm.html">Calendário</a>'
          : ""
      }
    `;
  }

  window.toggleMenu = function () {
    subMenu.classList.toggle("open-menu");
  };

  function updateNavbarState() {
    if (isLoggedIn) {
      // Logged in state
      subMenu.innerHTML = `
      <div class="sub-menu">
          <div class="user-info">
            <img src="../../assets/img/navbar/user-black.png" alt="" />
            <h3>${user.nome || "Nome do Usuário"}</h3>
          </div>
          <hr />
          <a href="../../pages/edit/edit.html" class="sub-menu-link">
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
      // Not logged in state
      subMenu.innerHTML = `
      <div class="sub-menu">
          <a href="../../pages/login/login.html" class="sub-menu-link">
            <span class="material-symbols-outlined"> person </span>
            <p>Entrar</p>
          </a>
          <a href="../../pages/cadastro/cadastro.html" class="sub-menu-link">
            <span class="material-symbols-outlined"> person_add </span>
            <p>Cadastre-se</p>
          </a>
      </div>`;
      subMenu.classList.add("not-logged");
    }
  }
  updateNavbarState();
}
