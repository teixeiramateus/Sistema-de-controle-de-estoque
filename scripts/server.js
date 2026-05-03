const express = require('express');
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite.Database("bancoDeDados.sqlite");

const validarBody = (req,res,next) =>{
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({erro:"body não encontrado"})
  }
  next()
}

const validarId = (req,res,next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({erro:"id inválido"})
  }
  next()
}

db.serialize(() => {
db.run(`
  CREATE TABLE IF NOT EXISTS estoque(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  estoque INTEGER,
  estoqueMedio INTEGER
  )
  `)});


app.post('/estoque', validarBody, (req, res) => {
  const {nome,estoque,estoqueMedio} = req.body

  const sql = `INSERT INTO estoque (nome, estoque, estoqueMedio) VALUES(?, ?, ?);`

  db.run(sql,[nome,estoque,estoqueMedio], function (err) {
    if (err) {
       return res.status(500).json({erro:"erro de servidor"})
    }

    return res.status(201).json({mensagem: "Produto adicionado com sucesso"})
  })
})

app.get('/estoque', (req, res) => {
  const sql = `SELECT * FROM estoque;`

  db.all(sql,[], function(err,rows) {
    if (err) {
      return res.status(500).json({erro:"erro de servidor"})
    }
    res.status(200).json(rows)
  })
});

app.patch('/estoque/:id', validarId, validarBody, (req, res) => {
  const id=req.params.id;
  const {estoque} = req.body;

  const sql = `UPDATE estoque SET estoque=? WHERE id=?;`

  db.run(sql,[estoque,id], function(err) {
    if (err) {
      return res.status(500).json({erro:"erro de servidor"})
    }
    if(this.changes===0){
      return res.status(404).json({erro:"id não encontrado"})
    }
    return res.status(200).json({mensagem: "Estoque alterado com sucesso" })
  })
})

app.delete('/estoque/:id', validarId, (req,res)=>{

})

module.exports = db;

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});