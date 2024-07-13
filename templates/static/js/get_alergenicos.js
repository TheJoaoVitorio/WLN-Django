document.getElementById('selectBtnAlergenicos').addEventListener('click', function(){
    fetch('getAlergenicos/')
    .then(response => response.json())
    .then(data => {
        if (data.ListaAlergenicos) {
            const listAlergenicos = document.getElementById('optionsAlergenicos');
            listAlergenicos.innerHTML = '';

            data.ListaAlergenicos.forEach(alergenico => {
                const item = document.createElement('li');
                item.textContent = alergenico.nomeAlergenico;
                listAlergenicos.appendChild(item);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar alergenicos:', error);
    });
});