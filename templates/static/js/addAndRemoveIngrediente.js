document.addEventListener('DOMContentLoaded', function() {
    const ListaIngredientes = document.getElementById('optionsIngredientes');
    const IngredientesDaReceita = document.querySelector('.table-ingredientes-da-receita table tbody');
    const ListaIngredientesTabela = document.querySelector('.listaIngredientesTabela');
    
    let valoresIngredientes = [];
    
    ListaIngredientes.addEventListener('click', function(event) {
        const li = event.target;
    
        if (li.tagName === 'LI') {
            const NomeIngrediente = li.textContent;
            const idIngrediente = li.dataset.idIngrediente;
            const idLinha = `linha-${Date.now()}`;
            
            getValoresIngredientes(idIngrediente)
                .then(valores => {
                    valoresIngredientes.push({
                        Id: valores.id,
                        NomeIngrediente: valores.Ingrediente,
                        ValorEnergetico: valores.ValorEnergetico,
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
                        idLinha: idLinha
                    });

                    adicionarIngredienteReceita(NomeIngrediente, idLinha);
                    adicionarNomeIngrediente(NomeIngrediente, idLinha);
                    
                    console.log(valoresIngredientes);
                    calcularTabelaNutricional(); // Calcular a tabela nutricional após adicionar o ingrediente
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

        const qtdInput = QtdIng.querySelector('.qtdDoIngredienteReceita');
        qtdInput.addEventListener('input', function() {
            const quantidade = qtdInput.value;
            const index = valoresIngredientes.findIndex(ingrediente => ingrediente.idLinha === idLinha);
            if (index !== -1) {
                valoresIngredientes[index].Quantidade = quantidade;
                console.log(valoresIngredientes);
                calcularTabelaNutricional(); // Calcular a tabela nutricional após atualizar a quantidade
            }
        });

        const RemoverIng = DeleteIng.querySelector('.btnApagarIng');
        RemoverIng.addEventListener('click', function() {
            const linhaRemover = document.getElementById(idLinha);
            linhaRemover.remove();
            
            const index = valoresIngredientes.findIndex(ingrediente => ingrediente.idLinha === idLinha);
            if (index !== -1) {
                valoresIngredientes.splice(index, 1);
                removerNomeIngrediente(idLinha);
                console.log(valoresIngredientes);
                calcularTabelaNutricional(); // Calcular a tabela nutricional após remover o ingrediente
            }
        });
    }

    function adicionarNomeIngrediente(nome, idLinha) {
        const h3 = document.createElement('h3');
        const ingredientesExistentes = ListaIngredientesTabela.getElementsByTagName('h3');

        h3.textContent = nome;
        h3.id = `nome-${idLinha}`;

        if (ingredientesExistentes.length > 0) {
            ingredientesExistentes[ingredientesExistentes.length - 1].textContent += ',';
        }

        ListaIngredientesTabela.appendChild(h3);
    }

    function removerNomeIngrediente(idLinha) {
        const h3Remover = document.getElementById(`nome-${idLinha}`);
        if (h3Remover) {
            const nextSibling = h3Remover.nextSibling;
            h3Remover.remove();
            
            if (nextSibling && nextSibling.tagName === 'H3' && nextSibling.textContent.startsWith(', ')) {
                nextSibling.textContent = nextSibling.textContent.slice(2);
            } else {
                const ingredientesRestantes = ListaIngredientesTabela.getElementsByTagName('h3');
                if (ingredientesRestantes.length > 0) {
                    ingredientesRestantes[ingredientesRestantes.length - 1].textContent = ingredientesRestantes[ingredientesRestantes.length - 1].textContent.replace(/, $/, '');
                }
            }
        }
    }

    async function getValoresIngredientes(idIngrediente) {
        const url = `getValoresIngrediente/${idIngrediente}`;
        return await fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();  
            });
    }

    function calcularTabelaNutricional() {

        let totais = {
            ValorEnergetico: 0,
            Carboidratos: 0,
            AcucaresTotais: 0,
            AcucaresAdicionais: 0,
            Proteinas: 0,
            GordurasTotais: 0,
            GordurasSaturadas: 0,
            GordurasTrans: 0,
            Fibra: 0,
            Sodio: 0
        };
        
        const VD = {
            ValorEnergetico : 2000,
            Carboidratos: 300,
            AcucaresAdicionais: 50,
            Proteinas: 75,
            GordurasTotais: 55,
            GordurasSaturadas: 22,
            Fibra: 25,
            Sodio: 2400
        };

        valoresIngredientes.forEach(ingrediente => {
            const quantidade = parseFloat(ingrediente.Quantidade) || 0;

            totais.ValorEnergetico    += (ingrediente.ValorEnergetico * quantidade) / 100;
            totais.Carboidratos       += (ingrediente.Carboidratos * quantidade) / 100;
            totais.AcucaresTotais     += (ingrediente.AcucaresTotais * quantidade) / 100;
            totais.AcucaresAdicionais += (ingrediente.AcucaresAdicionais * quantidade) / 100;
            totais.Proteinas          += (ingrediente.Proteinas * quantidade) / 100;
            totais.GordurasTotais     += (ingrediente.GordurasTotais * quantidade) / 100;
            totais.GordurasSaturadas  += (ingrediente.GordurasSaturadas * quantidade) / 100;
            totais.GordurasTrans      += (ingrediente.GordurasTrans * quantidade) / 100;
            totais.Fibra              += (ingrediente.Fibra * quantidade) / 100;
            totais.Sodio              += (ingrediente.Sodio * quantidade) / 100;
        });
        console.log(totais.ValorEnergetico);

        //calculo pela porcao do usuario 
        let totaisPorcao = {
            ValorEnergetico: 0,
            Carboidratos: 0,
            AcucaresTotais: 0,
            AcucaresAdicionais: 0,
            Proteinas: 0,
            GordurasTotais: 0,
            GordurasSaturadas: 0,
            GordurasTrans: 0,
            Fibra: 0,
            Sodio: 0
        };
        
        const porcao = parseFloat(document.getElementById('porcao').value) || 0;

        if (porcao > 0) {
            valoresIngredientes.forEach(valorIngrediente => {
                //const qtd = parseFloat(valorIngrediente.Quantidade) || 0;
                
                totaisPorcao.ValorEnergetico    += (valorIngrediente.ValorEnergetico * porcao) / 100;
                totaisPorcao.Carboidratos       += (valorIngrediente.Carboidratos * porcao) / 100;
                totaisPorcao.AcucaresTotais     += (valorIngrediente.AcucaresTotais * porcao) / 100;
                totaisPorcao.AcucaresAdicionais += (valorIngrediente.AcucaresAdicionais * porcao) / 100;
                totaisPorcao.Proteinas          += (valorIngrediente.Proteinas * porcao) / 100;
                totaisPorcao.GordurasTotais     += (valorIngrediente.GordurasTotais * porcao) / 100;
                totaisPorcao.GordurasSaturadas  += (valorIngrediente.GordurasSaturadas * porcao) / 100;
                totaisPorcao.GordurasTrans      += (valorIngrediente.GordurasTrans * porcao) / 100;
                totaisPorcao.Fibra              += (valorIngrediente.Fibra * porcao) / 100;
                totaisPorcao.Sodio              += (valorIngrediente.Sodio * porcao) / 100;
            });
            console.log('Totais por Porção: ', totaisPorcao);
        } else {
            console.error('Valor da porção é inválido');
        }


        const tabelaNutricional = document.querySelector('.tabela-nutricional table tbody');

        tabelaNutricional.querySelector('tr:nth-child(1) td:nth-child(2)').textContent = `${totais.ValorEnergetico.toFixed(2)}kcal`;
        tabelaNutricional.querySelector('tr:nth-child(2) td:nth-child(2)').textContent = `${totais.Carboidratos.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(3) td:nth-child(2)').textContent = `${totais.AcucaresTotais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(4) td:nth-child(2)').textContent = `${totais.AcucaresAdicionais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(5) td:nth-child(2)').textContent = `${totais.Proteinas.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(6) td:nth-child(2)').textContent = `${totais.GordurasTotais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(7) td:nth-child(2)').textContent = `${totais.GordurasSaturadas.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(8) td:nth-child(2)').textContent = `${totais.GordurasTrans.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(9) td:nth-child(2)').textContent = `${totais.Fibra.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(10) td:nth-child(2)').textContent = `${totais.Sodio.toFixed(2)}mg`;

        tabelaNutricional.querySelector('tr:nth-child(1) td:nth-child(3)').textContent = `${totaisPorcao.ValorEnergetico.toFixed(2)}kcal`;
        tabelaNutricional.querySelector('tr:nth-child(2) td:nth-child(3)').textContent = `${totaisPorcao.Carboidratos.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(3) td:nth-child(3)').textContent = `${totaisPorcao.AcucaresTotais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(4) td:nth-child(3)').textContent = `${totaisPorcao.AcucaresAdicionais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(5) td:nth-child(3)').textContent = `${totaisPorcao.Proteinas.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(6) td:nth-child(3)').textContent = `${totaisPorcao.GordurasTotais.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(7) td:nth-child(3)').textContent = `${totaisPorcao.GordurasSaturadas.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(8) td:nth-child(3)').textContent = `${totaisPorcao.GordurasTrans.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(9) td:nth-child(3)').textContent = `${totaisPorcao.Fibra.toFixed(2)}g`;
        tabelaNutricional.querySelector('tr:nth-child(10) td:nth-child(3)').textContent = `${totaisPorcao.Sodio.toFixed(2)}mg`;

        // Cálculo dos valores diários
        tabelaNutricional.querySelector('tr:nth-child(1) td:nth-child(4)').textContent = `${((totais.ValorEnergetico / VD.ValorEnergetico) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(2) td:nth-child(4)').textContent = `${((totais.Carboidratos / VD.Carboidratos) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(4) td:nth-child(4)').textContent = `${((totais.AcucaresAdicionais / VD.AcucaresAdicionais) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(5) td:nth-child(4)').textContent = `${((totais.Proteinas / VD.Proteinas) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(6) td:nth-child(4)').textContent = `${((totais.GordurasTotais / VD.GordurasTotais) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(7) td:nth-child(4)').textContent = `${((totais.GordurasSaturadas / VD.GordurasSaturadas) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(9) td:nth-child(4)').textContent = `${((totais.Fibra / VD.Fibra) * 100).toFixed(2)}%`;
        tabelaNutricional.querySelector('tr:nth-child(10) td:nth-child(4)').textContent = `${((totais.Sodio / VD.Sodio) * 100).toFixed(2)}%`;
    }
});
