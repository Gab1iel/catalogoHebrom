const db = require("../database/database");

// =========================
// LISTAR PRODUTOS
// =========================
exports.listarProdutos = (req, res) => {

    const sql = `
        SELECT *
        FROM produtos
        ORDER BY criado_em DESC
    `;

    db.all(sql, [], (err, produtos) => {

        if (err) {
            return res.status(500).json({
                erro: "Erro ao buscar produtos",
                detalhes: err.message
            });
        }

        res.status(200).json(produtos);

    });

};


// =========================
// CADASTRAR PRODUTO
// =========================
exports.criarProduto = (req, res) => {

    console.log("ENTROU NO CRIAR PRODUTO");

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { nome, descricao, preco, categoria } = req.body;
    
    const imagem = req.file ? req.file.filename : null;

    if (!nome || !preco) {
        return res.status(400).json({
            erro: "Nome e preço são obrigatórios"
        });
    }

    const sql = `
        INSERT INTO produtos
        (nome, descricao, preco, imagem, categoria)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome, descricao, preco, imagem, categoria],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar produto",
                    detalhes: err.message
                });
            }

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso",
                id: this.lastID
            });

        }
    );

};

// =========================
// ATUALIZAR PRODUTO
// =========================
exports.atualizarProduto = (req, res) => {

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
            nome = ?,
            descricao = ?,
            preco = ?,
            imagem = ?,
            categoria = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            nome,
            descricao,
            preco,
            imagem,
            categoria,
            id
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: "Erro ao atualizar produto",
                    detalhes: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Produto não encontrado"
                });
            }

            res.status(200).json({
                mensagem: "Produto atualizado com sucesso"
            });

        }
    );

};


// =========================
// EXCLUIR PRODUTO
// =========================
exports.excluirProduto = (req, res) => {

    const { id } = req.params;

    db.run(
        "DELETE FROM produtos WHERE id = ?",
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: "Erro ao excluir produto",
                    detalhes: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Produto não encontrado"
                });
            }

            res.status(200).json({
                mensagem: "Produto excluído com sucesso"
            });

        }
    );

};