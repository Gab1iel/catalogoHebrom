const jwt = require("jsonwebtoken");
const db = require("../database/database");
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
            VALUES (?, ?)
        `;

        db.run(sql, [usuario, senhaHash], function (err) {

            if (err) {

                // Usuário já existe
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        erro: "Este usuário já está cadastrado."
                    });
                }

                console.error("Erro ao criar administrador:", err.message);

                return res.status(500).json({
                    erro: "Erro interno do servidor."
                });
            }

            res.status(201).json({
                mensagem: "Administrador criado com sucesso.",
                id: this.lastID
            });

        });

    } catch (erro) {

        console.error("Erro inesperado:", erro);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

};

// =========================
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

    const sql = `
        SELECT * FROM admin
        WHERE usuario = ?
    `;

    db.get(sql, [usuario.trim()], async (err, admin) => {

        if (err) {
            console.error("Erro ao buscar administrador:", err.message);

            return res.status(500).json({
                erro: "Erro interno do servidor."
            });
        }

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


        res.json({
            mensagem: "Login realizado com sucesso.",
            token
        });

    });

};