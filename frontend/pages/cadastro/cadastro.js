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
      tipo_usuario_idtipo_usuario: 2
    };

    try {
      // Enviar os dados para o back-end
      const resposta = await fetch('/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Cadastro realizado com sucesso
        showCustomAlert("Cadastro realizado com sucesso!");
        
        // Limpar o formulário
        document.getElementById("cadastroForm").reset();
        
        // Redirecionar para a página de login após o usuário clicar em OK no alerta
        // Você pode adicionar isso no seu código de alerta customizado
        // Exemplo: após o usuário clicar em OK no alerta
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Redireciona após 2 segundos
      } else {
        // Mostrar mensagem de erro retornada pelo servidor
        showCustomAlert(dados.message || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      showCustomAlert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
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