const db = require("../database/database");


const Pedido = {

    criar: (dados, callback) => {

        const sql = `
            INSERT INTO pedidos
            (
                nome_cliente,
                telefone,
                endereco,
                produtos,
                valor_total
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                dados.nome_cliente,
                dados.telefone,
                dados.endereco,
                dados.produtos,
                dados.valor_total
            ],
            callback
        );

    },


    listar: (callback) => {

        const sql = `
            SELECT * FROM pedidos
            ORDER BY criado_em DESC
        `;

        db.all(sql, callback);

    }


};


module.exports = Pedido;