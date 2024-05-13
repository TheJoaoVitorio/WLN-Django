document.getElementById('cadastroLoginForm').addEventListener('submit', function(event){
    var senha = document.getElementById('senhaLoginForm').value;
    var confirmarSenha = document.getElementById('confSenhaLoginForm').value;

    if (senha !== confirmarSenha){
        alert('As senhas não coincidem!');
        event.preventDefault();
    }
});