const connection = require('../config/database');

const pedido = {
    // 🔹 Criar um novo pedido
    criarPedido: (req, res) => {
        const { usuario_idusuario, servico_idservico, quantidade } = req.body;

        if (!usuario_idusuario || !servico_idservico || !quantidade) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        const sql = "INSERT INTO pedido (usuario_idusuario, servico_idservico, quantidade) VALUES (?, ?, ?)";
        connection.query(sql, [usuario_idusuario, servico_idservico, quantidade], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao criar pedido", detalhes: err });
            }
            return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!", id: result.insertId });
        });
    },

    // 🔹 Gerar orçamento do usuário
    gerarOrcamento: (req, res) => {
        const idpedido = req.params.idpedido;

        const sql = `
            SELECT 
                p.idpedido, s.nome AS servico, p.quantidade, s.valor, 
                (p.quantidade * s.valor) AS total 
            FROM pedido p
            INNER JOIN servico s ON p.servico_idservico = s.idservico
            WHERE p.idpedido = ?;
        `;

        connection.query(sql, [idpedido], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao gerar orçamento", detalhes: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Nenhum pedido encontrado para este usuário." });
            }

            // Calculando o total do orçamento
            const totalGeral = results.reduce((acc, pedido) => acc + parseFloat(pedido.total), 0);

            return res.json({
                idpedido,
                pedidos: results,
                totalGeral
            });
        });
    }
};

module.exports = pedido;
