const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar usuários
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM USERS");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

// Criar usuário
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let id
        let liberado = true

        while (liberado) {
            id = generateRandomNumb(8)

            const [rows] = await db.query(
                "SELECT * FROM USERS WHERE USER_ID = ?" [id]
            )

            liberado = rows.lenght > 0 
        }

        const [result] = await db.query(
            "INSERT INTO USERS (USER_ID, USER_NAME, USER_EMAIL, USER_PSWD) VALUES (?, ?, ?, ?)",
            [id, name, email, password]
        );

        res.json({ user_id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

module.exports = router;

// Função para gerar número aleatório com tamanho fixo
function generateRandomNumb(size) {
    let number = "";
    for (let i = 0; i < size; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}