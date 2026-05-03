const apiUrl = 'http://localhost:3000';

async function receberDados() {
    const res = await fetch(`${apiUrl}/estoque`);
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
        const item = document.createElement('div');
        item.classList.add('info-produto');

        const nome = document.createElement('div');
        nome.classList.add('nome-produto');
        nome.textContent = produto.nome;

        const detalhes = document.createElement('div');
        detalhes.classList.add('detalhes-produto');

        detalhes.innerHTML = `
    <span>ID: ${produto.id}</span>
    <span>Estoque médio: ${produto.estoqueMedio}</span>
    <span class="estoque-atual">Estoque: ${produto.estoque}</span>
`;

        item.append(nome, detalhes);

        const caixa = document.createElement('input');
        caixa.type = 'number';
        caixa.placeholder = 'Qtd';
        caixa.id = `quantidade-${produto.id}`;
        caixa.classList.add('input-qtd');

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

        const radioGroup = document.createElement('div');
        radioGroup.classList.add('radio-group');

        radioGroup.append(
            operacaoAdicionar,
            labelAdicionar,
            operacaoRemover,
            labelRemover
        );

        linha.append(
            item,
            caixa,
            radioGroup
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
    let novoEstoque = pegarDados()
    console.log(novoEstoque);
    if (typeof novoEstoque === 'string') {
        alert(novoEstoque);
        return;
    }
    const resposta = await fetch(`${apiUrl}/estoque`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(novoEstoque)
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);
    window.location.href = 'inicial.html';
}
carregarProdutos();
