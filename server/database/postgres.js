const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testarConexao() {
    try {
        const resultado = await pool.query("SELECT NOW()");
        console.log("PostgreSQL conectado:", resultado.rows[0]);
    } catch (erro) {
        console.error("Erro PostgreSQL:", erro.message);
    }
}

testarConexao();

module.exports = pool;