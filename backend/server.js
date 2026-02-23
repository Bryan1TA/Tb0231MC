const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/produtos', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, categoria, marca, preco, descricao, imagem_url, criado_em FROM produtos_moda ORDER BY id DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({ erro: 'Nao foi possivel buscar os produtos.' });
  }
});

app.post('/produtos', async (req, res) => {
  const { nome, categoria, marca, preco, descricao, imagem_url } = req.body;

  if (!nome || !categoria || !marca || preco === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatorios: nome, categoria, marca e preco.'
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO produtos_moda
       (nome, categoria, marca, preco, descricao, imagem_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, categoria, marca, preco, descricao || null, imagem_url || null]
    );

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso!',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error.message);
    res.status(500).json({ erro: 'Nao foi possivel cadastrar o produto.' });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM produtos_moda WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto nao encontrado.' });
    }

    res.status(200).json({ mensagem: 'Produto apagado com sucesso.' });
  } catch (error) {
    console.error('Erro ao apagar produto:', error.message);
    res.status(500).json({ erro: 'Nao foi possivel apagar o produto.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
