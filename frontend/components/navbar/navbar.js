document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      initializeNavbar();
    })
    .catch((error) => console.error("Erro ao carregar a navbar:", error));
});

function getUserTypeFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.tipo;
  } catch {
    return null;
  }
}

function initializeNavbar() {
  const user = JSON.parse(localStorage.getItem("usuario"));
  const subMenu = document.getElementById("subMenu");
  const tipo = getUserTypeFromToken();
  const isLoggedIn = !!tipo;
  const isAdmin = tipo === 1;

  // Atualiza os links da navbar com base no tipo de usuário
  const navLinks = document.querySelector("nav ul li");
  if (navLinks) {
    navLinks.innerHTML = `
      <a href="/home">Home</a>
      <a href="${isAdmin ? "/servico_adm" : "/servico_page"}">Serviços</a>
      ${isAdmin ? '<a href="/calendario">Calendário</a>' : ""}
    `;
  }

  window.toggleMenu = function () {
    subMenu.classList.toggle("open-menu");
  };

  function updateNavbarState() {
    if (isLoggedIn) {
      // Usuário logado
      subMenu.innerHTML = `
      <div class="sub-menu">
          <div class="user-info">
            <img src="../../assets/img/navbar/user-black.png" alt="" />
            <h3>${user.nome || "Nome do Usuário"}</h3>
          </div>
          <hr />
          <a href="/edit" class="sub-menu-link">
            <span class="material-symbols-outlined"> manage_accounts </span>
            <p>Editar Perfil</p>
          </a>
          <a href="#" class="sub-menu-link" onclick="logout()">
            <span class="material-symbols-outlined"> logout </span>
            <p>Sair</p>
          </a>
      </div>`;
      subMenu.classList.remove("not-logged");
    } else {
      // Usuário não logado
      subMenu.innerHTML = `
      <div class="sub-menu">
          <a href="/login" class="sub-menu-link">
            <span class="material-symbols-outlined"> person </span>
            <p>Entrar</p>
          </a>
          <a href="/cadastrar" class="sub-menu-link">
            <span class="material-symbols-outlined"> person_add </span>
            <p>Cadastre-se</p>
          </a>
      </div>`;
      subMenu.classList.add("not-logged");
    }
  }

  updateNavbarState();
}

// Função para logout
function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "/login";
}
