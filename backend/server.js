const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connection = require('.//config/database');
const router = require('./routes/router');
const app = express();
const path = require("path");

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../frontend/assets"))); 
app.use("/uploads", express.static("uploads")); // Permitir acesso às imagens

//Rotas
app.use('/', router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});