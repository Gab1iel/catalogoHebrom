require("dotenv").config();

const db = require("./postgres");


async function ajustar(){

    try{

        await db.query(`
            ALTER TABLE pedidos
            ALTER COLUMN cpf_cnpj DROP NOT NULL;
        `);

        console.log("cpf_cnpj agora aceita valores vazios.");

        process.exit();

    }catch(erro){

        console.error(
            "Erro:",
            erro.message
        );

        process.exit(1);

    }

}


ajustar();