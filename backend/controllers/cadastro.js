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
    const mensagem = document.getElementById("mensagem");

    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      mensagem.textContent = "Por favor, preencha todos os campos.";
      mensagem.style.color = "red";
      return;
    }

    if (senha !== confirmarSenha) {
      mensagem.textContent = "As senhas não coincidem. Por favor, verifique.";
      mensagem.style.color = "red";
      return;
    }

    // Simula o envio dos dados para o backend
    const dados = { nome, email, telefone, senha };
    console.log("Dados enviados:", dados);

    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.style.color = "green";

    // Limpa o formulário
    document.getElementById("cadastroForm").reset();
  });

// Alternar visibilidade da senha
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}


// Formatar telefone no padrão brasileiro
document.getElementById("telefone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
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
