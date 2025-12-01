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

function atualizarEstoque(novoEstoque) {
  const caminho = definirCaminhoArquivo();
  const produtos = pegarDados();

  for (const novoDado of novoEstoque) {

    const indice = produtos.findIndex(p => p.id === novoDado.id);

    if (indice === -1) {
      return { sucesso: false, mensagem: `Produto ID ${novoDado.id} não encontrado.` };
    }

    const produto = produtos[indice];

    if (novoDado.operacao === 'adicionar') {
      produto.quantidade += novoDado.quantidadeModificada;
    } 
    else if (novoDado.operacao === 'remover') {
      produto.quantidade -= novoDado.quantidadeModificada;
    } 
    else {
      return { sucesso: false, mensagem: `Operação inválida no produto ID: ${novoDado.id}` };
    }

    produtos[indice] = produto;
  }

  try {
    fs.writeFileSync(caminho, JSON.stringify(produtos, null, 2));
    return { sucesso: true, mensagem: 'Estoque atualizado com sucesso!' };
  } 
  catch (err) {
    return { sucesso: false, mensagem: 'Erro ao atualizar estoque.' };
  }
}


module.exports = {definirCaminhoArquivo, pegarDados, escreverNovosDados, gerarId, atualizarEstoque};