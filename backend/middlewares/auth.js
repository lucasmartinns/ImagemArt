require("dotenv").config(); // Certifique-se de que o dotenv está carregando as variáveis de ambiente corretamente
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verificando se a chave JWT_SECRET está corretamente carregada
if (!JWT_SECRET) {
  console.error(
    "Erro: A variável JWT_SECRET não foi carregada corretamente do arquivo .env"
  );
  process.exit(1); // Sai do processo se a chave não for encontrada
}

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (authHeader == null) {
    return res.status(401).send({ Mensagem: "Usuario não Logado" });
  }
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer <token>"

  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err)
      return res.status(403).json({ mensagem: "Token inválido ou expirado" });
    req.usuario = usuario;
    next();
  });
}

// Função auxiliar para gerar token
function gerarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

const autenticarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ mensagem: "Usuário não autenticado" });
  }
  if (req.usuario.tipo !== 1) {
    return res
      .status(403)
      .json({ mensagem: "Acesso permitido apenas para administradores" });
  }
  next();
};

// ...existing code...

function autenticarUsuario(req, res, next) {
  const usuarioId = parseInt(req.params.id, 10);
  if (req.usuario && req.usuario.id === usuarioId) {
    return next();
  }
  return res
    .status(403)
    .json({ mensagem: "Acesso permitido apenas ao próprio usuário" });
}

module.exports = {
  autenticarToken,
  gerarToken,
  autenticarAdmin,
  autenticarUsuario,
};
