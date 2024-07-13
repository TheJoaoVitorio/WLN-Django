// Função para calcular os valores nutricionais totais
function calcularValoresNutricionais(dadosNutricionais, ingredientes) {
    let valoresTotais = {
        valorEnergetico: 0,
        carboidratos: 0,
        acuAdicionais: 0,
        acuTotais: 0,
        proteinas: 0,
        gordTotais: 0,
        gordSaturadas: 0,
        gordTrans:0,
        fibras: 0,
        sodio: 0
    };

    ingredientesEscolhidos.forEach(ingrediente => {
        let dadosIngrediente = dadosNutricionais.find(d => d.nome === ingrediente.nome);
        let quantidade = parseFloat(ingrediente.quantidade);

        valoresTotais.valorEnergetico += dadosIngrediente.valorEnergetico * quantidade;
        valoresTotais.carboidratos    += dadosIngrediente.carboidratos    * quantidade;
        valoresTotais.acuAdicionais   += dadosIngrediente.acuAdicionais   * quantidade;
        valoresTotais.acuTotais       += dadosIngrediente.acuTotais       * quantidade;
        valoresTotais.proteinas       += dadosIngrediente.proteinas       * quantidade;
        valoresTotais.gordTotais      += dadosIngrediente.gordTotais      * quantidade;
        valoresTotais.gordSaturadas   += dadosIngrediente.gordSaturadas   * quantidade;
        valoresTotais.gordTrans       += dadosIngrediente.gordTrans       * quantidade;
        valoresTotais.fibras          += dadosIngrediente.fibras          * quantidade;
        valoresTotais.sodio           += dadosIngrediente.sodio           * quantidade;
        
        console.log(valoresTotais.valorEnergetico);
    });

    return valoresTotais;
}

document.addEventListener('DOMContentLoaded', function(){
    var inputPorcao = document.getElementById('porcao');
    var inputPorcoesEmbaladas = document.getElementById('porcoesEmbaladas');
    var inputMedidaCaseira = document.getElementById('medidaCaseira');

    function atualizarTabelaComInformacoesDoUsuario() {
        var porcao = inputPorcao.value;
        var porcoesPorEmbalagem = inputPorcoesEmbaladas.value;
        var MedidaCaseira = inputMedidaCaseira.value;

        document.getElementById('porcoesEmbTabela').textContent = porcoesPorEmbalagem;
        document.getElementById('porcaoTabela').textContent = porcao + 'g';
        document.getElementById('medidaCaseiraTabela').textContent = ' (' + MedidaCaseira + ')';
   
        //console.log('Porção:',porcao);
        //console.log('Porçoes embaladas: ',porcoesPorEmbalagem);
        //console.log('Medida caseira: ', MedidaCaseira);
    }

    inputPorcao.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
    inputPorcoesEmbaladas.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
    inputMedidaCaseira.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
});

// Função para atualizar a tabela HTML com os valores calculados
function atualizarTabelaHTML(valoresTotais) {
    // ... (implementação da função de atualização da tabela)
    document.querySelector('.tabela-nutricional tbody tr:nth-child(1) td:nth-child(3)').textContent = valoresTotais.valorEnergetico.toFixed(2) + ' kcal';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(2) td:nth-child(3)').textContent = valoresTotais.carboidratos.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(3) td:nth-child(3)').textContent = valoresTotais.acucaresTotais.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(4) td:nth-child(3)').textContent = valoresTotais.acucaresAdicionados.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(5) td:nth-child(3)').textContent = valoresTotais.proteinas.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(6) td:nth-child(3)').textContent = valoresTotais.gordurasTotais.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(7) td:nth-child(3)').textContent = valoresTotais.gordurasSaturadas.toFixed(2) + ' g';
    document.querySelector('.tabela-nutricional tbody tr:nth-child(8) td:nth-child(3)').textContent = valoresTotais.gordurasTrans.toFixed(2) + ' g'; 
    document.querySelector('.tabela-nutricional tbody tr:nth-child(8) td:nth-child(3)').textContent = valoresTotais.fibras.toFixed(2) + ' g';  
    document.querySelector('.tabela-nutricional tbody tr:nth-child(8) td:nth-child(3)').textContent = valoresTotais.sodio.toFixed(2) + ' mg';
    
}

document.getElementById('CriandoReceita').addEventListener('submit', function(event){
    event.preventDefault(); // Impede o envio padrão do formulário

    const ingredientesEscolhidos = coletarIngredientesDaTabela();

    buscarDadosNutricionais(ingredientesEscolhidos.map(i => i.nome), function(dadosNutricionais) {
        let valoresTotais = calcularValoresNutricionais(dadosNutricionais, ingredientesEscolhidos);
        atualizarTabelaHTML(valoresTotais);
    });
});
