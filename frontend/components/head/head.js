document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/head/head.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o arquivo head.html");
      }
      return response.text();
    })
    .then((data) => {
      document.head.innerHTML += data;
    })
    .catch((error) => console.error("Erro ao carregar o head:", error));
});
