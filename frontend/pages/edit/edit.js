// Função para esconder ou mostrar a senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector('img');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.src = "../../assets/img/password/eye-on.svg"; // Ícone para "mostrar"
  } else {
    input.type = 'password';
    icon.src = "../../assets/img/password/eye-off.svg"; // Ícone para "esconder"
  }
}

// Função para preencher os campos do formulário com os dados do usuário
function preencheFormulario(usuario) {
  // Preenche o campo de email (não editável)
  document.getElementById("email").value = usuario.email;
  console.log(usuario.email)
  // Preenche o campo de nome
  document.getElementById("nome").value = usuario.nome;

}

// Função para carregar os dados do usuário a partir do localStorage
function carregarDadosUsuario() {
  // Obtendo os dados do usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  if (!usuario) {
    exibirAlerta("Informações do usuário não encontradas.");
    return;
  }

  // Preenche o formulário com os dados do usuário
  preencheFormulario(usuario);
}

// Função para salvar as alterações feitas no perfil
function salvarAlteracoes(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  // Verifica se as senhas coincidem
  if (senha && senha !== confirmarSenha) {
    exibirAlerta("As senhas não coincidem.");
    return;
  }

  // Obtendo os dados do usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  if (!usuario) {
    exibirAlerta("Informações do usuário não encontradas.");
    return;
  }

  const usuarioId = usuario.id; // ID do usuário armazenado no localStorage

  const dados = {
    nome,
    senha: senha || undefined // Se não houver senha, envia undefined
  };

  fetch(`/alterar/${usuarioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token") // Usando o token de autenticação
    },
    body: JSON.stringify(dados)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Atualiza os dados no localStorage
      usuario.nome = nome;
      if (senha) usuario.senha = senha;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      console.log(usuario)
      exibirAlerta("Perfil atualizado com sucesso!");
    } else {
      exibirAlerta("Erro ao atualizar perfil.");
    }
  })
  .catch(err => {
    console.error(err);
    exibirAlerta("Erro na comunicação com o servidor.");
  });
}

// Função para exibir um alerta
function exibirAlerta(mensagem) {
  const alertMessage = document.getElementById("customAlertMessage");
  alertMessage.innerText = mensagem;

  const alertContainer = document.getElementById("customAlert");
  alertContainer.style.display = "block";

  const alertButton = document.getElementById("customAlertButton");
  alertButton.addEventListener("click", () => {
    alertContainer.style.display = "none";
  });
}

// Chama a função para carregar os dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDadosUsuario);

// Adiciona o evento de salvar alterações no formulário
const form = document.getElementById("editProfileForm");
form.addEventListener("submit", salvarAlteracoes);
