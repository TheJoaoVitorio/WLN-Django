function arredondarValoresTabela() {
    // Seleciona as células da tabela por classe
    let elementosValorEnergetico = document.querySelectorAll('.valor-energetico');
    let elementosCarboidratos = document.querySelectorAll('.carboidratos');
    let elementosAcucares = document.querySelectorAll('.acucares');
    let elementosProteinas = document.querySelectorAll('.proteinas');
    let elementosGorduras = document.querySelectorAll('.gorduras');
    let elementosFibra = document.querySelectorAll('.fibra');
    let elementosSodio = document.querySelectorAll('.sodio');
    let elementosVD = document.querySelectorAll('.vd');
    let elementosPorcao = document.querySelector('#porcaoTabela');

    // Função para arredondar e adicionar unidades
    function formatarEAdicionarUnidade(elementos, unidade) {
        elementos.forEach(function(elemento) {
            // Pegando o valor original como string
            let valorOriginal = elemento.textContent.trim();

            // Encontrar a posição da vírgula ou ponto decimal
            let posDecimal = valorOriginal.indexOf(',');
            if (posDecimal === -1) {
                posDecimal = valorOriginal.indexOf('.');
            }

            // Caso haja mais de duas casas decimais, manter apenas as duas primeiras
            if (posDecimal !== -1 && valorOriginal.length > posDecimal + 3) {
                valorOriginal = valorOriginal.substring(0, posDecimal + 3);
            }

            // Atualizar o conteúdo do elemento com o valor formatado
            elemento.textContent = valorOriginal + unidade;
        });
    }

    function formataValorPorcao(valor,unidade) {
        // Verifica se o valor termina com ",00"
        if (valor.endsWith(',00')) {
            // Remove ",00" do final do valor
            return valor.slice(0, -3);
        }
        // Caso contrário, retorna o valor original
        valor.textContent = valor + unidade;
    }

        formatarEAdicionarUnidade(elementosValorEnergetico, ' kcal');
        formatarEAdicionarUnidade(elementosCarboidratos, ' g');
        formatarEAdicionarUnidade(elementosAcucares, ' g');
        formatarEAdicionarUnidade(elementosProteinas, ' g');
        formatarEAdicionarUnidade(elementosGorduras, ' g');
        formatarEAdicionarUnidade(elementosFibra, ' g');
        formatarEAdicionarUnidade(elementosSodio, ' mg');
        formatarEAdicionarUnidade(elementosVD, ' %');

        formataValorPorcao(elementosPorcao,'g');
}

// Chama a função quando a página estiver carregada
window.onload = arredondarValoresTabela;