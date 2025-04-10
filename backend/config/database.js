// Inicializa o sequelize
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '10.91.249.10', // Endereço do servidor MySQL
    user: 'lucas martins', // Nome de usuário do MySQL
    password: 'senai928', // Senha do MySQL
    database: 'imagemart',
    port: 3306 // Nome do banco de dados
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