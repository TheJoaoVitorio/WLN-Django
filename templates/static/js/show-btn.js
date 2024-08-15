function toggleText(button) {
    const textContainer = button.parentElement;
    const receitaNome = button.getAttribute('data-receita');    
    const fullTextElement = textContainer.querySelector('.full-text');
    const truncatedTextElement = textContainer.querySelector('.truncated-text');
    const receitaNomeElement = textContainer.querySelector('.receita-nome');

    const imgOpen = button.getAttribute('data-img-open');
    const imgClosed = button.getAttribute('data-img-closed');

    textContainer.classList.toggle('show-full');

    if (textContainer.classList.contains('show-full')) {
        fullTextElement.classList.add('show');
        truncatedTextElement.classList.add('hide');
        fullTextElement.style.display = 'inline';
        truncatedTextElement.style.display = 'none';
        button.innerHTML = `<img id="tresbtn" src="${imgOpen}" alt="Mostrar menos">`;
        receitaNomeElement.textContent = receitaNome;
        receitaNomeElement.style.display = 'block';
    } else {
        fullTextElement.classList.remove('show');
        truncatedTextElement.classList.remove('hide');
        fullTextElement.style.display = 'none';
        truncatedTextElement.style.display = 'inline';
        button.innerHTML = `<img id="tresbtn" src="${imgClosed}" alt="Mostrar mais">`;
        receitaNomeElement.style.display = 'none';
    }
}   