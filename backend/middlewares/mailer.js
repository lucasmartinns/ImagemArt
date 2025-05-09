const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;
const path = require("path");

const { host, port, user, pass } = require("../middlewares/mail.json");

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});

// Configuração do handlebars
const handlebarOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve("./resources/mail/"),
    layoutsDir: path.resolve("./resources/mail/"),
    defaultLayout: "",
  },
  viewPath: path.resolve("./resources/mail/"),
  extName: ".html",
};

transport.use("compile", hbs(handlebarOptions));

module.exports = transport;
