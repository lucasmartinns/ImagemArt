require('dotenv').config(); // Certifique-se de que o dotenv está carregando as variáveis de ambiente corretamente
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Verificando se a chave JWT_SECRET está corretamente carregada
if (!JWT_SECRET) {
    console.error("Erro: A variável JWT_SECRET não foi carregada corretamente do arquivo .env");
    process.exit(1); // Sai do processo se a chave não for encontrada
}

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (authHeader == null) {
        return res.status(401).send({ "Mensagem": "Usuario não Logado" });
    }
    const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer <token>"

    if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ mensagem: "Token inválido ou expirado" });
        req.usuario = usuario; // Agora você pode acessar os dados do usuário nas rotas protegidas
        next();
    });
}

// Função auxiliar para gerar token
function gerarToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = { autenticarToken, gerarToken };
