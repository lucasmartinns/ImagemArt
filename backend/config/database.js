// config/database.js
const mysql = require('mysql2/promise'); // Note o /promise aqui

const pool = mysql.createPool({
    host: 'host',
    user: 'nome',
    password: 'senha',
    database: 'banco',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar se a conexão está funcionando
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão bem-sucedida ao banco de dados MySQL');
        connection.release();
    } catch (err) {
        console.error('Erro ao conectar-se ao banco de dados:', err);
    }
}

testConnection();

module.exports = pool;
