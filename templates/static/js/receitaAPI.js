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
                                <input id="qtdDoIngredienteReceita" class="qtdDoIngredienteReceita" type="text">
                            </div>`;
        DeleteIng.innerHTML = `<button id="btnApagarIng" class="btnApagarIng"> <img width="35px" src="${apagarReceitaImgUrl}"></button>`;
        
        $('#qtdDoIngredienteReceita').mask('000.000.000.000.000,00', {reverse: true});

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

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

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

   

    const porcaoInput = document.getElementById('porcao');
    porcaoInput.addEventListener('input',()=>{
        const porcaoHeaderTabela = document.querySelector('.tabela-nutricional table thead th:nth-child(3)');
        porcaoHeaderTabela.textContent = porcaoInput.value + 'g';
        calcularTabelaNutricional();
    })

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
        //essa tabela é de preview da receita | aqui armazena os valores totais no calculo por 100
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
        //aqui é armazenado os valores , relacionado com os calculos por porção
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
    //ALERGENICOS DA RECEITA
    const ListaAlergenicos = document.getElementById('optionsAlergenicos');
    const AlergenicosDaReceita = document.querySelector('.table-alergenicos table tbody');
    const ListaAlergenicosTabela = document.querySelector('.listaAlergenicosTabela'); 

    let ListaAlergenicosTotais = []; // lista de todos alergenicos

    ListaAlergenicos.addEventListener('click', function(event) {
        const li = event.target;
        if (li.tagName === 'LI') {
            const NomeAlergenico = li.textContent;
            const IdAlergenico = li.dataset.id;
            const idLinha = `linha-${Date.now()}`; // Gera um ID único para cada linha
            adicionarAlergenicosReceita(NomeAlergenico, idLinha);
            adicionarAlergenicoAListaReceita(NomeAlergenico, idLinha);
            ListaAlergenicosTotais.push({ nome: NomeAlergenico, id: idLinha , idAlergenico : IdAlergenico});
            
            console.log(ListaAlergenicosTotais); 
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

    async function postValoresIngredientes(valoresIngredientes) {
        const url = `postIngredientesReceita/`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    ingredientes: valoresIngredientes
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao enviar os valores dos ingredientes:', error);
        }
    }

    async function postAlergenicos(ListaAlergenicosTotais){
        const url = `postAlergenicosReceita/`;

        try{
            const response = await fetch(url,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body : JSON.stringify({
                    alergenicos : ListaAlergenicosTotais
                })
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error){
            console.error('Erro ao enviar os valores dos alergenicos:', error);
        }
    }

    async function getTabelaNutricional(ModeloTabela){
        const url = `getTabelaNutricional/${ModeloTabela}`;

        try{
            const response = await fetch(url,{
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            let janelaImpressao = window.open('', '_blank');
            janelaImpressao.document.write(html);
            janelaImpressao.resizeTo(screen.width, screen.height);
            janelaImpressao.document.close();
            janelaImpressao.print();

            window.location.href = '/app/home/';
        } catch (error){
            console.error('Erro ao enviar os valores dos alergenicos:', error);
        }
    }

    const receitaForm = document.getElementById('CriandoReceita');
    receitaForm.addEventListener('submit', async function(event){
        event.preventDefault();

        const form = event.target;
        const dadosForm = new FormData(form);
        const opcaoModeloReceita = document.getElementById('selectOptionModeloTabela').value;
        
        try{
            const response = await fetch('postReceita/', {
                method: 'POST',
                body: dadosForm,
                headers: {
                  'X-CSRFToken': getCookie('csrftoken') // Adiciona o CSRF token se necessário
                }
              });

            if (!response.ok) {
                throw new Error('Erro na criação da receita');
            }

            const data = await response.json();
            console.log('Receita criada com sucesso');

            await postValoresIngredientes(valoresIngredientes);
            console.log('Ingredientes postados com sucesso');

            await postAlergenicos(ListaAlergenicosTotais);
            console.log('Alergenicos postados com sucesso');

            await getTabelaNutricional(opcaoModeloReceita);
            console.log('GETZADA NA RECEITA');
        
        }catch(error){
            console.error('Error no processo das receitas: ', error);
        }

    })
 
});
