document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    showCustomAlert("Por favor, preencha todos os campos.");
    return;
  }

  // Simula o envio dos dados para o backend
  const dados = { email, senha };
  console.log("Dados enviados:", dados);
});

// Reutiliza a função de alerta customizado
function showCustomAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("customAlertMessage");
  const alertButton = document.getElementById("customAlertButton");

  alertMessage.textContent = message;
  alertBox.classList.add("show");

  alertButton.onclick = function () {
    alertBox.classList.remove("show");
  };
}

// Função de alternar visibilidade da senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const img = button.querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    img.src = "../assets/img/password/eye-password-see-view-svgrepo-com.svg";
    img.alt = "Ocultar senha";
  } else {
    input.type = "password";
    img.src =
      "../assets/img/password/eye-key-look-password-security-see-svgrepo-com.svg";
    img.alt = "Mostrar senha";
  }
}
