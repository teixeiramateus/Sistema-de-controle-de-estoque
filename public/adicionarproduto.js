function impedirRecarregamento() {
    document.getElementById('formulario').addEventListener('submit', async (event) => {
        event.preventDefault();
        await enviarDados();
    })}

function pegarDados() {
    let novoProduto = {
        nome: document.getElementById("nome").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        estoqueMedio: parseInt(document.getElementById("estoqueMedio").value),
        id: undefined
}
    return novoProduto;
}

async function enviarDados() {
    let novoProduto = pegarDados();
    const resposta = await fetch('/adicionarproduto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);
}

impedirRecarregamento();