const connection = require('../config/database');


connection.query('SELECT * FROM calendario', (err, results) => {
    if (err) {
        console.error('Erro ao executar a consulta:', err);
        return;
    }
    console.log('Resultados da consulta:', results);
});

module.exports = calendario;