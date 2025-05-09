// Script principal quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado, procurando formulário de recuperação");

  const form = document.getElementById("recuperarSenhaForm");

  if (!form) {
    console.error("Formulário não encontrado na página!");
    return;
  }

  console.log("Formulário encontrado, adicionando event listener");

  form.addEventListener("submit", function (e) {
    console.log("Formulário submetido!");
    e.preventDefault();

    const emailInput = document.getElementById("email");
    if (!emailInput) {
      console.error("Campo de email não encontrado!");
      return;
    }

    const email = emailInput.value.trim();
    console.log("Email digitado:", email);

    if (!email) {
      alert("Por favor, digite seu email");
      return;
    }

    // Verificar formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, digite um email válido");
      return;
    }

    // Indicação visual de que a solicitação está em andamento
    const submitButton = document.querySelector(".cadastrarButton");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Enviando...";
    submitButton.disabled = true;

    // Determinar a URL base
    let baseUrl;
    try {
      baseUrl = window.location.origin;
      console.log("Base URL da aplicação:", baseUrl);
    } catch (error) {
      console.error("Erro ao obter URL base:", error);
      baseUrl = "";
    }

    // Fazer a requisição usando XHR em vez de fetch para ter mais detalhes de depuração
    console.log("Preparando requisição XHR para /esqueceuSenha");
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      console.log("XHR readyState mudou para:", xhr.readyState);

      if (xhr.readyState === 4) {
        console.log("XHR completou com status:", xhr.status);

        // Restaurar o botão
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        let data;
        try {
          if (xhr.responseText) {
            console.log("Resposta recebida:", xhr.responseText);
            data = JSON.parse(xhr.responseText);
            console.log("Dados JSON processados:", data);
          } else {
            console.warn("Resposta vazia recebida do servidor");
            data = {};
          }
        } catch (jsonError) {
          console.error("Erro ao processar JSON da resposta:", jsonError);
          console.log("Texto da resposta:", xhr.responseText);
          data = { mensagem: "Erro ao processar resposta do servidor" };
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Requisição bem-sucedida");
          alert(
            data.mensagem ||
              "Email enviado com sucesso! Verifique sua caixa de entrada."
          );
          // Opcional: redirecionar para a página de login após alguns segundos
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          console.error("Erro na requisição. Status:", xhr.status);
          alert(
            data.mensagem ||
              "Erro ao processar solicitação. Por favor, tente novamente."
          );
        }
      }
    };

    // Configurar tratamento de erros de conexão
    xhr.onerror = function (error) {
      console.error("Erro XHR na conexão:", error);
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      alert(
        "Erro ao conectar com o servidor. Verifique sua conexão com a internet."
      );
    };

    xhr.ontimeout = function () {
      console.error("Timeout na requisição XHR");
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      alert(
        "O servidor demorou muito para responder. Por favor, tente novamente."
      );
    };

    try {
      // Tentar três endpoints diferentes para maior compatibilidade
      const endpoint = "/esqueceuSenha";
      console.log("Abrindo conexão XHR para:", endpoint);
      xhr.open("POST", endpoint, true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.withCredentials = true; // Equivalente a credentials: 'include'
      xhr.timeout = 30000; // 30 segundos de timeout

      const payload = JSON.stringify({ email });
      console.log("Enviando payload:", payload);

      // Enviar a requisição
      xhr.send(payload);
      console.log("Requisição XHR enviada");
    } catch (xhrError) {
      console.error("Erro ao configurar ou enviar XHR:", xhrError);
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      alert(
        "Erro ao preparar requisição. Por favor, tente novamente."
      );
    }
  });
});

// Verificação se o alerta está disponível
console.log(
  "Verificando componente de alerta:",
  document.getElementById("customAlert") ? "Disponível" : "Não disponível"
);
