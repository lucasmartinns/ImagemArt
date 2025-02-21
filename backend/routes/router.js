const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");


router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  connection.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        res.status(400).json({ mensagem: "Erro ao consultar ao servidor" });
      }

      if (results.length === 0) {
        res.status(400).json({ error: "Usuário não encontrado!" });
      }

      const usuario = results[0];
      const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!SenhaCorreta) {
        res.status(400).json({ error: "Senha incorreta!" });
      }
    }
  );
});

// Busca os usários
router.get("/", (req, res) => {
  connection.query(
    "SELECT idusuario,nome,email,telefone,tipo_usuario FROM usuario",
    (err, results) => {
      if (err) {
        res.status(400).json({ error: "Erro ao encontrar o usário" });
      }
      res.json(results);
    }
  );
});

//cria rota para criar usuario no banco de dados
router.post("/cadastrar", async (req, res) => {
    const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } =
    req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

   

  try {

    // Verifica se já existe um usuário com o mesmo nome ou e-mail
    const sqlSelect = `SELECT * FROM usuario WHERE email = ?`;
    connection.query(sqlSelect, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao verificar usuário!" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Usuário já cadastrado!" });
      }
    });
          
    // Verifica se o tipo de usuário é válido (1 = adm, 2 = usuario comum)
    if (![1, 2].includes(tipo_usuario_idtipo_usuario)) {
      return res.status(400).json({ error: "Tipo de usuário inválido!" });
    }

    // Criptografando a senha
    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);

    // Inserindo no banco
    const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo_usuario_idtipo_usuario) VALUES (?, ?, ?, ?, ?)`;
    connection.query(
      sql,
      [nome, email, hashedSenha, telefone, tipo_usuario_idtipo_usuario],
      (err, results) => {
        if (err) {
          console.error("Erro ao inserir usuário:", err);
          return res.status(500).json({ error: "Erro ao criar usuário!" });
        }
        res
          .status(201)
          .json({
            message: "Usuário criado com sucesso!",
            id: results.insertId,
          });
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//criar uma rota para alterar usuario no banco de dados
router.put("/alterar/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, email, senha, telefone, tipo_usuario } = req.body;

  if (!nome || !email || !senha || !telefone || !tipo_usuario) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    let SenhaCriptografada = null;
    if (senha) {
      SenhaCriptografada = await bcrypt.hash(senha, 10);
    }
    const sql = `UPDATE usuario SET nome=?, email=?, ${
      senha ? "senha=?, " : ""
    } telefone=?, tipo_usuario_idtipo_usuario=? WHERE idusuario=?`;
    const valores = senha
      ? [nome, email, SenhaCriptografada, telefone, tipo_usuario, id]
      : [nome, email, telefone, tipo_usuario, id];

    connection.query(sql, valores, (err, results) => {
      if (err) {
        res.status(400).json({ error: "Erro ao alterar o usuário" });
      }
      res.status(200).json({ mensagem: "Usuário alterado com sucesso!" });
    });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criptografar a senha" });
  }
});

//criar uma rota para deletar usuario no banco de dados
router.delete("/deletar/:id", (req, res) => {
    const id = req.params.id;

    console.log(id);
    
    const sql = `DELETE FROM usuario WHERE idusuario = ?`;
    connection.query(sql, [id], (err, results) => {
        if (err) {
        res.status(400).json({ error: "Erro ao deletar o usuário" });
        }
        res.json({ mensagem: "Usuário deletado com sucesso!" });
    });
});

module.exports = router;
