document.addEventListener('DOMContentLoaded', function() {
    // Select all alert elements
    var alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        // Set a timeout to hide each alert after 3 seconds
        setTimeout(function() {
            alert.style.opacity = 0; // Fade out effect
            setTimeout(function() {
                alert.remove(); // Remove from DOM
            }, 600); // Wait for the fade-out effect to complete
        }, 2000); // 3000 milliseconds = 3 seconds
    });
});