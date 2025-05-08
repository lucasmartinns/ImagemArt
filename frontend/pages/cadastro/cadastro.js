document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document
      .getElementById("confirmarSenha")
      .value.trim();
    const manterConectado = document.getElementById("manterConectado").checked;

    // Validação do nome
    if (nome.length < 3) {
      showCustomAlert("O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    // Validação de email mais rigorosa
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showCustomAlert("Por favor, insira um endereço de email válido.");
      return;
    }

    // Verificar domínios comuns ou específicos (opcional)
    const dominio = email.split("@")[1].toLowerCase();
    const dominiosPermitidos = [
      "gmail.com",
      "hotmail.com",
      "outlook.com",
      "yahoo.com",
    ];
    if (!dominiosPermitidos.includes(dominio)) {
      showCustomAlert("Por favor, use um provedor de email conhecido.");
      return;
    }

    // Validação do telefone - garantir que tenha o formato correto (xx) xxxxx-xxxx
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      showCustomAlert(
        "Por favor, insira um número de telefone válido com DDD."
      );
      return;
    }

    // Validação da senha
    if (senha.length < 6) {
      showCustomAlert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Verificação se as senhas coincidem
    if (senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    // Criar objeto com os dados para enviar ao backend
    const dadosUsuario = {
      nome,
      email,
      telefone,
      senha,
      tipo_usuario_idtipo_usuario: 2,
    };

    try {
      // Enviar os dados para o back-end
      const resposta = await fetch("/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Cadastro realizado com sucesso
        showCustomAlert("Cadastro realizado com sucesso!");

        // Limpar o formulário
        document.getElementById("cadastroForm").reset();

        // Redirecionar para a página de login após o usuário clicar em OK no alerta
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Redireciona após 2 segundos
      } else {
        // Mostrar mensagem de erro retornada pelo servidor
        showCustomAlert(dados.message || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      showCustomAlert(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
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

// Formatar telefone no padrão brasileiro
document.getElementById("telefone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");

  // Limitar a 11 dígitos (com DDD)
  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (value.length > 5) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (value.length > 0) {
    value = value.replace(/^(\d*)/, "($1");
  }
  e.target.value = value;
});
