const connection = require('../config/database');

const servico = {
    // 🔹 Criar um novo serviço (com ou sem variações)
    criarServico: async (req, res) => {
        const { nome, descricao, valor, variacoes } = req.body;

        if (!nome || !valor) {
            return res.status(400).json({ error: "Nome e valor são obrigatórios!" });
        }

        try {
            const [result] = await connection.query(
                "INSERT INTO servico (nome, descricao, valor) VALUES (?, ?, ?)",
                [nome, descricao, valor]
            );

            const servicoId = result.insertId;

            // Inserir variações se existirem
            if (Array.isArray(variacoes)) {
                for (const v of variacoes) {
                    await connection.query(
                        "INSERT INTO servico_variacao (servico_id, descricao, preco) VALUES (?, ?, ?)",
                        [servicoId, v.descricao, v.preco]
                    );
                }
            }

            res.status(201).json({ mensagem: "Serviço cadastrado com sucesso!", id: servicoId });
        } catch (err) {
            res.status(500).json({ error: "Erro ao inserir serviço", err });
        }
    },

    // 🔹 Adicionar variações a um serviço existente
    adicionarVariacoes: async (req, res) => {
        const servicoId = req.params.id;
        const { variacoes } = req.body;

        if (!Array.isArray(variacoes) || variacoes.length === 0) {
            return res.status(400).json({ error: "Informe uma lista de variações válidas!" });
        }

        try {
            for (const v of variacoes) {
                await connection.query(
                    "INSERT INTO servico_variacao (servico_id, descricao, preco) VALUES (?, ?, ?)",
                    [servicoId, v.descricao, v.preco]
                );
            }

            res.status(201).json({ mensagem: "Variações adicionadas com sucesso!" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao adicionar variações", err });
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
    },

    // 🔹 Buscar variações de um serviço
    buscarVariacoesPorServico: async (req, res) => {
        const servicoId = req.params.id;

        try {
            const [results] = await connection.query(
                "SELECT * FROM servico_variacao WHERE servico_id = ?",
                [servicoId]
            );

            if (results.length === 0) {
                return res.status(404).json({ mensagem: "Nenhuma variação encontrada para este serviço." });
            }

            res.json(results);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar variações", err });
        }
    }
};

module.exports = servico;
