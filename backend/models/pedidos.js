const Sequelize = require('sequelize')
const database = require('../config/sequelize')
const { default_type } = require('mime');
const cliente = require('./cliente');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

const pedidos = database.define('pedidos', {

    id: {
        type: Sequelize.STRING,
        AllowNUll: false,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: Sequelize.INTEGER,
        AllowNUll: false,
        references: {
            model: cliente_id,
            key: 'id'
        }
    },
    servico_id: {
        type: Sequelize.INTEGER,
        AllowNUll: false,
        references: {
            model: servico_id,
            key: 'id'
        }
    },  
    valor: {
        type: Sequelize.DECIMAL(8,2),
        AllowNUll: false
    }
});

cliente.hasmany(pedidos,{
    foreignKey: 'cliente_id'
}),
pedidos.belongsTo(cliente,{
    foreignKey:'cliente_id'
})



module.exports = pedidos