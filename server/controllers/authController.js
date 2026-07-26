const jwt = require("jsonwebtoken");
const db = require("../database/postgres");
const bcrypt = require("bcrypt");

// =========================
// CRIAR PRIMEIRO ADMIN
// =========================
exports.criarAdmin = async (req, res) => {

    let { usuario, senha } = req.body;

    // Validação dos campos
    if (!usuario?.trim() || !senha?.trim()) {
        return res.status(400).json({
            erro: "Usuário e senha são obrigatórios."
        });
    }

    usuario = usuario.trim();
    senha = senha.trim();

    // Validação de tamanho
    if (usuario.length < 4) {
        return res.status(400).json({
            erro: "O usuário deve possuir pelo menos 4 caracteres."
        });
    }

    if (senha.length < 6) {
        return res.status(400).json({
            erro: "A senha deve possuir pelo menos 6 caracteres."
        });
    }

    try {

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

const sql = `
    INSERT INTO admin (usuario, senha)
    VALUES ($1, $2)
    RETURNING id
`;

try {

    const resultado = await db.query(
        sql,
        [usuario, senhaHash]
    );

    res.status(201).json({
        mensagem: "Administrador criado com sucesso.",
        id: resultado.rows[0].id
    });

} catch (erro) {

    if (erro.message.includes("unique")) {
        return res.status(409).json({
            erro: "Este usuário já está cadastrado."
        });
    }

    console.error(
        "Erro ao criar administrador:",
        erro.message
    );

    return res.status(500).json({
        erro: "Erro interno do servidor."
    });

}

    } catch (erro) {

        console.error("Erro inesperado:", erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

};// =========================
// LOGIN ADMIN
// =========================
exports.loginAdmin = async (req, res) => {

    console.log("BODY", req.body);

    const { usuario, senha } = req.body;


    if (!usuario?.trim() || !senha?.trim()) {
        return res.status(400).json({
            erro: "Usuário e senha são obrigatórios."
        });
    }


    try {

        const sql = `
            SELECT * FROM admin
            WHERE usuario = $1
        `;


        const resultado = await db.query(
            sql,
            [usuario.trim()]
        );


        const admin = resultado.rows[0];


        if (!admin) {
            return res.status(401).json({
                erro: "Usuário ou senha inválidos."
            });
        }


        const senhaValida = await bcrypt.compare(
            senha.trim(),
            admin.senha
        );


        if (!senhaValida) {
            return res.status(401).json({
                erro: "Usuário ou senha inválidos."
            });
        }


        const token = jwt.sign(
            {
                id: admin.id,
                usuario: admin.usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );


        return res.json({
            mensagem: "Login realizado com sucesso.",
            token
        });


    } catch (erro) {

        console.error(
            "Erro no login:",
            erro.message
        );


        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

};