document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('resultados').innerHTML = `<p>${data.mensagem}</p>`;

      // Armazenar o token JWT recebido
      localStorage.setItem('token', data.token);
      
      // Armazenar dados do usuário
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redireciona conforme o tipo de usuário
      const tipo = data.usuario.tipo_usuario_idtipo_usuario;

      if (tipo === 1) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }

    } else {
      throw new Error(data.error || 'Erro ao fazer login');
    }

  } catch (error) {
    document.getElementById('resultados').innerHTML = `<p>Erro: ${error.message}</p>`;
  }
});

// Função de alternar visibilidade da senha
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

// Verificar se o usuário já está autenticado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  if (token && usuario.id) {
    // Se já estiver logado, redirecionar para a página apropriada
    const tipo = usuario.tipo_usuario_idtipo_usuario;
    if (tipo === 1) {
      window.location.href = '/admin';
    } else {
      window.location.href = '/home';
    }
  }
});