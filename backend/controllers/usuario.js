const connection = require('../config/database');
const bcrypt = require('bcrypt');

const usuario = {
    criarUsuario: async (nome,email,senha,telefone) => {
       try{
        const SenhaCriptografada = await bcrypt.hash(senha, 10);
       
        const sql = `INSERT INTO usuario (nome,email,senha,telefone) VALUES (?,?,?,?)`;
        const valores = [nome,email,SenhaCriptografada,telefone]

        console.log(nome,email,SenhaCriptografada,telefone);

        connection.query(sql,valores, (err,result) => {
            if (err) {s
                console.error('Erro ao inserir usuário:', err);
                return;
            } 
            console.log('Usuário cadastrado!')
        });
    } catch (error) {
        console.error('Erro a criptografar a senha:',error);
    }
}
}

module.exports = usuario;