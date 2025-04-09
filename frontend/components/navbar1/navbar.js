document.addEventListener("DOMContentLoaded", () => {
  const subMenu = document.getElementById("subMenu");
  window.toggleMenu = function () {
    subMenu.classList.toggle("open-menu");
  };
});
