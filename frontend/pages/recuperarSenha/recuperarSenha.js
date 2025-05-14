document
  .getElementById("recuperarSenhaForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch("/recuperar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        showCustomAlert(
          "Email de recuperação enviado! Verifique sua caixa de entrada."
        );
        setTimeout(() => {
          window.location.href = "/home";
        }, 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showCustomAlert(error.message);
    }
  });
