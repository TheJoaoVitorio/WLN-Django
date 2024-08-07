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
        
        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 32) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        alert(err.Description);
    }
}
