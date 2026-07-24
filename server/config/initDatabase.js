const db = require("../database/database");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Erro ao verificar tabela 'admin':", err.message);
        } else {
            console.log("Tabela 'admin' verificada.");
        }
    });
});

//Tabela de produtos 
db.run(`
         CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            imagem TEXT,
            categoria TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
        if (err) {
            console.error("Erro ao verificar tabela 'produtos':", err.message);
        }else{
            console.log("Tabela de 'produtos' verificada.");
         }
    });

// Tabela de pedidos
db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT NOT NULL,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL,
        produtos TEXT NOT NULL,
        valor_total REAL NOT NULL,
        status TEXT DEFAULT 'Novo',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error("Erro ao verificar tabela de 'pedidos':", err.message);
    } else {
        console.log("Tabela de 'pedidos' verificada.");
    }
});

// Adicionar CPF/CNPJ na tabela de pedidos caso não exista
db.run(`
    ALTER TABLE pedidos
    ADD COLUMN cpf_cnpj TEXT
`, (err) => {

    if (err) {

        if(err.message.includes("duplicate column name")){

    console.log("Coluna 'cpf_cnpj' já existe.");

} else {

    console.error(
        "Erro ao adicionar cpf_cnpj:",
        err.message
    );

}

    } else {

        console.log("Coluna 'cpf_cnpj' adicionada.");

    }

});