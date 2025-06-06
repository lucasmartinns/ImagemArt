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

function showCustomConfirm(message) {
  return new Promise((resolve) => {
    const confirmBox = document.getElementById("customConfirm");
    const confirmMessage = document.getElementById("customConfirmMessage");
    const confirmYes = document.getElementById("customConfirmYes");
    const confirmNo = document.getElementById("customConfirmNo");

    confirmMessage.textContent = message;
    confirmBox.classList.add("show");

    confirmYes.onclick = function () {
      confirmBox.classList.remove("show");
      resolve(true);
    };

    confirmNo.onclick = function () {
      confirmBox.classList.remove("show");
      resolve(false);
    };
  });
}
