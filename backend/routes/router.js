const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario");
const connection = require("../config/database");
const bcrypt = require("bcrypt");

//🔹Rotas de Usuário
router.post("/login", usuario.Login);
router.post("/cadastrar", usuario.criarUsuario);
router.post("/cadastrar",usuario.Cadastrar);
router.put("/alterar/:id",usuario.AlterarUsuario);
router.delete("/deletar/:id",usuario.Deletar);
router.get('/',usuario.ListarUsuario);
router.get('/buscar/:id',usuario.BuscarUsuarioPorId);


module.exports = router;
