const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "catalogo.db"),
    (err) => {
        if (err) {
            console.error("Erro ao conectar ao banco:", err.message);
        } else {
            console.log("Banco de dados conectado.");
        }
    }
);

module.exports = db;