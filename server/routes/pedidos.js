const express = require("express");
const router = express.Router();

const pedidosController = require("../controllers/pedidosNovoController");

const verificarToken = require("../middleware/authMiddleware");


// Criar pedido (cliente)
router.post(
    "/",
    pedidosController.criarPedido
);


// Listar pedidos (admin)
router.get(
    "/",
    verificarToken,
    pedidosController.listarPedidos
);

router.put(
    "/:id",
    verificarToken,
    pedidosController.atualizarStatusPedido
);

module.exports = router;