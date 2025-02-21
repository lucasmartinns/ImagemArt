// Inicializa o sequelize
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Endereço do servidor MySQL
    user: 'root', // Nome de usuário do MySQL
    password: 'root', // Senha do MySQL
    database: 'imagemart',
    port: 3307 // Nome do banco de dados
});

// Conectando-se ao banco de dados MySQL
connection.connect((err) => {
    console.log("Conectando com banco de dados...");
    if (err) {
        console.error('Erro ao conectar-se ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

module.exports = connection;