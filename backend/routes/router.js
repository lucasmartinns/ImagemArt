const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const servico = require("../controllers/servico");
const pedido = require("../controllers/pedidos");
const calendario = require("../controllers/calendario");
const upload = require("../middlewares/upload");
const path = require("path");

//🔹Rotas de Usuário
router.post("/login", usuario.Login);
router.post("/cadastrar", usuario.Cadastrar);
router.put("/alterar/:id", usuario.AlterarUsuario);
router.delete("/deletar/:id", usuario.Deletar);
router.get('/', usuario.ListarUsuario);
router.get('/buscar/:id', usuario.BuscarUsuarioPorId);

//🔹Rotas de Serviço
router.post("/criarservico", servico.criarServico);
router.put("/alterarservico/:id", servico.alterarServico);
router.get("/servico", servico.listarServicos);
router.get("/buscarservico/:id", servico.buscarServicoPorId);
router.delete("/deletarservico/:id", servico.deletarServico);

//🔹Rotas de Pedido
router.post("/pedidos", pedido.criarPedido);
router.get("/orcamento/:idpedido", pedido.gerarOrcamento);

//🔹Rotas do Calendário
router.post("/criarEvento", calendario.criarEvento);
router.get("/listarEventos", calendario.listarEventos);
router.get("/buscarEvento/:id", calendario.buscarEventoID);
router.put("/atualizarEvento/:id", calendario.atualizarEvento);
router.delete("/deletarEvento/:id", calendario.deletarEvento);

const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');

router.use(express.static(path.join(__dirname, '../../frontend')));

//Rotas HTML
router.get('/login', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'pages', 'login', 'login.html'));
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'pages', 'home', 'home.html'));
});

// //Rotas para paginas
// router.get("/home", (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/index.html"));
// });

//🔹 Rota para Upload de Imagem
router.post("/upload", upload.single("imagem"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem enviada" });
    }

    // Caminho da imagem salva no servidor
    const caminho = `/uploads/${req.file.filename}`;

    // Inserindo o caminho no MySQL
    connection.query(
        "INSERT INTO imagens (caminho) VALUES (?)",
        [caminho],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro ao salvar no banco" });
            }
            res.json({ message: "Upload realizado com sucesso!", caminho });
        }
    );
});

//🔹 Rota para listar imagens
router.get("/imagens", (req, res) => {
    connection.query("SELECT * FROM imagens", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao buscar imagens" });
        }
        res.json(results);
    });
});



module.exports = router;
