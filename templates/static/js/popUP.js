document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#formularioContateNos');
    form.addEventListener('submit', function() {
        document.getElementById('email-form').style.display = 'none';
        document.getElementById('loading-indicator').style.display = 'block';
    });
});