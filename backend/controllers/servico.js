const connection = require('../config/database');

const servico = {
    // 🔹 Criar um novo serviço
    criarServico: async (req, res) => {
        const { nome, descricao, valor } = req.body;

        if (!nome || !valor) {
            return res.status(400).json({ error: "Nome e valor são obrigatórios!" });
        }

        try {
            const [result] = await connection.query(
                "INSERT INTO servico (nome, descricao, valor) VALUES (?, ?, ?)",
                [nome, descricao, valor]
            );
            res.status(201).json({ mensagem: "Serviço cadastrado com sucesso!", id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: "Erro ao inserir serviço", err });
        }
    },

    // 🔹 Listar todos os serviços
    listarServicos: async (req, res) => {
        try {
            const [results] = await connection.query("SELECT * FROM servico");
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar serviços", err });
        }
    },

    // 🔹 Buscar serviço por ID
    buscarServicoPorId: async (req, res) => {
        const id = req.params.id;

        try {
            const [results] = await connection.query("SELECT * FROM servico WHERE idservico = ?", [id]);
            if (results.length === 0) {
                return res.status(404).json({ error: "Serviço não encontrado!" });
            }
            res.json(results[0]);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar serviço", err });
        }
    },

    // 🔹 Alterar um serviço
    alterarServico: async (req, res) => {
        const id = req.params.id;
        const { nome, descricao, valor } = req.body;

        if (!nome || !valor) {
            return res.status(400).json({ error: "Nome e valor são obrigatórios!" });
        }

        try {
            await connection.query(
                "UPDATE servico SET nome=?, descricao=?, valor=? WHERE idservico=?",
                [nome, descricao, valor, id]
            );
            res.json({ mensagem: "Serviço atualizado com sucesso!" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar serviço", err });
        }
    },

    // 🔹 Deletar um serviço
    deletarServico: async (req, res) => {
        const id = req.params.id;

        try {
            await connection.query("DELETE FROM servico WHERE idservico=?", [id]);
            res.json({ mensagem: "Serviço deletado com sucesso!" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao deletar serviço", err });
        }
    }
};

module.exports = servico;
