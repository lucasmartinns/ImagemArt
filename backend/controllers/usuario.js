const db = require('../config/database');
const bcrypt = require('bcrypt');

const usuario = {

  // 🔹 Login de usuári
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

      // Login bem-sucedido
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




  // 🔹 Buscar Usuários
  ListarUsuario: (req, res) => {
    db.query(
      "SELECT * FROM `usuario`",
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        return res.json(results);
      }
    );
  },

  // 🔹 Buscar Usuários por id
  BuscarUsuarioPorId: (req, res) => {
    const id = req.params.id;

    // Verifica se o ID foi passado corretamente
    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório!" });
    }

    const sql = "SELECT * FROM usuario WHERE idusuario = ?";

    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      return res.json(results[0]); // Retorna o usuário encontrado
    });
  },

  // 🔹 Cadastrar Usuário
  Cadastrar: async (req, res) => {
    const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

    try {

      if (!nome || !email || !senha || !telefone || tipo_usuario_idtipo_usuario === undefined) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
      }

      // Se o tipo de usuário não for informado, assume que é um usuário comum (2)
      if (tipo_usuario_idtipo_usuario == undefined) {
        tipo_usuario_idtipo_usuario = 2;
      }

      // Verifica se o tipo de usuário é válido (1 = adm, 2 = usuário comum)
      if (![1, 2].includes(tipo_usuario_idtipo_usuario)) {
        return res.status(400).json({ error: "Tipo de usuário inválido!" });
      }

      // Verifica se já existe um usuário com o mesmo e-mail
      const sqlSelect = "SELECT * FROM usuario WHERE email = ?";
      db.query(sqlSelect, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao verificar usuário!", err });
        }

        if (results.length > 0) {
          return res.status(400).json({ mensagem: "Usuário já cadastrado!" });
        }
        // Criptografa a senha
        const saltRounds = 10;
        const hashedSenha = await bcrypt.hash(senha, saltRounds);

        // Insere o usuário no banco de dados
        const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo_usuario_idtipo_usuario) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [nome, email, hashedSenha, telefone, tipo_usuario_idtipo_usuario], (err, results) => {
          if (err) {
            console.error("Erro ao inserir usuário:", err);
            return res.status(500).json({ error: "Erro ao criar usuário!" });
          }
          return res.status(201).json({ message: "Usuário criado com sucesso!", id: results.insertId });
        })
      });

    } catch (error) {
      console.error("Erro ao processar o cadastro:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

  },


  // 🔹 Alterar Usuário
  AlterarUsuario: async (req, res) => {
    const id = req.params.id;
    console.log("ID recebido:", id);
    const { nome, email, senha, telefone, tipo_usuario_idtipo_usuario } = req.body;

    if (!nome || !email || !telefone || tipo_usuario_idtipo_usuario === undefined) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }

    try {
      let SenhaCriptografada = await bcrypt.hash(senha, 10);

      const sql = `UPDATE usuario SET nome=?, email=?, ${senha ? "senha=?, " : ""} telefone=?, tipo_usuario_idtipo_usuario=? WHERE idusuario=?`;

      db.query(sql, [nome, email, SenhaCriptografada, telefone, tipo_usuario_idtipo_usuario, id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao alterar o usuário", err });
        }
        return res.status(200).json({ mensagem: "Usuário alterado com sucesso!" });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao processar a solicitação", error });
    }
  },

  // 🔹 Deletar Usuário
  Deletar: (req, res) => {
    const id = req.params.id;
    console.log("ID recebido:", id);

    const sql = "DELETE FROM usuario WHERE idusuario = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao deletar o usuário" });
      }
      return res.json({ mensagem: "Usuário deletado com sucesso!" });
    });
  },
};

module.exports = usuario;