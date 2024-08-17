function validarCampos() {
    
    let tituloReceita = document.getElementById('tituloReceita').value.trim();
    let porcaoReceita = document.getElementById('porcao').value.trim();
    let porcaoEmb = document.getElementById('porcoesEmbaladas').value.trim();
    let pesoFinalReceita = document.getElementById('pesoFinal').value.trim();
    let medidaCaseiraReceita = document.getElementById('medidaCaseira').value.trim();

    // Verificando se algum dos campos está vazio
    if (!tituloReceita || !porcaoReceita || !porcaoEmb || !pesoFinalReceita || !medidaCaseiraReceita) {
        alert('Por favor, preencha todos os campos antes de continuar.');
        return false; // Impede o envio do formulário se algum campo estiver vazio
    }

    // Se todos os campos estiverem preenchidos, o formulário pode ser enviado
    return true;
}


document.getElementById('btnGerarReceita').addEventListener('click', function(event) {
    if (!validarCampos()) {
        event.preventDefault(); // Impede o envio do formulário caso a validação falhe
    }
});
