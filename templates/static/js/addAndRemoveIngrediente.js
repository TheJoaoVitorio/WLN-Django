document.addEventListener('DOMContentLoaded', function() {
    const ListaIngredientes = document.getElementById('optionsIngredientes');
    const IngredientesDaReceita = document.querySelector('.table-ingredientes-da-receita table tbody');
    let valoresIngredientes = []; // array que armazena os ingredientes
    
    ListaIngredientes.addEventListener('click', function(event) {
        const li = event.target;
    
        if (li.tagName === 'LI') {
            const NomeIngrediente = li.textContent;
            const idLinha = `linha-${Date.now()}`; // Gerar um ID único para cada linha da tabela
            
            getValoresIngredientes(NomeIngrediente)
                .then(valores => {
                    valoresIngredientes.push({
                        Id: valores.id,
                        NomeIngrediente: valores.Ingrediente,
                        Carboidratos: valores.Carboidratos,
                        AcucaresTotais: valores.AcucaresTotais,
                        AcucaresAdicionais: valores.AcucaresAdicionais,
                        Proteinas: valores.Proteinas,
                        GordurasTotais: valores.GordurasTotais,
                        GordurasSaturadas: valores.GordurasSaturadas,
                        GordurasTrans: valores.GordurasTrans,
                        Fibra: valores.Fibra,
                        Sodio: valores.Sodio,
                        Quantidade: '',
                        idLinha: idLinha // Associar o ID da linha ao ingrediente
                    });

                    adicionarIngredienteReceita(NomeIngrediente, idLinha); // Adicionar na tabela HTML
                    
                    console.log(valoresIngredientes); // Exemplo de como você pode visualizar os valores armazenados
                })
                .catch(error => {
                    console.error(`Erro ao obter valores para ${NomeIngrediente}: ${error}`);
                });
        }
    });

    function adicionarIngredienteReceita(nome, idLinha) {
        const NovaLinha = IngredientesDaReceita.insertRow();
        NovaLinha.id = idLinha;

        const NomeIng = NovaLinha.insertCell(0);
        const QtdIng = NovaLinha.insertCell(1);
        const DeleteIng = NovaLinha.insertCell(2);

        NomeIng.textContent = nome;
        QtdIng.innerHTML = `<div class="qtdIngredienteInput flex">
                                <label for="qtdDoIngredienteReceita">Qtd(g/ml)</label>
                                <input class="qtdDoIngredienteReceita" type="text">
                            </div>`;
        DeleteIng.innerHTML = `<button id="btnApagarIng" class="btnApagarIng"> <img width="35px" src="${apagarReceitaImgUrl}"></button>`;

        // Adicionar evento para capturar quantidade quando o usuário a inserir
        const qtdInput = QtdIng.querySelector('.qtdDoIngredienteReceita');
        qtdInput.addEventListener('input', function() {
            const quantidade = qtdInput.value;
            // Atualizar a quantidade no array valoresIngredientes
            const index = valoresIngredientes.findIndex(ingrediente => ingrediente.idLinha === idLinha);
            if (index !== -1) {
                valoresIngredientes[index].Quantidade = quantidade;
                console.log(valoresIngredientes); // Verificar se a quantidade foi atualizada corretamente
            }
        });

        const RemoverIng = DeleteIng.querySelector('.btnApagarIng');
        RemoverIng.addEventListener('click', function() {
            const linhaRemover = document.getElementById(idLinha);
            linhaRemover.remove();
            
            // Remover o ingrediente da lista valoresIngredientes
            const index = valoresIngredientes.findIndex(ingrediente => ingrediente.idLinha === idLinha);
            if (index !== -1) {
                valoresIngredientes.splice(index, 1);
                console.log(valoresIngredientes);
            }
        });
    }

    function getValoresIngredientes(NomeIngrediente) {
        const url = `getValoresIngrediente/${encodeURIComponent(NomeIngrediente)}/`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();  
            });
    }
});
