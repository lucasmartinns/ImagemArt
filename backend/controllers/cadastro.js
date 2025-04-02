document
  .getElementById("cadastroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document
      .getElementById("confirmarSenha")
      .value.trim();

    if (senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    // Simula o envio dos dados para o backend
    const dados = { nome, email, telefone, senha };
    console.log("Dados enviados:", dados);

    showCustomAlert("Cadastro realizado com sucesso!");

    // Limpa o formulário
    document.getElementById("cadastroForm").reset();
  });

// Alerta customizado
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

// Alternar visibilidade da senha
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

// Formatar telefone no padrão brasileiro
document.getElementById("telefone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (value.length > 5) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    value = value.replace(/^(\d*)/, "($1");
  }
  e.target.value = value;
});
