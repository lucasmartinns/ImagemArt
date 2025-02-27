const connection = require('../config/database');
const bcrypt = require('bcrypt');
const router = require('../routes/router');

const usuario = {

  // 🔹 Criar Usuário
  criarUsuario: async (nome, email, senha, telefone) => {
    try {
      const SenhaCriptografada = await bcrypt.hash(senha, 10);

      const sql = `INSERT INTO usuario (nome,email,senha,telefone) VALUES (?,?,?,?)`;
      const valores = [nome, email, SenhaCriptografada, telefone];

      // console.log(nome,email,SenhaCriptografada,telefone);

      return new Promise((resolve, reject) => {
        connection.query(sql, valores, (err, result) => {
          if (err) {
            console.error("Erro ao inserir usuário:", err);
            reject(err);
          }
          console.log("Usuário cadastrado!");
          resolve(result);
        });
      });
    } catch (error) {
      console.error("Erro ao criptografar senha:", error);
      throw error;
    }
  },

  // 🔹 Login de usuário
  Login: async (req, res) => {
    const { email, senha } = req.body;

    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ mensagem: "Erro ao consultar o servidor" });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: "Usuário não encontrado!" });
        }

        const usuario = results[0];
        const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!SenhaCorreta) {
          return res.status(400).json({ error: "Senha incorreta!" });
        }

        return res
          .status(200)
          .json({ mensagem: "Login realizado com sucesso!",
            usuario:{
                    id: usuario.idusuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo_usuario: usuario.tipo_usuario_idtipo_usuario // Retorna se é Admin (1) ou Usuário comum (2)
            }
           });
      }
    );
  },

  // 🔹 Buscar Usuários
  ListarUsuario: (req, res) => {
    connection.query(
      "SELECT idusuario, nome, email, telefone, tipo_usuario_idtipo_usuario FROM usuario",
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

    const sql = "SELECT idusuario, nome, email, telefone, tipo_usuario_idtipo_usuario FROM usuario WHERE idusuario = ?";
    
    connection.query(sql, [id], (err, results) => {
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
  
    if (!nome || !email || !senha || !telefone || tipo_usuario_idtipo_usuario === undefined) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    // Se o tipo de usuário não for informado, assume que é um usuário comum (2)
    if(tipo_usuario_idtipo_usuario == undefined){
        tipo_usuario_idtipo_usuario = 2;
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
  },

  // 🔹 Deletar Usuário
  Deletar: (req, res) => {
    const id = req.params.id;
    console.log("ID recebido:", id);
  
    const sql = "DELETE FROM usuario WHERE idusuario = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao deletar o usuário" });
      }
      return res.json({ mensagem: "Usuário deletado com sucesso!" });
    });
  },
};

module.exports = usuario;