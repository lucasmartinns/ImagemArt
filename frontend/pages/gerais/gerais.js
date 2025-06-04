document.addEventListener("DOMContentLoaded", function () {
  // Ajuste para 3 carrosseis independentes
  const carousels = [
    {
      element: document.getElementById("carousel-1"),
      dots: document.querySelectorAll("#dots-1 .dot"),
      currentIndex: 0,
    },
    {
      element: document.getElementById("carousel-2"),
      dots: document.querySelectorAll("#dots-2 .dot"),
      currentIndex: 0,
    },
    {
      element: document.getElementById("carousel-3"),
      dots: document.querySelectorAll("#dots-3 .dot"),
      currentIndex: 0,
    },
  ];

  function getCardsToShow() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  window.moveCarousel = function (carouselIndex, direction) {
    const carousel = carousels[carouselIndex];
    const cards = carousel.element.getElementsByClassName("card");
    const cardWidth = cards[0].offsetWidth + 20;
    const cardsToShow = getCardsToShow();
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    // Atualiza índice sem ultrapassar o limite
    carousel.currentIndex = Math.max(
      0,
      Math.min(carousel.currentIndex + direction, maxIndex)
    );
    carousel.element.style.transform = `translateX(-${
      carousel.currentIndex * cardWidth
    }px)`;

    updateDots(carouselIndex, cardsToShow);
  };

  window.setPosition = function (carouselIndex, dotIndex) {
    const carousel = carousels[carouselIndex];
    const cardsToShow = getCardsToShow();
    const cards = carousel.element.getElementsByClassName("card");
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    carousel.currentIndex = Math.min(dotIndex * cardsToShow, maxIndex);
    const cardWidth = cards[0].offsetWidth + 20;
    carousel.element.style.transform = `translateX(-${
      carousel.currentIndex * cardWidth
    }px)`;

    updateDots(carouselIndex, cardsToShow);
  };

  function updateDots(carouselIndex, cardsToShow) {
    const carousel = carousels[carouselIndex];
    const cards = carousel.element.getElementsByClassName("card");
    const totalCards = cards.length;
    const totalDots = Math.ceil(totalCards / cardsToShow);
    const activeDot = Math.floor(carousel.currentIndex / cardsToShow);

    carousel.dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeDot);
      // Esconde dots extras se houver mais dots do que páginas
      dot.style.display = idx < totalDots ? "inline-block" : "none";
    });
  }

  // Atualiza ao redimensionar a tela
  window.addEventListener("resize", function () {
    carousels.forEach((carousel, idx) => {
      const cardsToShow = getCardsToShow();
      const cards = carousel.element.getElementsByClassName("card");
      const totalCards = cards.length;
      const maxIndex = Math.max(0, totalCards - cardsToShow);

      if (carousel.currentIndex > maxIndex) {
        carousel.currentIndex = maxIndex;
      }
      carousel.element.style.transform = `translateX(-${
        carousel.currentIndex * (cards[0].offsetWidth + 20)
      }px)`;
      updateDots(idx, cardsToShow);
    });
  });

  // Inicialização
  carousels.forEach((carousel, idx) => {
    updateDots(idx, getCardsToShow());
  });
});
