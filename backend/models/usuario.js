const Sequelize = require('sequelize')
const database = require('../config/sequelize')
const { default_type } = require('mime')

const usuarios = database.define('usuarios', {
    email: {
        type: Sequelize.STRING,
        AllowNUll: false,
        primaryKey: true,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        AllowNUll: false
    }
});


module.exports = usuarios