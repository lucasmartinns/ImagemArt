const db = require('../config/database');

const calendario = {

  // 🔹 Criar evento
  criarEvento: async (req, res) => {
    const { nome, data, hora_inicio, hora_fim } = req.body;

    if (!nome || !data || !hora_inicio || !hora_fim) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }

    try {
      const sql = `INSERT INTO calendario (nome, data, hora_inicio, hora_fim) VALUES (?, ?, ?, ?)`;
      await db.query(sql, [nome, data, hora_inicio, hora_fim]);

      return res.status(201).json({ mensagem: "Evento cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      return res.status(500).json({ error: "Erro ao criar evento" });
    }
  },

  // 🔹 Listar todos os eventos
  listarEventos: async (req, res) => {
    try {
      const [results] = await db.query("SELECT * FROM calendario");
      return res.status(200).json(results);
    } catch (error) {
      console.error("Erro ao listar eventos:", error);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  },

  // 🔹 Buscar evento por ID
  buscarEventoPorId: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID do evento é obrigatório!" });
    }

    try {
      const [results] = await db.query("SELECT * FROM calendario WHERE id = ?", [id]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Evento não encontrado!" });
      }

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      return res.status(500).json({ error: "Erro ao buscar evento" });
    }
  },

  // 🔹 Atualizar evento
  atualizarEvento: async (req, res) => {
    const id = req.params.id;
    const { nome, data, hora_inicio, hora_fim } = req.body;

    if (!nome || !data || !hora_inicio || !hora_fim) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }

    try {
      const [result] = await db.query("SELECT * FROM calendario WHERE id = ?", [id]);

      if (result.length === 0) {
        return res.status(404).json({ error: "Evento não encontrado!" });
      }

      const updateSql = `
        UPDATE calendario 
        SET nome = ?, data = ?, hora_inicio = ?, hora_fim = ? 
        WHERE id = ?
      `;

      await db.query(updateSql, [nome, data, hora_inicio, hora_fim, id]);

      return res.status(200).json({ mensagem: "Evento atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      return res.status(500).json({ error: "Erro ao atualizar evento" });
    }
  },

  // 🔹 Deletar evento
  deletarEvento: async (req, res) => {
    const id = req.params.id;

    try {
      await db.query("DELETE FROM calendario WHERE id = ?", [id]);
      return res.status(200).json({ mensagem: "Evento deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      return res.status(500).json({ error: "Erro ao deletar evento" });
    }
  }

};

module.exports = calendario;
