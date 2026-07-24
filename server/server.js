require("dotenv").config();
console.log(process.env.JWT_SECRET);
   
require("./config/initDatabase");

const express = require("express");
const cors = require("cors");

const produtosRoutes = require("./routes/produtos")
const authRoutes = require("./routes/auth"); 
const pedidosRoutes = require("./routes/pedidos");

const app = express();

app.use((req, res, next) => {
    console.log("REQUISIÇÃO:", req.method, req.url);
    next();
});

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Rotas
app.use(authRoutes);
app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Catálogo funcionando"
    })
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});