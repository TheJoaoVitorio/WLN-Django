
// Função para coletar todos os ingredientes e quantidades da tabela
function coletarIngredientesDaTabela() {
    const IngredientesDaReceita = document.querySelector('.table-ingredientes-da-receita table tbody');
    const linhas = IngredientesDaReceita.querySelectorAll('tr');
    const ingredientes = [];

    linhas.forEach(linha => {
        const nomeIngrediente = linha.cells[0].textContent;
        const quantidadeIngrediente = linha.querySelector('input').value;
        ingredientes.push({ nome: nomeIngrediente, quantidade: quantidadeIngrediente });
    });
    
    console.log(ingredientes);
    return ingredientes;
}

// Adicione um ouvinte de evento 'submit' ao seu formulário
document.getElementById('CriandoReceita').addEventListener('submit', function(event){
    event.preventDefault(); // Impede o envio padrão do formulário

    const ingredientes = coletarIngredientesDaTabela();
    
    // Aqui você pode fazer o que precisar com os ingredientes, como enviar via AJAX
    console.log(ingredientes); // Apenas para teste, mostra os ingredientes no console
});

document.getElementById('CriandoReceita').addEventListener('submit', function(event){
    event.preventDefault(); // Impede o envio padrão do formulário

    const ingredientes = coletarIngredientesDaTabela();

    // Configuração da solicitação AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'criandoreceita/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken')); // Função getCookie precisa ser definida

    // Envia os dados como JSON
    xhr.send(JSON.stringify({ ingredientes: ingredientes }));

    // Trata a resposta do servidor
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Trata sucesso
            console.log(xhr.responseText);
        } else {
            // Trata erro
            console.error(xhr.statusText);
        }
    };
});
