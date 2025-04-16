const db = require('../config/database');
const bcrypt = require('bcrypt');

const usuario = {

  // 🔹 Login de usuário
  Login: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const [results] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);

      if (results.length === 0) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos' });
      }

      const usuario = results[0];
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos' });
      }

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        usuario: {
          id: usuario.idusuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario_idtipo_usuario: usuario.tipo_usuario_idtipo_usuario
        }
      });

    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao processar o login' });
    }
  },

  // 🔹 Listar todos os usuários
  ListarUsuario: async (req, res) => {
    try {
      const [results] = await db.query("SELECT * FROM usuario");
      return res.json(results);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  },

  // 🔹 Buscar usuário por ID
  BuscarUsuarioPorId: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório!" });
    }

    try {
      const [results] = await db.query("SELECT * FROM usuario WHERE idusuario = ?", [id]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      return res.json(results[0]);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  // 🔹 Cadastrar novo usuário
  Cadastrar: async (req, res) => {
    let { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

    console.log("Corpo recebido no cadastro:", req.body);

    console.log("Tipos:", {
      nome: typeof nome,
      email: typeof email,
      senha: typeof senha,
      telefone: typeof telefone,
      tipo_usuario_idtipo_usuario,
      tipo: typeof tipo_usuario_idtipo_usuario,
    });

    if (!nome || !email || !senha || !telefone || ![1, 2].includes(Number(tipo_usuario_idtipo_usuario))) {
      return res.status(400).json({ error: "Preencha todos os campos corretamente!" });
    }
    

    if (![1, 2].includes(tipo_usuario_idtipo_usuario)) {
      return res.status(400).json({ error: "Tipo de usuário inválido!" });
    }

    try {
      const [existingUser] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

      if (existingUser.length > 0) {
      return res.status(400).json({ mensagem: "Usuário já cadastrado!" });
      }

      const hashedSenha = await bcrypt.hash(senha, 10);

      const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo_usuario_idtipo_usuario) VALUES (?, ?, ?, ?, ?)`;
      const [results] = await db.query(sql, [nome, email, hashedSenha, telefone, tipo_usuario_idtipo_usuario]);

      return res.status(201).json({ message: "Usuário criado com sucesso!", id: results.insertId });

    } catch (error) {
      console.error("Erro ao processar o cadastro:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  

  // 🔹 Alterar usuário
  AlterarUsuario: async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

    if (!nome || !email || !telefone || tipo_usuario_idtipo_usuario === undefined) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }

    try {
      let sql = `UPDATE usuario SET nome = ?, email = ?, telefone = ?, tipo_usuario_idtipo_usuario = ?`;
      const params = [nome, email, telefone, tipo_usuario_idtipo_usuario];

      if (senha) {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        sql += `, senha = ?`;
        params.push(senhaCriptografada);
      }

      sql += ` WHERE idusuario = ?`;
      params.push(id);

      await db.query(sql, params);

      return res.status(200).json({ mensagem: "Usuário alterado com sucesso!" });

    } catch (error) {
      return res.status(500).json({ error: "Erro ao processar a solicitação", error });
    }
  },

  // 🔹 Deletar usuário
  Deletar: async (req, res) => {
    const id = req.params.id;

    try {
      await db.query("DELETE FROM usuario WHERE idusuario = ?", [id]);
      return res.json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar o usuário" });
    }
  },
};

module.exports = usuario;
