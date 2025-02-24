const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");

// 🔹 Rota de Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  connection.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ mensagem: "Erro ao consultar o servidor" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Usuário não encontrado!" });
      }

      const usuario = results[0];
      const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!SenhaCorreta) {
        return res.status(400).json({ error: "Senha incorreta!" });
      }

      return res.status(200).json({ mensagem: "Login realizado com sucesso!" });
    }
  );
});

// 🔹 Buscar Usuários
router.get("/", (req, res) => {
  connection.query(
    "SELECT idusuario, nome, email, telefone, tipo_usuario_idtipo_usuario FROM usuario",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar usuários" });
      }
      return res.json(results);
    }
  );
});

// 🔹 Cadastrar Usuário (Corrigido)
router.post("/cadastrar", async (req, res) => {
  const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

  if (!nome || !email || !senha || !telefone || tipo_usuario_idtipo_usuario === undefined) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  // Verifica se o tipo de usuário é válido (1 = adm, 2 = usuário comum)
  if (![1, 2].includes(tipo_usuario_idtipo_usuario)) {
    return res.status(400).json({ error: "Tipo de usuário inválido!" });
  }

  // Verifica se já existe um usuário com o mesmo e-mail
  const sqlSelect = "SELECT * FROM usuario WHERE email = ?";
  connection.query(sqlSelect, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao verificar usuário!" });
    }

    if (results.length > 0) {
      return res.status(400).json({ mensagem: "Usuário já cadastrado!" });
    }

    try {
      // Criptografa a senha
      const saltRounds = 10;
      const hashedSenha = await bcrypt.hash(senha, saltRounds);

      // Insere o usuário no banco de dados
      const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo_usuario_idtipo_usuario) VALUES (?, ?, ?, ?, ?)`;
      connection.query(sql, [nome, email, hashedSenha, telefone, tipo_usuario_idtipo_usuario], (err, results) => {
        if (err) {
          console.error("Erro ao inserir usuário:", err);
          return res.status(500).json({ error: "Erro ao criar usuário!" });
        }
        return res.status(201).json({ message: "Usuário criado com sucesso!", id: results.insertId });
      });

    } catch (error) {
      console.error("Erro ao processar o cadastro:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
});

// 🔹 Alterar Usuário
router.put("/alterar/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

  if (!nome || !email || !telefone || tipo_usuario_idtipo_usuario === undefined) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    let SenhaCriptografada = null;
    if (senha) {
      SenhaCriptografada = await bcrypt.hash(senha, 10);
    }

    const sql = `UPDATE usuario SET nome=?, email=?, ${senha ? "senha=?, " : ""} telefone=?, tipo_usuario_idtipo_usuario=? WHERE idusuario=?`;
    const valores = senha
      ? [nome, email, SenhaCriptografada, telefone, tipo_usuario_idtipo_usuario, id]
      : [nome, email, telefone, tipo_usuario_idtipo_usuario, id];

    connection.query(sql, valores, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao alterar o usuário" });
      }
      return res.status(200).json({ mensagem: "Usuário alterado com sucesso!" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar a solicitação" });
  }
});

// 🔹 Deletar Usuário
router.delete("/deletar/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM usuario WHERE idusuario = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar o usuário" });
    }
    return res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

module.exports = router;
