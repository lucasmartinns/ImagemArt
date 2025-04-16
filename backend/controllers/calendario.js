const connection = require('../config/database');

const calendario = {
    // 🔹 Criar evento
    criarEvento: async (req, res) => {
        const { nome, descricao, data } = req.body;

        if (!nome || !descricao || !data) {
            return res.status(400).json({ mensagem: "Preencha todos os campos!" });
        }

        const sql = `INSERT INTO calendario(nome, descricao, data) VALUES (?, ?, ?)`;

        try {
            await connection.query(sql, [nome, descricao, data]);
            res.status(200).json({ mensagem: "Evento cadastrado com sucesso!" });
        } catch (err) {
            console.error("Erro ao criar evento:", err);
            res.status(500).json({ error: "Erro ao criar evento" });
        }
    },

    // 🔹 Listar eventos
    listarEventos: async (req, res) => {
        try {
            const [results] = await connection.query("SELECT * FROM calendario");
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar eventos" });
        }
    },

    // 🔹 Buscar evento por ID
    buscarEventoID: async (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "ID do evento é obrigatório!" });
        }

        const sql = "SELECT * FROM calendario WHERE idcalendario = ?";

        try {
            const [results] = await connection.query(sql, [id]);

            if (results.length === 0) {
                return res.status(404).json({ error: "Evento não encontrado!" });
            }

            res.status(200).json(results[0]);
        } catch (err) {
            console.error("Erro ao buscar evento:", err);
            res.status(500).json({ error: "Erro ao buscar evento" });
        }
    },

    // 🔹 Atualizar evento
    atualizarEvento: async (req, res) => {
        const id = req.params.id;
        const { nome, descricao, data } = req.body;

        if (!nome || !descricao || !data) {
            return res.status(400).json({ mensagem: "Preencha todos os campos!" });
        }

        try {
            const [results] = await connection.query("SELECT * FROM calendario WHERE idcalendario = ?", [id]);

            if (results.length === 0) {
                return res.status(404).json({ error: "Evento não encontrado para atualizar!" });
            }

            const updateSql = "UPDATE calendario SET nome = ?, descricao = ?, data = ? WHERE idcalendario = ?";
            await connection.query(updateSql, [nome, descricao, data, id]);

            res.status(200).json({ mensagem: "Evento atualizado com sucesso!" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar o evento" });
        }
    },

    // 🔹 Deletar evento
    deletarEvento: async (req, res) => {
        const id = req.params.id;

        try {
            await connection.query("DELETE FROM calendario WHERE idcalendario = ?", [id]);
            res.json({ mensagem: "Evento deletado com sucesso!" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao deletar evento" });
        }
    }
};

module.exports = calendario;
