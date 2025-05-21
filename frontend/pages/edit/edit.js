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

// Função para preencher os campos do formulário com os dados do usuário
function preencheFormulario(usuario) {
  // Preenche o campo de email (não editável)
  document.getElementById("email").value = usuario.email;
  document.getElementById("nome-edit").value = usuario.nome;
  console.log(usuario.email);

  // Define o nome como texto não editável (apenas visual)
  document.getElementById("nome").textContent = usuario.nome;
}

// Função para carregar os dados do usuário a partir do localStorage
function carregarDadosUsuario() {
  // Obtendo os dados do usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    showCustomAlert("Informações do usuário não encontradas.");
    return;
  }

  // Preenche o formulário com os dados do usuário
  preencheFormulario(usuario);
}

// Função para salvar as alterações feitas no perfil
async function salvarAlteracoes(event) {
  event.preventDefault();

  // Obtém o nome do elemento (agora apenas visual, não um campo de entrada)
  const nome = document.getElementById("nome").textContent;
  const nomeEdit = document.getElementById("nome-edit").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  // Obtendo o ID do usuário a partir do token
  const usuarioId = getUserIdFromToken();
  if (!usuarioId) {
    showCustomAlert("Não foi possível identificar o usuário.");
    return;
  }

  // Obtendo os dados do usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    showCustomAlert("Informações do usuário não encontradas.");
    return;
  }

  // Verifica se uma nova senha foi informada
  if (senha) {
    // Verifica se a senha tem pelo menos 6 caracteres
    if (senha.length < 6) {
      showCustomAlert("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Verifica se a nova senha é igual à senha antiga
    if (usuario.senha === senha) {
      showCustomAlert("A nova senha não pode ser igual à senha atual.");
      return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      showCustomAlert("As senhas não coincidem.");
      return;
    }
  }

  // Confirma com o usuário antes de salvar as alterações
  const confirmacao = await showCustomConfirm(
    "Deseja realmente salvar as alterações no perfil?"
  );

  // Se o usuário não confirmar, interrompe o processo
  if (!confirmacao) {
    return;
  }

  const dados = {
    nome: nomeEdit || nome, // Se não houver novo nome, mantém o atual
    senha: senha || undefined, // Se não houver senha, envia undefined
  };

  // Mostrar os dados que estão sendo enviados para depuração
  console.log("Dados enviados:", dados);

  fetch(`/alterar/${usuarioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Usando o token de autenticação
    },
    body: JSON.stringify(dados),
  })
    .then((response) => {
      // Verificar se a resposta está ok antes de converter para JSON
      if (!response.ok) {
        console.error(
          "Erro na resposta:",
          response.status,
          response.statusText
        );
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      showCustomAlert("Alterações salvas com sucesso! Faça login novamente.");
      setTimeout(() => {
        logout(); // Remove token e usuário do localStorage e redireciona para /login
      }, 1500);
    })
    .catch((err) => {
      console.error("Erro completo:", err);
      showCustomAlert("Erro na comunicação com o servidor: " + err.message);
    });
}

// Função para obter o ID do usuário a partir do token
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

// Função para realizar logout
function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "/login";
}

// Chama a função para carregar os dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDadosUsuario);

// Adiciona o evento de salvar alterações no formulário
const form = document.getElementById("editProfileForm");
form.addEventListener("submit", salvarAlteracoes);
