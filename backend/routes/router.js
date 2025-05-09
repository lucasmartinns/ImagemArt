const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const servico = require("../controllers/servico");
const pedido = require("../controllers/pedidos");
const calendario = require("../controllers/calendario");
const upload = require("../middlewares/upload");
const path = require("path");
const mailer = require("../middlewares/mailer");
const crypto = require("crypto");
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
    path.join(FRONTEND_DIR, "pages", "servicos_adm", "servico_adm.html")
  );
});
router.get("/servico", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "pages", "servicos", "servico.html"));
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

// 🔹Rotas para recuperação de senha
router.get("/esqueceu-senha", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "recuperarSenha", "recuperarSenha.html")
  );
});

router.get("/resetar-senha", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_DIR, "pages", "recuperarSenha", "redefinirSenha.html")
  );
});

// 🔹 Rota para solicitar recuperação de senha
router.post("/esqueceuSenha", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: "Email é obrigatório" });
  }

  try {
    // Buscar usuário no banco de dados usando connection
    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          // Por segurança, não informamos ao usuário que o email não existe
          return res.status(200).json({
            mensagem:
              "Se o seu email estiver cadastrado, você receberá instruções para redefinir sua senha",
          });
        }

        const usuario = results[0];

        // Gerar token e definir expiração (1 hora)
        const tokenRecuperacao = crypto.randomBytes(20).toString("hex");
        const expiraEm = new Date();
        expiraEm.setHours(expiraEm.getHours() + 1);

        // Salvar token no banco de dados
        connection.query(
          "UPDATE usuario SET passwordResetToken = ?, passwordResetExpires = ? WHERE idusuario = ?",
          [tokenRecuperacao, expiraEm, usuario.idusuario],
          (err, updateResult) => {
            if (err) {
              console.error("Erro ao atualizar token:", err);
              return res
                .status(500)
                .json({ mensagem: "Erro interno do servidor" });
            }

            // Enviar email com link para recuperação
            mailer.sendMail(
              {
                to: email,
                from: "noreply@imagemart.com",
                subject: "Recuperação de Senha - ImageMart",
                template: "recuperar_senha",
                context: {
                  token: tokenRecuperacao,
                  email: email,
                },
              },
              (err) => {
                if (err) {
                  console.error("Erro ao enviar email:", err);
                  return res.status(500).json({
                    mensagem: "Não foi possível enviar email de recuperação",
                  });
                }
                return res.status(200).json({
                  mensagem:
                    "Email enviado com sucesso! Verifique sua caixa de entrada.",
                });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.error("Erro não tratado:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

// 🔹 Rota para redefinir a senha com o token
router.post("/resetarSenha", async (req, res) => {
  const { email, token, novaSenha } = req.body;

  if (!email || !token || !novaSenha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  try {
    // Verifica se token é válido e não expirou
    const dataAtual = new Date();

    connection.query(
      "SELECT * FROM usuario WHERE email = ? AND passwordResetToken = ? AND passwordResetExpires > ?",
      [email, token, dataAtual],
      async (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res
            .status(400)
            .json({
              mensagem:
                "Token inválido ou expirado. Solicite um novo link de recuperação.",
            });
        }

        const usuario = results[0];

        // Validar força da senha
        if (novaSenha.length < 8) {
          return res
            .status(400)
            .json({ mensagem: "A senha deve ter pelo menos 8 caracteres" });
        }

        // Criptografar a nova senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

        // Atualizar a senha e remover os tokens
        connection.query(
          "UPDATE usuario SET senha = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE idusuario = ?",
          [senhaCriptografada, usuario.idusuario],
          (err, updateResult) => {
            if (err) {
              console.error("Erro ao atualizar senha:", err);
              return res
                .status(500)
                .json({ mensagem: "Erro interno do servidor" });
            }

            return res
              .status(200)
              .json({
                mensagem:
                  "Senha alterada com sucesso! Redirecionando para a página de login...",
              });
          }
        );
      }
    );
  } catch (err) {
    console.error("Erro não tratado:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

module.exports = router;
