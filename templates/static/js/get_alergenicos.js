document.getElementById('selectBtnAlergenicos').addEventListener('click', function(){
    fetch('getAlergenicos/')
    .then(response => response.json())
    .then(data => {
        if (data.ListaAlergenicos) {
            const listAlergenicos = document.getElementById('optionsAlergenicos');
            const buscaAlergenico = document.getElementById('search-alergenico-input');

            buscaAlergenico.addEventListener('input', function(){
                const termoBuscado = this.value.toLowerCase();
                listAlergenicos.innerHTML = '';

                data.ListaAlergenicos.forEach(alergenico => {
                    if (alergenico.nomeAlergenico.toLowerCase().includes(termoBuscado)){
                        const item = document.createElement('li');
                        item.textContent = alergenico.nomeAlergenico;
                        listAlergenicos.appendChild(item);
                    }
                });
            
            });
            listAlergenicos.innerHTML = '';

            data.ListaAlergenicos.forEach(alergenico => {
                const item = document.createElement('li');
                item.textContent = alergenico.nomeAlergenico;
                item.dataset.id = alergenico.id;
                listAlergenicos.appendChild(item);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar alergenicos:', error);
    });
});

