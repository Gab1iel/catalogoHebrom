const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    console.log("AUTH MIDDLEWARE EXECUTADO");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensagem: "Token não informado."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (erro) {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });

    }
}

module.exports = verificarToken;