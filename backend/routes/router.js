const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const servico = require("../controllers/servico");
const pedido = require("../controllers/pedidos");

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
router.get("/bucarservico/:id", servico.buscarServicoPorId);
router.delete("/deltarservico/:id", servico.deletarServico);

//🔹Rotas de Pedido
router.post("/pedidos", pedido.criarPedido);
router.get("/orcamento/:usuarioId", pedido.gerarOrcamento);



module.exports = router;
