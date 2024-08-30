const reiprimirReceitaForm = document.querySelector('#reiprimirReceita');
reiprimirReceitaForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const form = event.target;
    const dadosForm = new FormData(form);

    const url = form.action; 

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: dadosForm
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        let reimpressao = window.open('', '_blank');
        reimpressao.document.open();
        reimpressao.document.write(html);
        reimpressao.document.close();

        
        reimpressao.onload = async function() {
            reimpressao.resizeTo(screen.width, screen.height);
            reimpressao.print();
        };
        
    } catch (error) {
        console.error('Erro ao enviar os valores dos alergenicos: ', error);
    }
});
