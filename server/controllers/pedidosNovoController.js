const db = require("../database/database");


// =========================
// CRIAR PEDIDO
// =========================
exports.criarPedido = (req, res) => {

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
    VALUES (?, ?, ?, ?, ?, ?)
`;


    db.run(
        sql,
         [
        nome_cliente,
        cpf_cnpj,
        telefone,
        endereco,
        produtos,
        valor_total
         ],
      function(err){

            if(err){

                return res.status(500).json({
                    erro: "Erro ao criar pedido",
                    detalhes: err.message
                });

            }

            console.log("PEDIDO SALVO ID:", this.lastID);

            res.status(201).json({
                mensagem: "Pedido criado com sucesso",
                id: this.lastID
            });

        }
    );

};



// =========================
// LISTAR PEDIDOS
// =========================
exports.listarPedidos = (req, res) => {

    const sql = `
        SELECT *
        FROM pedidos
        ORDER BY criado_em DESC
    `;


    db.all(sql, [], (err, pedidos)=>{

        if(err){

            return res.status(500).json({
                erro: "Erro ao buscar pedidos",
                detalhes: err.message
            });

        }


        res.status(200).json(pedidos);

    });

};

// =========================
// ATUALIZAR STATUS DO PEDIDO
// =========================
exports.atualizarStatusPedido = (req, res) => {

    const { id } = req.params;

    const { status } = req.body;


    if (!status) {

        return res.status(400).json({
            erro: "Status obrigatório"
        });

    }


    const sql = `
        UPDATE pedidos
        SET status = ?
        WHERE id = ?
    `;


    db.run(
        sql,
        [
            status,
            id
        ],
        function(err){

            if(err){

                return res.status(500).json({
                    erro: "Erro ao atualizar pedido",
                    detalhes: err.message
                });

            }


            if(this.changes === 0){

                return res.status(404).json({
                    erro: "Pedido não encontrado"
                });

            }


            res.status(200).json({

                mensagem:
                "Status atualizado com sucesso"

            });


        }
    );

};