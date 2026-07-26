require("dotenv").config();

const sqlite = require("./database");
const postgres = require("./postgres");


function sqliteAll(sql) {

    return new Promise((resolve, reject) => {

        sqlite.all(sql, [], (err, rows) => {

            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }

        });

    });

}


async function migrar() {

    try {

        console.log("Iniciando migração...");


        // ADMIN
        const admins = await sqliteAll(
            "SELECT * FROM admin"
        );


        for (const admin of admins) {

            await postgres.query(
                `
                INSERT INTO admin
                (id, usuario, senha)
                VALUES ($1,$2,$3)
                ON CONFLICT (id) DO NOTHING
                `,
                [
                    admin.id,
                    admin.usuario,
                    admin.senha
                ]
            );

        }


        console.log("Admins migrados:", admins.length);



        // PRODUTOS
        const produtos = await sqliteAll(
            "SELECT * FROM produtos"
        );


        for (const produto of produtos) {

            await postgres.query(
                `
                INSERT INTO produtos
                (
                    id,
                    nome,
                    descricao,
                    preco,
                    imagem,
                    categoria,
                    criado_em
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7)
                ON CONFLICT (id) DO NOTHING
                `,
                [
                    produto.id,
                    produto.nome,
                    produto.descricao,
                    produto.preco,
                    produto.imagem,
                    produto.categoria,
                    produto.criado_em
                ]
            );

        }


        console.log("Produtos migrados:", produtos.length);



        // PEDIDOS
        const pedidos = await sqliteAll(
            "SELECT * FROM pedidos"
        );


        for (const pedido of pedidos) {

            await postgres.query(
                `
                INSERT INTO pedidos
                (
                    id,
                    nome_cliente,
                    cpf_cnpj,
                    telefone,
                    endereco,
                    produtos,
                    valor_total,
                    criado_em,
                    status
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (id) DO NOTHING
                `,
                [
                    pedido.id,
                    pedido.nome_cliente,
                    pedido.cpf_cnpj,
                    pedido.telefone,
                    pedido.endereco,
                    pedido.produtos,
                    pedido.valor_total,
                    pedido.criado_em,
                    pedido.status || "Novo"
                ]
            );

        }


        console.log("Pedidos migrados:", pedidos.length);


        console.log("Migração concluída com sucesso!");

        process.exit();


    } catch (erro) {

        console.error(
            "Erro na migração:",
            erro
        );

        process.exit(1);

    }

}


migrar();