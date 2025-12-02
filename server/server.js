const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*
    Rotas para Usuários
*/

// Obter todos os usuários
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM USERS');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar novo usuário
app.post('/api/users', async (req, res) => {
    try {
        const { USER_NAME, USER_EMAIL, USER_PSWD } = req.body;
        const [result] = await db.query(
            'INSERT INTO USERS (USER_NAME, USER_EMAIL, USER_PSWD) VALUES (?, ?, ?)',
            [USER_NAME, USER_EMAIL, USER_PSWD]
        );
        res.json({ id: result.insertId, message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* 
    Rotas para Tarefas
*/

// Obter todas as tarefas
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM TASKS ORDER BY CREATED_AT DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter tarefas por ID de usuário
app.get('/api/tasks/:user_id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM TASKS WHERE USER_ID = ?', [req.params.user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar nova tarefa
app.post('/api/tasks', async (req, res) => {
    try {
        const { USER_ID, TASK, DUE_DATE } = req.body;
        const [result] = await db.query(
            'INSERT INTO TASKS (USER_ID, TASK, DUE_DATE) VALUES (?, ?, ?)',
            [USER_ID, TASK, DUE_DATE]
        );
        res.json({ id: result.insertId, message: 'Tarefa criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar tarefa
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { TASK, TASK_STATUS, DUE_DATE } = req.body;
        await db.query(
            'UPDATE TASKS SET TASK = ?, TASK_STATUS = ?, DUE_DATE = ? WHERE TASK_ID = ?',
            [TASK, TASK_STATUS, DUE_DATE, req.params.id]
        );
        res.json({ message: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* 
    Rotas para Tarefas Deletadas
*/

// Deletar tarefa (movendo para tabela de deletadas)
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        // Primeiro, pega os dados da tarefa para salvar no histórico
        const [task] = await db.query('SELECT * FROM TASKS WHERE TASK_ID = ?', [req.params.id]);

        if (task[0]) {
            // Insere na tabela de deletadas
            await db.query(
                'INSERT INTO DELETED_TASKS (TASK_ID, USER_ID, TASK_TITLE, TASK_DESCRIPTION, TASK_STATUS) VALUES (?, ?, ?, ?, ?)',
                [task[0].TASK_ID, task[0].USER_ID, task[0].TASK_TITLE, task[0].TASK_DESCRIPTION, task[0].TASK_STATUS]
            );
        }

        // Depois deleta da tabela principal
        await db.query('DELETE FROM TASKS WHERE TASK_ID = ?', [req.params.id]);
        res.json({ message: 'Tarefa deletada e movida para histórico!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); W