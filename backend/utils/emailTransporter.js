const nodemailer = require("nodemailer");

exports.emailTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,

  auth: {
    user: "7e8bcd6678c719",
    pass: "c53a04437f7a56",
  },
});
