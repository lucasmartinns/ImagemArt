const connection = require('../config/database');
const upload = require('../middlewares/upload'); // Importa o middleware de upload

const servico = {
    // 🔹 Middleware de upload (para usar na rota)
    uploadImagem: upload.single('imagem'),

    // 🔹 Criar um novo serviço (com ou sem variações + imagem)
    criarServico: async (req, res) => {
        const { nome } = req.body;
    
        if (!nome) {
            return res.status(400).json({ error: "Nome é obrigatório!" });
        }
    
        // Verifica se há uma imagem
        const imagem = req.file ? `/uploads/${req.file.filename}` : null;
    
        // Trata as variações (esperadas como JSON no body)
        let variacoes = [];
        if (req.body.variacoes) {
            try {
                variacoes = JSON.parse(req.body.variacoes);
            } catch {
                return res.status(400).json({ error: "Variações inválidas. Envie um JSON válido!" });
            }
        }
    
        try {
           
            const [result] = await connection.query(
                "INSERT INTO servico (nome, imagem) VALUES (?, ?)",
                [nome, imagem]
            );
    
            const servicoId = result.insertId;
    
            
            if (Array.isArray(variacoes)) {
                for (const v of variacoes) {
                    await connection.query(
                        "INSERT INTO servico_variacao (servico_id, descricao, preco, quantidade_minima) VALUES (?, ?, ?, ?)",
                        [servicoId, v.descricao, v.preco, v.quantidade_minima]
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
            const [variacoes] = await connection.query(
                "SELECT descricao, id, servico_id, preco, quantidade_minima FROM servico_variacao WHERE servico_id = ?",
                [servicoId]
            );

            if (variacoes.length === 0) {
                return res.status(404).json({ mensagem: "Nenhuma variação encontrada para este serviço." });
            }

            res.json(variacoes);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar variações", err });
        }
    }
};

module.exports = servico;
