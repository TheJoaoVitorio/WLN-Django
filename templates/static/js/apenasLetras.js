function ApenasLetras(e, t) {
    try {
        var charCode;
        if (window.event) {
            charCode = window.event.keyCode;
        } else if (e) {
            charCode = e.which;
        } else {
            return true;
        }
        
        // Permitir letras maiúsculas e minúsculas (A-Z, a-z), espaço (32) e acentuação (192-255)
        if ((charCode >= 65 && charCode <= 90) || // Letras maiúsculas
            (charCode >= 97 && charCode <= 122) || // Letras minúsculas
            charCode == 32 || // Espaço
            (charCode >= 192 && charCode <= 255)) { // Letras acentuadas
            return true;
        } else {
            return false;
        }
    } catch (err) {
        alert(err.Description);
    }
}
