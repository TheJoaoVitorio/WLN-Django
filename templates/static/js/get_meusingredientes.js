document.addEventListener('DOMContentLoaded', function() {
    const checkBox = document.getElementById('MeusIngredientesCheck');
    const ListaIngredientes = document.getElementById('optionsIngredientes');
    const inputField = document.getElementById('searchInput'); // Certifique-se de que o ID está correto

    if (checkBox) {
        checkBox.addEventListener('change', function() {
            if (this.checked) {
                fetch('getMeusIngredientes/')
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Verifique a resposta da API
                    if (data.MeusIngredientesList) {
                        if (inputField) {
                            inputField.addEventListener('input', function() {
                                const searchTerm = this.value.toLowerCase();
                                ListaIngredientes.innerHTML = '';
                                data.MeusIngredientesList.forEach(ingrediente => {
                                    let nomeExibido = ingrediente.nomeIngrediente;

                                    if (nomeExibido.toLowerCase().includes(searchTerm)) {
                                        if (nomeExibido.length > 10) {
                                            nomeExibido = nomeExibido.substring(0, 10) + '...'; 
                                        }

                                        const item = document.createElement('li');
                                        item.textContent = nomeExibido;
                                        item.dataset.idIngrediente = ingrediente.id;
                                        ListaIngredientes.appendChild(item);
                                    }
                                });
                            });
                        } else {
                            console.error('Elemento de busca não encontrado.');
                        }

                        // Inicializa a lista com todos os ingredientes
                        ListaIngredientes.innerHTML = '';
                        data.MeusIngredientesList.forEach(ingrediente => {
                            let nomeExibido = ingrediente.nomeIngrediente;

                            if (nomeExibido.length > 10) {
                                nomeExibido = nomeExibido.substring(0, 10) + '...';
                            }

                            const item = document.createElement('li');
                            item.textContent = nomeExibido;
                            item.dataset.idIngrediente = ingrediente.id;
                            ListaIngredientes.appendChild(item);
                        });
                    } else if (data.erro) {
                        alert(data.erro);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar ingredientes:', error);
                });
            } else {
                getBaseIngredientes(); // Função para exibir a lista base de ingredientes
            }
        });
    } else {
        console.error('Checkbox não encontrado.');
    }
});
