let deferredPrompt;
const installButton = document.getElementById('installButton');

// Escutar o evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir o mini-infobar de aparecer no mobile
    e.preventDefault();
    // Guardar o evento para que possamos acioná-lo mais tarde
    deferredPrompt = e;
    // Atualizar a interface para mostrar o botão de instalação
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        // Esconder o botão de instalação
        installButton.style.display = 'none';
        // Mostrar o prompt de instalação
        deferredPrompt.prompt();
        // Esperar o usuário responder ao prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação do PWA');
            } else {
                console.log('Usuário rejeitou a instalação do PWA');
            }
            deferredPrompt = null;
        });
    });
});

// Esconder o botão de instalação se o PWA já estiver instalado
window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    console.log('PWA instalado com sucesso');
});
