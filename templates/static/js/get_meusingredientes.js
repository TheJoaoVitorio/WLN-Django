document.getElementById('MeusIngredientesCheck').addEventListener('change', function(){
    if (this.checked){
        fetch('getMeusIngredientes/')
        .then(response => response.json())
        .then(data => {
            if (data.MeusIngredientesList){
                const ListaIngredientes = document.getElementById('optionsIngredientes');
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