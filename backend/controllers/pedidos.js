const connection = require('../config/database');

const pedido = {
    // 🔹 Criar um novo pedido
    criarPedido: async (req, res) => {
        const { usuario_idusuario, servico_idservico, quantidade } = req.body;

        if (!usuario_idusuario || !servico_idservico || !quantidade) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        try {
            // 1. Buscar as variações para o serviço selecionado
            const variacaoSql = `
                SELECT descricao, preco, quantidade_minima
                FROM servico_variacao
                WHERE servico_id = ?
                ORDER BY quantidade_minima DESC;
            `;
            const [variacoes] = await connection.query(variacaoSql, [servico_idservico]);

            if (variacoes.length === 0) {
                // Se não houver variações, pega o preço padrão do serviço
                const servicoSql = `SELECT valor FROM servico WHERE idservico = ?`;
                const [servico] = await connection.query(servicoSql, [servico_idservico]);
                const precoUnitario = servico[0]?.valor || 0;

                const total = precoUnitario * quantidade;

                const sql = `
                    INSERT INTO pedido (usuario_idusuario, servico_idservico, quantidade, total)
                    VALUES (?, ?, ?, ?)
                `;
                const [result] = await connection.query(sql, [usuario_idusuario, servico_idservico, quantidade, total]);
                return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!", id: result.insertId, total });
            }

            // 2. Aplicar a variação de preço com base na quantidade
            let precoUnitario = 0;
            for (let variacao of variacoes) {
                if (quantidade >= variacao.quantidade_minima) {
                    precoUnitario = variacao.preco;
                    break;
                }
            }

            // 3. Caso não encontre uma variação válida, usa o preço padrão
            if (precoUnitario === 0) {
                const servicoSql = `SELECT valor FROM servico WHERE idservico = ?`;
                const [servico] = await connection.query(servicoSql, [servico_idservico]);
                precoUnitario = servico[0]?.valor || 0;
            }

            const total = precoUnitario * quantidade;

            // 4. Criar o pedido com o preço correto
            const sql = `
                INSERT INTO pedido (usuario_idusuario, servico_idservico, quantidade, total)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await connection.query(sql, [usuario_idusuario, servico_idservico, quantidade, total]);
            return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!", id: result.insertId, total });

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
