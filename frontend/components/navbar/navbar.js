document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((error) => console.error("Erro ao carregar a navbar:", error));
});
