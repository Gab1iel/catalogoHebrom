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
