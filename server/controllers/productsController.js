const db = require("../database/postgres");

// =========================
// LISTAR PRODUTOS
// =========================
exports.listarProdutos = async (req, res) => {

    const sql = `
        SELECT *
        FROM produtos
        ORDER BY criado_em DESC
    `;


    try {

        const resultado = await db.query(sql);

        res.status(200).json(resultado.rows);


    } catch (err) {

        return res.status(500).json({
            erro: "Erro ao buscar produtos",
            detalhes: err.message
        });

    }

};



// =========================
// CADASTRAR PRODUTO
// =========================
exports.criarProduto = async (req, res) => {

    console.log("ENTROU NO CRIAR PRODUTO");

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);


    const {
        nome,
        descricao,
        preco,
        categoria
    } = req.body;


    const imagem = req.file
        ? req.file.filename
        : null;


    if (!nome || !preco) {
        return res.status(400).json({
            erro: "Nome e preço são obrigatórios"
        });
    }


    const sql = `
        INSERT INTO produtos
        (nome, descricao, preco, imagem, categoria)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `;


    try {

        const resultado = await db.query(
            sql,
            [
                nome,
                descricao,
                preco,
                imagem,
                categoria
            ]
        );


        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            id: resultado.rows[0].id
        });


    } catch (err) {

        return res.status(500).json({
            erro: "Erro ao cadastrar produto",
            detalhes: err.message
        });

    }

};



// =========================
// ATUALIZAR PRODUTO
// =========================
exports.atualizarProduto = async (req, res) => {

    const { id } = req.params;


    const {
        nome,
        descricao,
        preco,
        categoria
    } = req.body;


    const imagem = req.file
        ? req.file.filename
        : req.body.imagem;


    if (!nome || !preco) {
        return res.status(400).json({
            erro: "Nome e preço são obrigatórios"
        });
    }


    const sql = `
        UPDATE produtos
        SET
            nome = $1,
            descricao = $2,
            preco = $3,
            imagem = $4,
            categoria = $5
        WHERE id = $6
    `;


    try {

        const resultado = await db.query(
            sql,
            [
                nome,
                descricao,
                preco,
                imagem,
                categoria,
                id
            ]
        );


        if (resultado.rowCount === 0) {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }


        res.status(200).json({
            mensagem: "Produto atualizado com sucesso"
        });


    } catch (err) {

        return res.status(500).json({
            erro: "Erro ao atualizar produto",
            detalhes: err.message
        });

    }

};



// =========================
// EXCLUIR PRODUTO
// =========================
exports.excluirProduto = async (req, res) => {

    const { id } = req.params;


    try {

        const resultado = await db.query(
            `
            DELETE FROM produtos
            WHERE id = $1
            `,
            [id]
        );


        if (resultado.rowCount === 0) {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }


        res.status(200).json({
            mensagem: "Produto excluído com sucesso"
        });


    } catch (err) {

        return res.status(500).json({
            erro: "Erro ao excluir produto",
            detalhes: err.message
        });

    }

};