document
  .getElementById("redefinirSenhaForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!token) {
      showCustomAlert("Token inválido");
      return;
    }

    if (senha.length < 6) {
      showCustomAlert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch("/redefinir-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: senha,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showCustomAlert("Senha alterada com sucesso!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        throw new Error(data.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      showCustomAlert(error.message || "Erro ao redefinir senha");
    }
  });

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
