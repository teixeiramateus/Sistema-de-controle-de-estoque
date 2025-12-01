async function receberDados() {
    const res = await fetch('/listarprodutos');
    return await res.json();
}

async function carregarProdutos() {
    let produtos = await receberDados();
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
    item.textContent = `ID: ${produto.id} | ${produto.nome} | Estoque Médio: ${produto.estoqueMedio} | Estoque: ${produto.quantidade}`;

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

function pegarDados() {
    let novoEstoque = [];
    const linhas = document.querySelectorAll('.linha-produto');
   for (const linha of linhas) {

        const textoSpan = linha.querySelector('span').textContent;

        const quantidadeInput = linha.querySelector(`input[type="number"]`);

        if (!quantidadeInput.value) {
            continue;        
        }

        const quantidadeModificada = parseInt(quantidadeInput.value);

        const id = textoSpan.split('|')[0].split(':')[1].trim();
        const estoqueInicial = parseInt(textoSpan.split('|')[3].split(':')[1].trim());


        const operacaoAdicionar = linha.querySelector(`input[value="adicionar"]`);
        const operacaoRemover = linha.querySelector(`input[value="remover"]`);

        if (operacaoRemover.checked && quantidadeModificada > estoqueInicial) {
            return `Não é possível remover mais do que o estoque atual para o produto ID: ${id}`;
        }

        if (isNaN(quantidadeModificada) || (!operacaoAdicionar.checked && !operacaoRemover.checked)) {
            return `Por favor, preencha a quantidade e selecione uma operação para o produto ID: ${id}`;
        }

        novoEstoque.push({
            id: parseInt(id),
            quantidadeModificada: quantidadeModificada,
            operacao: operacaoAdicionar.checked ? 'adicionar' : 'remover'
        });
    }

    return novoEstoque;
}

async function enviarDados() {
    let novoEstoque=pegarDados()
    if (typeof novoEstoque === 'string') {
        alert(novoEstoque);
        return;
    }
    const resposta=await fetch('/alterarEstoque', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(novoEstoque)
        });
    const resultado=await resposta.json();
    alert(resultado.mensagem);
    window.location.href='inicial.html';
}
carregarProdutos();
