document
  .getElementById("editProfileForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document
      .getElementById("confirmarSenha")
      .value.trim();

    if (senha && senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    const dados = { nome, email, telefone, senha };
    console.log("Dados enviados:", dados);

    showCustomAlert("Perfil atualizado com sucesso!");
  });

// Alternar visibilidade da senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const img = button.querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    img.src = "../../assets/img/password/eye.svg";
    img.alt = "Ocultar senha";
  } else {
    input.type = "password";
    img.src = "../../assets/img/password/eye-off.svg";
    img.alt = "Mostrar senha";
  }
}