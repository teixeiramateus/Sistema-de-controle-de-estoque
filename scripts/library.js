const fs = require('fs');
const path = require('path');

function definirCaminhoArquivo() {
  return path.join(__dirname, 'estoque.json');
}

function pegarDados() {
const caminho = definirCaminhoArquivo();
    let produtos = []
    const conteudo = fs.readFileSync(caminho, 'utf8');
    if (conteudo.trim() !== '') {
     produtos = JSON.parse(conteudo);
     return produtos;
    }
    else {
      return produtos;
  }
}

function gerarId() {
  let produtos = pegarDados();
  if (produtos.length === 0) {
    return 1;
  } else {
    const ids = produtos.map(produto => produto.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }
}

function escreverNovosDados(novoProduto) {
  novoProduto.id = gerarId();
  const caminho = definirCaminhoArquivo();
  const produtos = pegarDados();

    produtos.push(novoProduto);
    try {
    fs.writeFileSync(caminho, JSON.stringify(produtos, null, 2));
    return {sucesso:true, mensagem: 'Produto adicionado com sucesso!'};
    }
    catch (err) {
      return {sucesso:false, mensagem: 'Erro ao adicionar produto.'};
    }
}

module.exports = {definirCaminhoArquivo, pegarDados, escreverNovosDados, gerarId};