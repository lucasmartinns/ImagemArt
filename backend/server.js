const express = require('express');
const cors = require('cors');
const Router = require('./routes/router');
const cookieParser = require('cookie-parser');
const usuario = require('./models/usuario');
const servico = require('./models/servico');
const pedidos = require('./models/pedidos');
const cliente = require('./models/cliente');

//sincronizando models com banco de dados
usuario.sync();
cliente.sync();
servico.sync();
pedidos.sync();


const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
// app.use(routes);

app.listen(2121, () => console.log('servidor rodando na porta 2121'));