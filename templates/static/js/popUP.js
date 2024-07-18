document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioContateNos');
    const loadingElements = document.getElementsByClassName('spinner-background');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            const assunto = document.getElementById('assunto-contate-nos').value;
            const mensagem = document.getElementById('mensagemContate-nos').value;
            
            if (assunto && mensagem) {
                console.log("loading");
                if (loadingElements.length > 0) {
                    const loading = loadingElements[0];
                    loading.style.display = 'flex';
                }
            } else {
                event.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }
});