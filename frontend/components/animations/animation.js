document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Seleciona elementos com as classes fade-in e fade-in-fixed
  document.querySelectorAll(".fade-in, .fade-in-fixed").forEach((el) => {
    if (el.classList.contains("fade-in-fixed")) {
      // Para elementos fixos, aplica a classe "visible" imediatamente (ou com pequeno atraso)
      setTimeout(() => {
        el.classList.add("visible");
      }, 100);
    } else {
      observer.observe(el);
    }
  });
});
