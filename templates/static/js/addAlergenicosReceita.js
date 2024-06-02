document.addEventListener('DOMContentLoaded', function(){
    const ListaAlergenicos = document.getElementById('optionsAlergenicos');
    const AlergenicosDaReceita = document.querySelector('.table-alergenicos table tbody');
    
    ListaAlergenicos.addEventListener('click', function(event){
        const li = event.target;
        if (li.tagName === 'LI'){
            const NomeAlergenico = li.textContent;
            adicionarAlergenicosReceita(NomeAlergenico);
        }
    });

    function adicionarAlergenicosReceita(nome){
        const NovaLinha = AlergenicosDaReceita.insertRow();
        const NomeAlergenico = NovaLinha.insertCell(0);
        const DeleteAlergenico = NovaLinha.insertCell(1);

        NomeAlergenico.textContent = nome;
        DeleteAlergenico.innerHTML = `<button class="btnApagarAlergenico" id="btnApagarIng" class="btnApagarIng" > <img width="35px" src="${apagarReceitaImgUrl}"></button>`;

        const RemoverAlergenico = DeleteAlergenico.querySelector('.btnApagarAlergenico');
        RemoverAlergenico.addEventListener('click', function(){
            NovaLinha.remove();
        });

    }
});