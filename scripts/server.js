const {definirCaminhoArquivo, pegarDados, escreverNovosDados, gerarId, atualizarEstoque} = require('./library.js');

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/inicial.html'));
});

app.post('/adicionarproduto', (req, res) => {
  const novoProduto = req.body; 

  if (!novoProduto.nome || !novoProduto.quantidade || !novoProduto.estoqueMedio) {
    return res.status(400).json({ mensagem: 'Dados incompletos' });
  }
 const resultado=escreverNovosDados(novoProduto);

 if (resultado.sucesso) {
    res.json({ mensagem: resultado.mensagem });
  } else {
    res.status(500).json({ mensagem: resultado.mensagem });
  }
})

app.get('/listarprodutos', (req, res) => {
  const produtos = pegarDados();
  res.json(produtos);
});

app.post('/alterarEstoque', (req, res) => {
  const novoEstoque = req.body;
  
  const resultado=atualizarEstoque(novoEstoque);

  if (resultado.sucesso) {
    res.json({ mensagem: resultado.mensagem });
  } else {
    res.status(500).json({ mensagem: resultado.mensagem });
  }
  
})

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});