const Sequelize = require('sequelize')
const database = require('../config/sequelize')
const { default_type } = require('mime')

const servico = database.define('servico', {
    servico: {
        type: Sequelize.STRING,
        AllowNUll: false,
        primaryKey: true,
        unique: true
    },
    especificacao: {
        type: Sequelize.STRING,
        AllowNUll: false
    },
    quantidade: {
        type: Sequelize.STRING,
        AllowNUll: false
    },
    valor: {
        type: Sequelize.DECIMAL(8,2),
        AllowNUll: false
    }
});


module.exports = servico