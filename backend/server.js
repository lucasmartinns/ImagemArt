const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connection = require('.//config/database');
const router = require('./routes/router');
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/assets"))); 
app.use("/uploads", express.static("uploads")); // Permitir acesso às imagens

//Rotas
app.use('/', router);


app.listen(3000, () => console.log('servidor rodando na porta 3000'));