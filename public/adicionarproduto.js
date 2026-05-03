const apiUrl = 'http://localhost:3000';

function impedirRecarregamento() {
    document.getElementById('formulario').addEventListener('submit', async (event) => {
        event.preventDefault();
        await enviarDados();
    })}

function pegarDados() {
    let novoProduto = {
        nome: document.getElementById("nome").value,
        estoque: parseInt(document.getElementById("quantidade").value),
        estoqueMedio: parseInt(document.getElementById("estoqueMedio").value)
}
    return novoProduto;
}

async function enviarDados() {
    let novoProduto = pegarDados();
    const resposta = await fetch(`${apiUrl}/estoque`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);
    window.location.href='inicial.html';
}

impedirRecarregamento();