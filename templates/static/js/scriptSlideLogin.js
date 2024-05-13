function mudarSlide() {
    var slides = document.querySelectorAll('#carousel .item');
    var radios = document.querySelectorAll('[name="position"]');
    var currentIndex = 0;

    // Encontrar o índice do slide atual
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        currentIndex = i;
        break;
      }
    }

    // Desmarcar o slide atual e marcar o próximo
    radios[currentIndex].checked = false;
    currentIndex = (currentIndex + 1) % slides.length;
    radios[currentIndex].checked = true;
  }

  // temporizador para mudar os slides a cada 5 segundos (5000 milissegundos)
  setInterval(mudarSlide, 5000);
