const express = require("express");

const app = express();

const clients = require("./models/clients");

const connection = require("./database/connection")

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM clientes';
        const [results] = await connection.promise().query(sql);
        res.send(results);
    } catch (err) {
        res.status(500).send('Erro ao consultar a base de dados');
    }
});
;

app.get('/clients/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        const sql = 'SELECT * FROM clientes WHERE id = ?';
        const [results] = await connection.promise().query(sql, [clientId]);

        if (results.length === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.send(results[0]);
    } catch (err) {
        res.status(500).send('Erro ao consultar a base de dados');
    }
});


app.post('/clients', async (req, res) => {
    const { provider } = req.body;

    // Validação básica
    if (!provider) {
        return res.status(400).send('O campo provider é obrigatório');
    }

    try {
        const sql = 'INSERT INTO clientes (provider) VALUES (?)';
        const [result] = await connection.promise().query(sql, [provider]);

        res.status(201).send({ id: result.insertId, provider });
    } catch (err) {
        res.status(500).send('Erro ao adicionar o cliente');
    }
});


app.put('/clients/:id', async (req, res) => {
    const clientId = req.params.id;
    const { provider } = req.body;

    if (!provider) {
        return res.status(400).send('O campo provider é obrigatório');
    }

    try {
        const [existingClient] = await connection.promise().query('SELECT * FROM clientes WHERE id = ?', [clientId]);
        if (existingClient.length === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        const sql = 'UPDATE clientes SET provider = ? WHERE id = ?';
        const [result] = await connection.promise().query(sql, [provider, clientId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.send({ id: clientId, provider });
    } catch (err) {
        res.status(500).send('Erro ao atualizar o cliente');
    }
});


app.delete('/clients/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        const [existingClient] = await connection.promise().query('SELECT * FROM clientes WHERE id = ?', [clientId]);
        if (existingClient.length === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        const sql = 'DELETE FROM clientes WHERE id = ?';
        const [result] = await connection.promise().query(sql, [clientId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(204).send(); 
    } catch (err) {
        res.status(500).send('Erro ao excluir o cliente');
    }
});


  
app.listen(3000, () => {
    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.stack);
            return;
        }

        console.log('Conectado ao banco de dados com o ID', connection.threadId);
    });

    console.log("Server is running on port 3000");
});
