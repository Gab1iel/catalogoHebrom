const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// =========================
// CRIAR PRIMEIRO ADMIN
// =========================
router.post("/admin/criar", authController.criarAdmin);

//==========================
// Login admin
//==========================
router.post("/admin/login", authController.loginAdmin);

module.exports = router;