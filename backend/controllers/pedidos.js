const connection = require('../config/database');

const pedido = {
    // 🔹 Criar um novo pedido
    criarPedido: async (req, res) => {
        const { usuario_idusuario, servico_idservico, quantidade } = req.body;

        if (!usuario_idusuario || !servico_idservico || !quantidade) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        const sql = `
            INSERT INTO pedido (usuario_idusuario, servico_idservico, quantidade)
            VALUES (?, ?, ?)
        `;

        try {
            const [result] = await connection.query(sql, [usuario_idusuario, servico_idservico, quantidade]);
            res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!", id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: "Erro ao criar pedido", err });
        }
    },

    // 🔹 Gerar orçamento do usuário
    gerarOrcamento: async (req, res) => {
        const idpedido = req.params.idpedido;

        const sql = `
            SELECT 
                p.idpedido, s.nome AS servico, p.quantidade, s.valor, 
                (p.quantidade * s.valor) AS total 
            FROM pedido p
            INNER JOIN servico s ON p.servico_idservico = s.idservico
            WHERE p.idpedido = ?;
        `;

        try {
            const [results] = await connection.query(sql, [idpedido]);

            if (results.length === 0) {
                return res.status(404).json({ error: "Nenhum pedido encontrado para este usuário." });
            }

            const totalGeral = results.reduce((acc, pedido) => acc + parseFloat(pedido.total), 0);

            res.json({
                idpedido,
                pedidos: results,
                totalGeral
            });
        } catch (err) {
            res.status(500).json({ error: "Erro ao gerar orçamento", err });
        }
    }
};

module.exports = pedido;
