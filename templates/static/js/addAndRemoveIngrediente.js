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
        QtdIng.innerHTML = '<input type="text" id="qtdDoIngredienteReceita" required>';
        DeleteIng.innerHTML = '<button class="btnApagarIng"> <img width="35px" src="{% static \'img/apagar-receita.png\'%}"></button>';

        const RemoverIng = DeleteIng.querySelector('.btnApagarIng');
        RemoverIng.addEventListener('click', function(){
            NovaLinha.remove();
        });
    }
});