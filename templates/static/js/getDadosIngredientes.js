// Função para buscar os dados nutricionais dos ingredientes
function buscarDadosNutricionais(ingredientesNomes, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/getDadosIngredientes/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken')); // Função getCookie precisa ser definida

    xhr.onload = function() {
        if (xhr.status === 200) {
            const dadosNutricionais = JSON.parse(xhr.responseText);
            callback(dadosNutricionais); // Chama a função callback com os dados nutricionais
        } else {
            console.error('Erro ao buscar dados nutricionais');
        }
    };

    xhr.send(JSON.stringify({ ingredientes: ingredientesNomes }));
}
