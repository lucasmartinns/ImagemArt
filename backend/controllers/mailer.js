const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const db = require("../config/database");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./resources/mail/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./resources/mail/"),
  extName: ".html",
};

transporter.use("compile", hbs(handlebarOptions));

const enviarEmailRecuperacao = async (email, token) => {
  try {
    const [user] = await db.query("SELECT * FROM usuario WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return { success: false, error: "Email não cadastrado" };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha - ImagemArt",
      template: "mailTemplate",
      context: {
        resetLink: `${process.env.APP_URL}/redefinir-senha?token=${token}`,
      },
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  enviarEmailRecuperacao,
};
