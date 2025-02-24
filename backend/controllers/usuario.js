const connection = require('../config/database');
const bcrypt = require('bcrypt');

const usuario = {
    criarUsuario: async (nome,email,senha,telefone) => {
       try{
        const SenhaCriptografada = await bcrypt.hash(senha, 10);
       
        const sql = `INSERT INTO usuario (nome,email,senha,telefone) VALUES (?,?,?,?)`;
        const valores = [nome,email,SenhaCriptografada,telefone]

        // console.log(nome,email,SenhaCriptografada,telefone);

        return new Promise((resolve,reject) => {
            connection.query(sql,valores, (err,result) => {
                if (err) {
                    console.error('Erro ao inserir usuário:', err);
                    reject(err);
                } 
                console.log('Usuário cadastrado!')
                resolve(result);
            });
        });
    } catch (error) {
        console.error('Erro ao criptografar senha:', error);
        throw error;
    }
}
}

module.exports = usuario;