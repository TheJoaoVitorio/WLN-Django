const formEmail = document.querySelector('#cadastroLoginForm');
const inputEmail = document.querySelector('#emailCriarConta');
const messageResult = document.querySelector('#mensagemErroValidacao');

inputEmail.addEventListener("input", function() {
    const email = inputEmail.value;
    const isValid = validaEmail(email);

    if (isValid) {
        inputEmail.classList.remove('input-email-error');
        messageResult.innerHTML = '';
    } else {
        inputEmail.classList.add('input-email-error');
        messageResult.innerHTML = `<p id="msgValidaEmail"><img width="12px" src="${exclamationImgUrl}" alt="">
                                   Email inválido!</p>`;
    }
});

formEmail.addEventListener("submit", function(event){
    event.preventDefault();

    const email = inputEmail.value;
    const isValid = validaEmail(email);

    if (isValid){
        formEmail.submit();
    }
});

const validaEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
