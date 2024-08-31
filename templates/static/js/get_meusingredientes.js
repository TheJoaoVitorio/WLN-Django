document.getElementById('MeusIngredientesCheck').addEventListener('change', function(){
    if (this.checked){
        fetch('getMeusIngredientes/')
        .then(response => response.json())
        .then(data => {
            if (data.MeusIngredientesList){
                const ListaIngredientes = document.getElementById('optionsIngredientes');//ul para add as li
                const inputField = document.getElementById('');//search 

                inputField.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    ListaIngredientes.innerHTML = '';
                    data.MeusIngredientesList.forEach(ingrediente => {
                       
                        console.log(nomeExibido)
                        
                        if (nomeExibido.toLowerCase().includes(searchTerm)) {
                            if (nomeExibido.length > 10){
                                nomeExibido = nomeExibido.substring(0, 10) + '...'; 
                            }
                            
                            const item = document.createElement('li');
                            item.textContent = nomeExibido;
                            item.dataset.idIngrediente = ingrediente.id;
                            ListaIngredientes.appendChild(item);
                        }
                    });
                });

                // Inicializa a lista com todos os ingredientes
                ListaIngredientes.innerHTML = '';
                data.MeusIngredientesList.forEach(ingrediente =>{
                    let nomeExibido = ingrediente.nomeIngrediente;
                    
                    if (nomeExibido.length > 10) {
                        nomeExibido = nomeExibido.substring(0, 10) + '...';
                    }
                
                    const item = document.createElement('li');
                    item.textContent = nomeExibido;
                    item.dataset.idIngrediente = ingrediente.id;
                    ListaIngredientes.appendChild(item);
                    console.log(item.idIngrediente)
                    
                });
            } else if (data.erro){
                alert(data.erro);
            }
        });
    } else {
        getBaseIngredientes();
    }
});