document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar o token JWT e os dados do usuário
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Redirecionar todos para /home
        window.location.href = "/home";
      } else {
        throw new Error(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      showCustomAlert(`${error.message}`);
    }
  });

// Alternar visibilidade da senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const img = button.querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    img.src = "/assets/img/password/eye.svg";
    img.alt = "Ocultar senha";
  } else {
    input.type = "password";
    img.src = "/assets/img/password/eye-off.svg";
    img.alt = "Mostrar senha";
  }
}

// Verifica se o usuário já está logado ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  if (token && usuario.id) {
    // Já está logado, manda direto para /home
    window.location.href = "/home";
  }
});
