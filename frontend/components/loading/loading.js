function showLoading() {
  let loader = document.getElementById("globalLoading");
  if (!loader) {
    // Se não existir, cria dinamicamente
    loader = document.createElement("div");
    loader.id = "globalLoading";
    loader.className = "loading-container";
    loader.innerHTML = `
      <div class="loader">
        <div class="inner one"></div>
        <div class="inner two"></div>
        <div class="inner three"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }
  loader.classList.add("show");
}

function hideLoading() {
  const loader = document.getElementById("globalLoading");
  if (loader) loader.classList.remove("show");
}

window.showLoading = function () {
  let loader = document.getElementById("globalLoading");
  if (!loader) return;
  loader.classList.add("show");
  document.body.classList.add("no-scroll"); // adiciona classe
};

window.hideLoading = function () {
  let loader = document.getElementById("globalLoading");
  if (!loader) return;
  loader.classList.remove("show");
  document.body.classList.remove("no-scroll"); // remove classe
};
