const nodemailer = require("nodemailer");
var log = require("wt-lib").logger.log;

//* create transporter for mail server
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  //* uncomment following line if you are not using ethereal mail server
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//* verify connection configuration for mail server
transporter.verify((error, success) => {
  if (error) {
    log.error("✘ UNABLE TO CONNECT TO THE MAIL SERVER");
    log.error(error);
  } else {
    log.info(`✔ MAIL SERVER IS READY TO SEND MAILS`);
  }
});

module.exports = transporter;
