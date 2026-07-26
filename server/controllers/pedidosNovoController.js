const db = require("../database/postgres");


// =========================
// CRIAR PEDIDO
// =========================
exports.criarPedido = async (req, res) => {

    const {
        nome_cliente,
        cpf_cnpj,
        telefone,
        endereco,
        produtos,
        valor_total
    } = req.body;


    if (!nome_cliente || !cpf_cnpj || !telefone || !endereco || !produtos || !valor_total) {

        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });

    }


    const sql = `
        INSERT INTO pedidos
        (
            nome_cliente,
            cpf_cnpj,
            telefone,
            endereco,
            produtos,
            valor_total
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;


    try {

        const resultado = await db.query(
            sql,
            [
                nome_cliente,
                cpf_cnpj,
                telefone,
                endereco,
                produtos,
                valor_total
            ]
        );


        console.log(
            "PEDIDO SALVO ID:",
            resultado.rows[0].id
        );


        res.status(201).json({
            mensagem: "Pedido criado com sucesso",
            id: resultado.rows[0].id
        });


    } catch(err){

        res.status(500).json({
            erro: "Erro ao criar pedido",
            detalhes: err.message
        });

    }

};



// =========================
// LISTAR PEDIDOS
// =========================
exports.listarPedidos = async (req, res) => {

    try {

        const resultado = await db.query(`
            SELECT *
            FROM pedidos
            ORDER BY criado_em DESC
        `);


        res.status(200).json(resultado.rows);


    } catch(err){

        res.status(500).json({
            erro: "Erro ao buscar pedidos",
            detalhes: err.message
        });

    }

};



// =========================
// ATUALIZAR STATUS
// =========================
exports.atualizarStatusPedido = async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;


    if(!status){

        return res.status(400).json({
            erro: "Status obrigatório"
        });

    }


    try {

        const resultado = await db.query(
            `
            UPDATE pedidos
            SET status = $1
            WHERE id = $2
            `,
            [
                status,
                id
            ]
        );


        if(resultado.rowCount === 0){

            return res.status(404).json({
                erro: "Pedido não encontrado"
            });

        }


        res.status(200).json({
            mensagem:"Status atualizado com sucesso"
        });


    } catch(err){

        res.status(500).json({
            erro:"Erro ao atualizar pedido",
            detalhes:err.message
        });

    }

};