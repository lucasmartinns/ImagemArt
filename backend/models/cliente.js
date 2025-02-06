const Sequelize = require('sequelize')
const database = require('../config/sequelize')
const { default_type } = require('mime')

const cliente = database.define('cliente', {
    id: {
        type: Sequelize.STRING,
        AllowNUll: false,
        primaryKey: true,
        unique: true
    },
    telefone: {
        type: Sequelize.VARCHAR(15),
        AllowNUll: false,
        unique: true
    },
    nome: {
        type: Sequelize.STRING,
        AllowNUll: false,
    }
});


module.exports = cliente