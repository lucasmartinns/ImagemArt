const connection = require('../config/database');
const router = require('../routes/router');

const calendario = {
    // 🔹 Criar evento
    criarEvento: (req, res) => {
        try {
            const { nome, descricao, data } = req.body; // Desestruture os dados do corpo da requisição
    
            if (!nome || !descricao || !data) {
                return res.status(400).json({ mensagem: "Preencha todos os campos!" }); // Verifique se os campos estão presentes
            }
    
            const sql = `INSERT INTO calendario(nome, descricao, data) VALUES (?, ?, ?)`;
            const valores = [nome, descricao, data]; // Use as variáveis corretamente
    
            connection.query(sql, valores, (err, results) => {
                if (err) {
                    console.error("Erro ao inserir evento:", err);
                    return res.status(500).json({ error: "Erro ao criar evento" });
                }
                console.log("Evento cadastrado!");
                return res.status(200).json({ mensagem: "Evento cadastrado com sucesso!" });
            });
    
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            return res.status(500).json({ error: "Erro ao criar evento" });
        }
    },
    
    // 🔹 Listar eventos
    listarEventos: (req, res) => {
        connection.query("SELECT * FROM calendario", (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar eventos" });
            }
            return res.status(200).json(results);
        });
    },
    
    // 🔹 Buscar evento por id
    buscarEventoID: (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "ID do evento é obrigatório!" });
        }

        const sql = "SELECT * FROM calendario WHERE idcalendario = ?";
        connection.query(sql, [id], (err, results) => {
            if (err) {
                console.error("Erro ao buscar evento:", err);
                return res.status(500).json({ error: "Erro ao buscar evento" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Evento não encontrado!" });
            }
            return res.status(200).json(results[0]);
        });
    },
    
    // 🔹 Atualizar evento
    atualizarEvento: (req, res) => {
        const id = req.params.id;
        const { nome, descricao, data } = req.body;
    
        if (!nome || !descricao || !data) {
            return res.status(400).json({ mensagem: "Preencha todos os campos!" });
        }
    
        const sql = "SELECT * FROM calendario WHERE idcalendario = ?";
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao verificar evento" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Evento não encontrado para atualizar!" });
            }

            // Evento encontrado, agora realizar a atualização
            const updateSql = "UPDATE calendario SET nome = ?, descricao = ?, data = ? WHERE idcalendario = ?";
            const valores = [nome, descricao, data, id];
            connection.query(updateSql, valores, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao atualizar o evento" });
                }
                return res.status(200).json({ mensagem: "Evento atualizado com sucesso!" });
            });
        });
    },

    // 🔹 Deletar evento
    deletarEvento: (req, res) => {
        const id = req.params.id;
        const sql = "DELETE FROM calendario WHERE idcalendario = ?";
    
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao deletar evento" });
            }
            return res.json({ mensagem: "Evento deletado com sucesso!" });
        });
    }
    
};


module.exports = calendario;
