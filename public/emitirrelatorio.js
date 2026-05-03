const apiUrl = 'http://localhost:3000';

async function receberDados() {
    const res = await fetch(`${apiUrl}/estoque`);
    return await res.json();
}

async function carregarProdutos() {
    let produtos = await receberDados();
    const lista = document.getElementById('estoque');
    lista.innerHTML = '';

    if (produtos.length === 0) {
        const item = document.createElement('h2');
        item.textContent = 'Nenhum produto no estoque.';
        lista.appendChild(item);
        return;
    }

   produtos.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('item-relatorio');
    item.innerHTML = `
        <h3>${produto.nome}</h3>
        <p>ID: ${produto.id}</p>
        <p>Estoque Médio: ${produto.estoqueMedio}</p>
    `;

    const quantidadeEmEstoque = document.createElement('p');
    quantidadeEmEstoque.textContent = `Quantidade em Estoque: ${produto.estoque}`;

    if (produto.estoque <= produto.estoqueMedio/10) {
        quantidadeEmEstoque.classList.add('estoque-muito-baixo');
    }

    else if (produto.estoque <= produto.estoqueMedio) {
        quantidadeEmEstoque.classList.add('estoque-baixo');
    }

    else {
        quantidadeEmEstoque.classList.add('estoque-suficiente');
    }

    const espaco = document.createElement('br');
    lista.append(item,quantidadeEmEstoque,espaco);
});
}
carregarProdutos();