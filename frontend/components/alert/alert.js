function showCustomAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("customAlertMessage");
  const alertButton = document.getElementById("customAlertButton");

  alertMessage.textContent = message;
  alertBox.classList.add("show");

  alertButton.onclick = function () {
    alertBox.classList.remove("show");
  };
}
