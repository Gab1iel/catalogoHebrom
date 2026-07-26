require("dotenv").config();

const db = require("./postgres");


async function ajustar(){

    try{

        await db.query(`
            ALTER TABLE pedidos
            ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Novo';
        `);

        console.log("Coluna status verificada.");

        process.exit();

    }catch(erro){

        console.error(
            "Erro REAL:",
            erro.message
        );

        process.exit(1);

    }

}

ajustar();