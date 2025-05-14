const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const servico = require("../controllers/servico");
const pedido = require("../controllers/pedidos");
const calendario = require("../controllers/calendario");
const upload = require("../middlewares/upload");
const path = require("path");
const crypto = require("crypto");
const { enviarEmailRecuperacao } = require("../controllers/mailer");
const { gerarToken, autenticarToken } = require("../middlewares/auth");

//🔹Rotas de Usuário
router.post("/login", usuario.Login);
router.post("/cadastrar", usuario.Cadastrar);
router.put("/alterar/:id", usuario.AlterarUsuario);
router.delete("/deletar/:id", usuario.Deletar);
router.get("/", usuario.ListarUsuario);
router.get("/buscar/:id", usuario.BuscarUsuarioPorId);

//🔹Rotas de Serviço
router.post("/criarservico", servico.criarServico);
router.put("/alterarservico/:id", servico.alterarServico);
router.get("/servico", servico.listarServicos);
router.get("/buscarservico/:id", servico.buscarServicoPorId);
router.get("/servico/:id/variacoes", servico.buscarVariacoesPorServico);
router.delete("/deletarservico/:id", servico.deletarServico);

//🔹Rotas de Pedido
router.post("/pedidos", autenticarToken, pedido.criarPedido);
router.get("/orcamento/:idpedido", pedido.gerarOrcamento);

//🔹Rotas do Calendário
router.post("/criarEvento", calendario.criarEvento);
router.get("/listarEventos", calendario.listarEventos);
router.get("/buscarEvento/:id", calendario.buscarEventoPorId);
router.put("/atualizarEvento/:id", calendario.atualizarEvento);
router.delete("/deletarEvento/:id", calendario.deletarEvento);

const FRONTEND_DIR = path.join(__dirname, "..", "..", "frontend");

router.use(express.static(path.join(__dirname, "../../frontend")));

// 🔹Rotas login
router.get("/login", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "login", "login.html"));
});

router.get("/recuperarSenha", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "recuperarSenha", "recuperarSenha.html")
  );
});

router.get("/redefinir-Senha", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "redefinirSenha", "redefinirSenha.html")
  );
});

router.get("/home", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "home", "home.html"));
});

// 🔹Rotas de alterar usuário
router.get("/edit", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "edit", "edit.html"));
});

// 🔹Rotas cadastro
router.get("/cadastrar", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "cadastro", "cadastro.html"));
});

// 🔹Rota calendario
router.get("/calendario", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "calendario", "calendario_adm.html")
  );
});

// 🔹Rota serviços
router.get("/servico_adm", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "servicos_adm", "servicos_adm.html")
  );
});
router.get("/servico_page", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "servico", "servico.html"));
});

//🔹 Rota para Upload de Imagem
router.post("/upload", upload.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhuma imagem enviada" });
  }

  // Caminho da imagem salva no servidor
  const caminho = `/uploads/${req.file.filename}`;

  // Inserindo o caminho no MySQL
  connection.query(
    "INSERT INTO imagens (caminho) VALUES (?)",
    [caminho],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao salvar no banco" });
      }
      res.json({ message: "Upload realizado com sucesso!", caminho });
    }
  );
});

//🔹 Rota para listar imagens
router.get("/imagens", (req, res) => {
  connection.query("SELECT * FROM imagens", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar imagens" });
    }
    res.json(results);
  });
});

//🔹Rotas de Recuperação de Senha
router.post("/recuperar-senha", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email é obrigatório",
      });
    }

    // Verificar se o email existe
    const [results] = await connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email não encontrado",
      });
    }

    const usuario = results[0];
    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    // Salvar token
    await connection.query(
      "UPDATE usuario SET passwordResetToken = ?, passwordResetExpires = ? WHERE idusuario = ?",
      [token, now, usuario.idusuario]
    );

    // Enviar email
    const resultado = await enviarEmailRecuperacao(email, token);

    if (resultado.success) {
      res.json({
        success: true,
        message: "Email de recuperação enviado com sucesso!",
      });
    } else {
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar recuperação de senha",
    });
  }
});

// Rota para processar redefinição de senha
router.post("/redefinir-senha", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Check token validity and expiration
    const [user] = await db.query(
      "SELECT * FROM usuario WHERE passwordResetToken = ? AND passwordResetExpires > ?",
      [token, new Date()]
    );

    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Token inválido ou expirado",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.query(
      "UPDATE usuario SET senha = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE passwordResetToken = ?",
      [hashedPassword, token]
    );

    return res.json({
      success: true,
      message: "Senha atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return res.status(400).json({
      success: false,
      message: "Erro ao redefinir senha",
    });
  }
});

module.exports = router;
