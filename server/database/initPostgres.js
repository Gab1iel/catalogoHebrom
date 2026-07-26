const db = require("./postgres");


async function criarTabelas() {

    try {

        await db.query(`
            CREATE TABLE IF NOT EXISTS admin (
                id SERIAL PRIMARY KEY,
                usuario TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL
            );
        `);


        await db.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                descricao TEXT,
                preco REAL NOT NULL,
                imagem TEXT,
                categoria TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);


        await db.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id SERIAL PRIMARY KEY,
                nome_cliente TEXT NOT NULL,
                cpf_cnpj TEXT NOT NULL,
                telefone TEXT NOT NULL,
                endereco TEXT NOT NULL,
                produtos TEXT NOT NULL,
                valor_total REAL NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);


        console.log("Tabelas PostgreSQL criadas/verificadas.");

    } catch (erro) {

        console.error(
            "Erro criando tabelas PostgreSQL:",
            erro
        );

    }

}


criarTabelas();