const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const servico = require("../controllers/servico");
const pedido = require("../controllers/pedidos");
const calendario = require("../controllers/calendario");

//🔹Rotas de Usuário
router.post("/login", usuario.Login);
router.post("/cadastrar", usuario.criarUsuario);
router.post("/cadastrar",usuario.Cadastrar);
router.put("/alterar/:id",usuario.AlterarUsuario);
router.delete("/deletar/:id",usuario.Deletar);
router.get('/',usuario.ListarUsuario);
router.get('/buscar/:id',usuario.BuscarUsuarioPorId);


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




module.exports = router;
