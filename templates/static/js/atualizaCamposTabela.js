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
   
    }

    inputPorcao.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
    inputPorcoesEmbaladas.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
    inputMedidaCaseira.addEventListener('input', atualizarTabelaComInformacoesDoUsuario);
});