document.addEventListener('DOMContentLoaded', function() {
    const ListaAlergenicos = document.getElementById('optionsAlergenicos');
    const AlergenicosDaReceita = document.querySelector('.table-alergenicos table tbody');
    const ListaAlergenicosTabela = document.querySelector('.listaAlergenicosTabela'); // tabela do step4 

    let ListaAlergenicosTotais = []; // lista de todos alergenicos que o usuario

    ListaAlergenicos.addEventListener('click', function(event) {
        const li = event.target;
        if (li.tagName === 'LI') {
            const NomeAlergenico = li.textContent;
            const idLinha = `linha-${Date.now()}`; // Gerar um ID único para cada linha da tabela
            adicionarAlergenicosReceita(NomeAlergenico, idLinha);
            adicionarAlergenicoAListaReceita(NomeAlergenico, idLinha);
            ListaAlergenicosTotais.push({ nome: NomeAlergenico, id: idLinha }); // Adicionar ao array
            console.log(ListaAlergenicosTotais); // Visualizar o array atualizado
        }
    });

    function adicionarAlergenicosReceita(nome, idLinha) {
        const NovaLinha = AlergenicosDaReceita.insertRow();
        NovaLinha.id = idLinha;
        const NomeAlergenico = NovaLinha.insertCell(0);
        const DeleteAlergenico = NovaLinha.insertCell(1);

        NomeAlergenico.textContent = nome;
        DeleteAlergenico.innerHTML = `<button class="btnApagarAlergenico" id="btnApagarIng" class="btnApagarIng"> <img width="35px" src="${apagarReceitaImgUrl}"></button>`;

        const RemoverAlergenico = DeleteAlergenico.querySelector('.btnApagarAlergenico');
        RemoverAlergenico.addEventListener('click', function() {
            NovaLinha.remove();
            removeAlergenicoListaReceita(idLinha);
        });
    };

    function adicionarAlergenicoAListaReceita(nomeAlergenico, idLinha) {
        const h3 = document.createElement('h3');
        const alergenicosExistentes = ListaAlergenicosTabela.getElementsByTagName('h3');

        h3.textContent = nomeAlergenico;
        h3.id = `nome-${idLinha}`; // Associar o ID da linha ao elemento h3

        if (alergenicosExistentes.length > 0) {
            alergenicosExistentes[alergenicosExistentes.length - 1].textContent += ',';
        }

        ListaAlergenicosTabela.appendChild(h3);
    };

    function removeAlergenicoListaReceita(idLinha) {
        const h3Remover = document.getElementById(`nome-${idLinha}`);
        if (h3Remover) {
            const nextSibling = h3Remover.nextSibling;
            h3Remover.remove();
            
            // Remover a vírgula do último elemento, se for o caso
            if (nextSibling && nextSibling.tagName === 'H3' && nextSibling.textContent.startsWith(', ')) {
                nextSibling.textContent = nextSibling.textContent.slice(2);
            } else {
                const alergenicosRestantes = ListaAlergenicosTabela.getElementsByTagName('h3');
                if (alergenicosRestantes.length > 0) {
                    alergenicosRestantes[alergenicosRestantes.length - 1].textContent = alergenicosRestantes[alergenicosRestantes.length - 1].textContent.replace(/, $/, '');
                }
            }

            // Remover o alérgeno do array ListaAlergenicosTotais
            const index = ListaAlergenicosTotais.findIndex(alergenico => alergenico.id === idLinha);
            if (index !== -1) {
                ListaAlergenicosTotais.splice(index, 1);
            }
            console.log(ListaAlergenicosTotais); // Visualizar o array atualizado
        }
    }
});
