document.getElementById('MeusIngredientesCheck').addEventListener('change', function(){
    if (this.checked){
        fetch('getMeusIngredientes/')
        .then(response => response.json())
        .then(data => {
            if (data.MeusIngredientesList){
                const ListaIngredientes = document.getElementById('optionsIngredientes');
                //const inputField = document.querySelector('.search-alergenico-input');
                const inputField = document.getElementById('BuscaIngrediente')

                inputField.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    ListaIngredientes.innerHTML = '';
                    data.MeusIngredientesList.forEach(ingrediente => {
                        if (ingrediente.nomeIngrediente.toLowerCase().includes(searchTerm)) {
                            const item = document.createElement('li');
                            item.textContent = ingrediente.nomeIngrediente;
                            ListaIngredientes.appendChild(item);
                        }
                    });
                });

                // Inicializa a lista com todos os ingredientes
                ListaIngredientes.innerHTML = '';
                data.MeusIngredientesList.forEach(ingrediente =>{
                    const item = document.createElement('li');
                    item.textContent = ingrediente.nomeIngrediente;
                    ListaIngredientes.appendChild(item);
                });
            } else if (data.erro){
                alert(data.erro);
            }
        });
    } else {
        document.getElementById('optionsIngredientes').innerHTML = '';
    }
});
