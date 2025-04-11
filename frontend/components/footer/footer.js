document.addEventListener("DOMContentLoaded", function () {
    fetch("../components/footer/footer.html") // Carrega o HTML correto
      .then(response => response.text())
      .then(data => {
        document.getElementById("footer-container").innerHTML = data;
      })
      .catch(error => console.error("Erro ao carregar a footer:", error));
});
