function getBaseIngredientes (){
    document.getElementById('optionsIngredientes').innerHTML = '';
        fetch('getBaseIngredientes/')
        .then(response => response.json())
        .then(data => {
            if (data.baseIngredientesList){
                const listaBaseIngredientes = document.getElementById('optionsIngredientes');
                const qtdInput = document.getElementById('BuscaIngrediente');

                qtdInput.addEventListener('input', function(){
                    const termoBuscado = this.value.toLowerCase();
                    listaBaseIngredientes.innerHTML = '';
                    data.baseIngredientesList.forEach(ingrediente =>{
                        if (ingrediente.nomeIngrediente.toLowerCase().includes(termoBuscado)){
                            const itemLI = document.createElement('li');
                            itemLI.textContent = ingrediente.nomeIngrediente;
                            listaBaseIngredientes.appendChild(itemLI);
                        }
                    })
                });

                listaBaseIngredientes.innerHTML = '';
                data.baseIngredientesList.forEach(ingrediente =>{
                    const itemLI = document.createElement('li');
                    itemLI.textContent = ingrediente.nomeIngrediente;
                    itemLI.dataset.idIngrediente = ingrediente.id; //pego o id do ingrediente
                    listaBaseIngredientes.appendChild(itemLI);
                });
            } else if (data.erro){
                alert(data.erro);
            }
        })
}
getBaseIngredientes();