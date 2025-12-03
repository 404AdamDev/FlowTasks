const express = require("express");
const router = express.Router();
const db = require("../database");

// Listar todas as tarefas
router.get("/", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM TASKS");
    res.json(rows);
});

// Listar tarefas por usuário
router.get("/user/:id", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM TASKS WHERE USER_ID = ?", [
        req.params.id,
    ]);
    res.json(rows);
});

// Criar nova tarefa
router.post("/", async (req, res) => {
    const { user_id, task, due_date } = req.body;
    const [result] = await db.query(
        "INSERT INTO TASKS (USER_ID, TASK, DUE_DATE) VALUES (?, ?, ?)",
        [user_id, task, due_date]
    );
    res.json({ id: result.insertId });
});

// Atualizar tarefa
router.put("/:id", async (req, res) => {
    const { task, task_status, due_date } = req.body;

    await db.query(
        "UPDATE TASKS SET TASK = ?, TASK_STATUS = ?, DUE_DATE = ? WHERE TASK_ID = ?",
        [task, task_status, due_date, req.params.id]
    );

    res.json({ updated: true });
});

// Excluir tarefa com histórico
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    await db.query(`
        INSERT INTO DELETED_TASKS (TASK_ID, USER_ID, TASK, TASK_STATUS)
        SELECT TASK_ID, USER_ID, TASK, TASK_STATUS 
        FROM TASKS WHERE TASK_ID = ?
    `, [id]);

    await db.query("DELETE FROM TASKS WHERE TASK_ID = ?", [id]);

    res.json({ deleted: true });
});

module.exports = router;
