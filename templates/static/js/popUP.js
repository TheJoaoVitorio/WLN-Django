function mostrarPopup() {
    var assunto = document.getElementById('assunto-contate-nos').value;
    var mensagem = document.getElementById('mensagemContate-nos').value;
    var popup = document.getElementById('popup');

    // Verificar se os campos foram preenchidos
    if (assunto.trim() !== '' && mensagem.trim() !== '') {
      popup.style.display = 'block'; // Mostrar o popup
      console.log('passei aqui');
    };
  }

  function fecharPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none'; // Esconder o popup
}

function mostrarPopup2(){
    var popup = document.getElementById('popup');
    var senha = document.getElementById('input-senha-atual').value;
    var novaSenha = document.getElementById('input-nova-senha').value;

    if (senha.trim() !== '' && novaSenha.trim() !== ''){
        popup.style.display = 'block';
    };
}