const inputFoto = document.getElementById('fileUpload');
inputFoto.addEventListener('change', () => {
    const form = inputFoto.closest('form');
    form.submit(); 
});