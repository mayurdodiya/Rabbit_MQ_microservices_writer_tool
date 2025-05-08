const { log } = require("wt-lib/logger.lib");
const templates = require("./mail.templates");
const { transporter } = require("wt-utils");

log.info("SENDING MAIL FROM: ", process.env.EMAIL_USER);
module.exports = {
  //* Send OTP to user
  sendOTP: async ({ email, otp, userName }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `WriterTools | OTP To Verify Your Email`,
        html: templates.sendOTP({ otp, userName }),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },

  //* Send welcome mail to user
  sendWelcomeMail: async ({ email }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `👋 Welcome to WriterTools`,
        html: templates.welcomMail({}),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },

  // Send email to user for change password
  changePasswordInformedMail: async ({ email }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `Your Password Has Been Changed`,
        html: templates.changePasswordInformedMail({}),
      };

      //* send mail
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      log.error("ERROR IN SENDING MAIL", error);
      return { success: false };
    }
  },

  // Send mail to user for forgot password
  sendForgotPassMail: async ({ email, link, userName }) => {
    try {
      //* mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,

        subject: `WritterTools | Reset Your Password`,
        html: templates.sendForgotPassMail({ link, userName }),
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
