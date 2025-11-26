async function pegarDados() {
    const res = await fetch('/listarprodutos');
    return await res.json();
}

async function carregarProdutos() {
    let produtos = await pegarDados();
    const lista = document.getElementById('listaprodutos');
    lista.innerHTML = '';

    if (produtos.length === 0) {
        const item = document.createElement('h2');
        item.textContent = 'Nenhum produto no estoque.';
        lista.appendChild(item);
        return;
    }

   produtos.forEach(produto => {
    const item = document.createElement('span');
    item.textContent = `ID: ${produto.id} | ${produto.nome} | Estoque: ${produto.quantidade}`;

    const caixa = document.createElement('input');
    caixa.type = 'number';
    caixa.placeholder = 'Qtd';
    caixa.id = `quantidade-${produto.id}`;

    const operacaoAdicionar = document.createElement('input');
    operacaoAdicionar.type = 'radio';
    operacaoAdicionar.name = `operacaoAdicionar-${produto.id}`;
    operacaoAdicionar.value = 'adicionar';
    operacaoAdicionar.id = `adicionar-${produto.id}`;

    const labelAdicionar = document.createElement('label');
    labelAdicionar.htmlFor = `adicionar-${produto.id}`;
    labelAdicionar.textContent = 'Adicionar';

    const operacaoRemover = document.createElement('input');
    operacaoRemover.type = 'radio';
    operacaoRemover.name = `operacaoAdicionar-${produto.id}`;
    operacaoRemover.value = 'remover';
    operacaoRemover.id = `remover-${produto.id}`;

    const labelRemover = document.createElement('label');
    labelRemover.htmlFor = `remover-${produto.id}`;
    labelRemover.textContent = 'Remover';

    const linha = document.createElement('div');
    linha.classList.add('linha-produto');

    linha.append(
        item,
        caixa,
        operacaoAdicionar,
        labelAdicionar,
        operacaoRemover,
        labelRemover
    );

    lista.appendChild(linha);
});
}

carregarProdutos();
