// Carregar dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  fetchUserData();
});

// Submeter o formulário de edição de perfil
document.getElementById("editProfileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (senha && senha !== confirmarSenha) {
    showCustomAlert("As senhas não coincidem. Por favor, verifique.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id = usuario?.id;

  const dados = {
    nome,
    email,
    telefone,
    tipo_usuario_idtipo_usuario: usuario?.tipo_usuario_idtipo_usuario, // mantendo o tipo
  };

  if (senha) {
    dados.senha = senha; // só envia a senha se for preenchida
  }

  fetch(`/alterar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao atualizar o perfil.");
      return res.json();
    })
    .then((data) => {
      showCustomAlert("Perfil atualizado com sucesso!");
      // Atualiza o localStorage com o nome novo, se foi alterado
      usuario.nome = nome;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    })
    .catch((err) => {
      console.error("Erro ao atualizar perfil:", err);
      showCustomAlert("Erro ao atualizar perfil.");
    });
});

// Alternar visibilidade da senha
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const img = button.querySelector("img");

  if (input.type === "password") {
    input.type = "text";
    img.src = "../../assets/img/password/eye.svg";
  } else {
    input.type = "password";
    img.src = "../../assets/img/password/eye-off.svg";
  }
}

// Buscar dados do usuário do backend
function fetchUserData() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userId = usuario?.id;

  if (!userId) {
    showCustomAlert("Usuário não encontrado.");
    return;
  }

  fetch(`/buscar/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("nome").value = data.nome || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("telefone").value = data.telefone || "";
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
      showCustomAlert("Erro ao carregar dados do usuário.");
    });
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
