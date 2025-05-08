const { log } = require("wt-lib/logger.lib");
const templates = require("./mail.templates");
const { transporter } = require("wt-utils");

log.info("SENDING MAIL FROM: ", process.env.EMAIL_USER);
module.exports = {
  //* send OTP to user
  sendOTP: async ({ email, name, otp }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `Angel-Shares | OTP`,
        text: "One Time Password To Verify Your Account",
        html: templates.sendOTP({ otp, name }),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },

  //* send welcome mail to user
  sendWelcomeMail: async ({ email, name, token }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `Welcome to Angel Shares!`,
        text: "Welcome to Angel Shares!",
        html: templates.sendWelcomeMail({ name, token }),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },
  //* send password to user
  sendPassword: async ({ email, name, password }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `Angel-Shares | Welcome`,
        text: "Welcome To Our Community",
        html: templates.sendPassword({ name, email, password }),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },
};
