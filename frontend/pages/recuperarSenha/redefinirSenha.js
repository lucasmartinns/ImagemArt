// Obter parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
const token = urlParams.get("token");

// Função para esconder ou mostrar a senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "../../assets/img/password/eye.svg"; // Ícone para "mostrar"
  } else {
    input.type = "password";
    icon.src = "../../assets/img/password/eye-off.svg"; // Ícone para "esconder"
  }
}

// Verificar se os parâmetros existem
if (!email || !token) {
  showCustomAlert(
    "Link inválido. Por favor, solicite um novo link de recuperação."
  );
  setTimeout(() => {
    window.location.href = "/esqueceu-senha";
  }, 3000);
}

// Validação de senha
function validatePassword(password) {
  // Verifica se a senha tem pelo menos 8 caracteres
  if (password.length < 8) {
    return {
      valid: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    };
  }

  // Verifica se a senha contém pelo menos um número
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "A senha deve conter pelo menos um número",
    };
  }

  // Verifica se a senha contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula",
    };
  }

  return { valid: true };
}

// Processar formulário
document
  .getElementById("recuperarSenhaForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validações
    if (senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem");
      return;
    }

    const validationResult = validatePassword(senha);
    if (!validationResult.valid) {
      showCustomAlert(validationResult.message);
      return;
    }

    // Enviar solicitação para redefinir senha
    try {
      const response = await fetch("/resetarSenha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          token: token,
          novaSenha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showCustomAlert(data.mensagem);
        // Redirecionar para a página de login após 3 segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        showCustomAlert(data.mensagem || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro:", error);
      showCustomAlert("Erro ao conectar com o servidor");
    }
  });
