const express = require("express");
const router = express.Router();

const produtosController = require("../controllers/productsController");
const verificarToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", produtosController.listarProdutos);

router.post(
    "/",
    (req, res, next) => {
        console.log("CHEGOU NA ROTA PRODUTOS");
        next();
    },
    verificarToken,
    upload.single("imagem"),
    produtosController.criarProduto
);

router.put(
    "/:id",
    verificarToken,
    upload.single("imagem"),
    produtosController.atualizarProduto
);

router.delete(
    "/:id",
    verificarToken,
    produtosController.excluirProduto
);

module.exports = router;