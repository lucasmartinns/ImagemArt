const connection = require('../config/database');

const servico = {
    // 🔹 Criar um novo serviço
    criarServico: (req, res) => {
        const { nome, descricao, valor } = req.body;

        if (!nome || !valor) {
            return res.status(400).json({ error: "Nome e valor são obrigatórios!" });
        }

        const sql = "INSERT INTO servico (nome, descricao, valor) VALUES (?, ?, ?)";
        connection.query(sql, [nome, descricao, valor], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao inserir serviço",err });
            }
            return res.status(201).json({ mensagem: "Serviço cadastrado com sucesso!", id: result.insertId });
        });
    },

    // 🔹 Listar todos os serviços
    listarServicos: (req, res) => {
        connection.query("SELECT * FROM servico", (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar serviços" });
            }
            return res.json(results);
        });
    },

    // 🔹 Buscar serviço por ID
    buscarServicoPorId: (req, res) => {
        const id = req.params.id;
        const sql = "SELECT * FROM servico WHERE idservico = ?";
        
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar serviço" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Serviço não encontrado!" });
            }
            return res.json(results[0]);
        });
    },

    // 🔹 Alterar um serviço
    alterarServico: (req, res) => {
        const id = req.params.id;
        const { nome, descricao, valor } = req.body;

        if (!nome || !valor) {
            return res.status(400).json({ error: "Nome e valor são obrigatórios!" });
        }

        const sql = "UPDATE servico SET nome=?, descricao=?, valor=? WHERE idservico=?";
        connection.query(sql, [nome, descricao, valor, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao atualizar serviço" });
            }
            return res.json({ mensagem: "Serviço atualizado com sucesso!" });
        });
    },

    // 🔹 Deletar um serviço
    deletarServico: (req, res) => {
        const id = req.params.id;
        const sql = "DELETE FROM servico WHERE idservico=?";
        
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao deletar serviço" });
            }
            return res.json({ mensagem: "Serviço deletado com sucesso!" });
        });
    }
};

module.exports = servico;
