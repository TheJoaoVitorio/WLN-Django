// ADICIONANDO INGREDIENTES NA TABELA (Que no caso seria ingredientes da receita)
document.addEventListener('DOMContentLoaded', function(){
    const ListaIngredientes = document.getElementById('optionsIngredientes');
    const IngredientesDaReceita = document.querySelector('.table-ingredientes-da-receita table tbody');

    ListaIngredientes.addEventListener('click', function(event){
        const li = event.target;
        if (li.tagName === 'LI'){
            const NomeIngrediente = li.textContent;
            adicionarIngredienteReceita(NomeIngrediente);
        }
    });

    function adicionarIngredienteReceita(nome){
        const NovaLinha = IngredientesDaReceita.insertRow();
        const NomeIng = NovaLinha.insertCell(0);
        const QtdIng = NovaLinha.insertCell(1);
        const DeleteIng = NovaLinha.insertCell(2);

        NomeIng.textContent = nome;
        QtdIng.innerHTML = `<div class="qtdIngredienteInput flex">
                                <label for="qtdDoIngredienteReceita">Qtd(g/ml)</label>
                                <input id="qtdDoIngredienteReceita" type="text">
                            </div>`;
        DeleteIng.innerHTML = `<button id="btnApagarIng" class="btnApagarIng" > <img width="35px" src="${apagarReceitaImgUrl}"></button>`;

        const RemoverIng = DeleteIng.querySelector('.btnApagarIng');
        RemoverIng.addEventListener('click', function(){
            NovaLinha.remove();
        });
    }
});