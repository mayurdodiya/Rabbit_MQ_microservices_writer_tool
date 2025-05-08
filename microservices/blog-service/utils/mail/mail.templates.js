module.exports = {
  sendOTP: ({ otp, name }) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap" rel="stylesheet" /> -->
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
            rel="stylesheet" />
        <title>first page</title>
    </head>
    <style>
        body {
            font-family: "Inter", sans-serif;
        }
        * {
            box-sizing: border-box;
        }
        p:last-child {
            margin-top: 0;
        }
        img {
            max-width: 100%;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin-top: 0;
        }
        tbody {
            background: #fff;
            padding: 20px;
        }
        .group:after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
    <body style="margin: 0; padding: 0">
        <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <!-- style="padding: 20px 0 30px 0;" -->
                <td>
                    <table align="center" cellpadding="0" cellspacing="0" class="full-width">
                        <tr>
                            <td>
                                <div style="
                        border-collapse: collapse;
                        width: 600px;
                        margin: 20px 0;
                        ">
                                    <div style="
                            border-radius: 16px;
                            background: #fafafa;
                            padding: 34px 40px;
                            box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
                        ">
                                        <div align="center">
                                            <!-- <img style="width: 284px; height: 174px;"
                                                src="https://www.flimp.net/wp-content/uploads/2022/04/super-simple-new-hire-onboarding-tips.png" alt="Group" /> -->
                                          <a href="https://imgbb.com/"><img src="https://i.ibb.co/vQrSjzM/image-Photoroom-png-Photoroom.png" alt="image-Photoroom-png-Photoroom" border="0"></a>
                                        </div>
                                        <p
                                            style="margin: 20px 0 40px 0; font-size: 22px; color: #313131; font-weight: 600; text-align: center;">
                                            Welcome to <span style="color: #002080;">Angel-Shares</span>
                                        </p>
                                        <p style="font-size: 16px; color: #313131; font-weight: 600; margin: 0 0 20px 0;">
                                            Dear ${name},
                                        </p>
                                        <span style="display: block; font-size: 14px; line-height: 22px; color: #686868; text-align: justify;">
                                            We received a request to reset the password associated with your Angel-Shares account. To complete the process, please use the following One-Time Password (OTP):
                                        </span>
                                        <span style="display: block; font-size: 16px; line-height: 22px; color: #002080; font-weight: 600; margin: 10px 0 10px 0;  text-align: justify;">
                                            OTP: ${otp}
                                        </span>
                                        <span style="display: block; font-size: 14px; line-height: 22px; color: #686868; text-align: justify;">
                                            Please enter this OTP on the reset password page to proceed. If you didn't request a password reset, please ignore this email.
                                        </span>
                                        <span style="display: block; font-size: 14px; line-height: 22px; color: #686868;  text-align: justify;">
                                            If you require further assistance, feel free to contact our support team at <a
                            href="mailto:info@angelshares.com"
                            target="_blank"
                            style="color: #002080; font-weight: 600;"
                            >info@angelshares.com.</a
                        >
                        </p>
                                        </span>
                                    <span style="display: block; font-size: 14px; line-height: 22px; color: #686868; text-align: justify;">
                                            Thank you for using Angel-Shares!
                                        </span>
                                        
                                        <p
                                        style="padding: 40px 0 0px 0;display: block; font-size: 14px; line-height: 0px; color: #686868; margin: 0 0 0 0;">
                                        Best regards,
                                    </p>
                                    <p style="font-size: 16px; color: #313131; font-weight: 600; margin: 20px 0 0 0;">
                                        Angel-Shares Team
                                    </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
  },

  sendWelcomeMail: ({ name, token }) => {
    let link = `https://angel-shares.com/verifyemail?token=${token}`;
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap" rel="stylesheet" /> -->
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>first page</title>
      </head>
      <style>
        body {
          font-family: "Inter", sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        p:last-child {
          margin-top: 0;
        }
        img {
          max-width: 100%;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 0;
        }
        tbody {
          background: #fff;
          padding: 20px;
        }
        .group:after {
          content: "";
          display: table;
          clear: both;
        }
      </style>
      <body style="margin: 0; padding: 0">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <!-- style="padding: 20px 0 30px 0;" -->
            <td>
              <table
                align="center"
                cellpadding="0"
                cellspacing="0"
                class="full-width"
              >
                <tr>
                  <td>
                    <div
                      style="
                        border-collapse: collapse;
                        width: 600px;
                        margin: 20px 0;
                      "
                    >
                      <div
                        style="
                          border-radius: 16px;
                          background: #fafafa;
                          padding: 34px 40px;
                          box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
                        "
                      >
                        <div align="center">
                          <!-- <img style="width: 284px; height: 174px;"
                                src="https://client-assets-rh.s3.ap-south-1.amazonaws.com/whatsapp-talkz/development/others/1697280251560-197138012681.6425-Group%20%281%29.png" alt="Group" /> -->
                          <a
                            ><img
                              src="https://angel-shares.s3.us-east-2.amazonaws.com/angelshares/blob-1714624517651image%206.svg"
                              alt="image-Photoroom-png-Photoroom"
                              border="0"
                          /></a>
                        </div>
                        <p
                          style="
                            margin: 20px 0 40px 0;
                            font-size: 22px;
                            color: #313131;
                            font-weight: 600;
                            text-align: center;
                          "
                        >
                          Welcome to
                          <span style="color: #002080">Angel-Shares</span>
                        </p>
                        <p
                          style="
                            font-size: 16px;
                            color: #313131;
                            font-weight: 600;
                            margin: 0 0 20px 0;
                          "
                        >
                          Dear ${name},
                        </p>
                        <span
                          style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          Welcome to Angel Shares! Where opportunities are being created.
                        </span><br/>
                        <span
                          style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          We are thrilled to have you join our community of visionary investors who are passionate about fueling groundbreaking ideas and transforming industries.<br/><br/>
As a valued member of our platform, you now have exclusive access to a curated selection of innovative startups. Here, you will find opportunities to invest in ventures across various stages and sectors, each with the potential to redefine their markets.<br>To get started, we invite you to explore our platform features:
                        </span>
                        <ul style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          ">
                            <li>Personal Dashboard: Track your investments, view your portfolio's performance, and access detailed reports all in one place.
</li>
                            <li>Discovery Tools: Use our advanced filtering tools to find projects that match your investment criteria.
</li>
                            <li>Resource Center: Gain insights from industry leaders and access our comprehensive guides on investment strategies and market trends.
</li>
                            <li>Community Events: Join our webinars, workshops, and networking events to connect with fellow investors and thought leaders.
</li>
                        </ul>
    
                        <div style="margin: 20px auto 20px; text-align: center">
                          <a
                            href= ${link}
                            target="_blank"
                            type="button"
                            style="
                              padding: 12px 35px;
                              text-align: center;
                              text-decoration: none;
                              display: inline-block;
                              font-size: 20px;
                              letter-spacing: 1px;
                              color: #fafafa;
                              background-color: #5681ff;
                              border-radius: 8px;
                              border: 0;
                            "
                          >
                            Verify Email
                          </a>
                        </div>
    
                        <span
                          style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          Please take a moment to complete your profile so that we can tailor our recommendations to your interests. And remember, our dedicated support team is here to assist you with any questions you may have.

                        </span>
                        <span
                          style="
                            padding: 10px 0 0px 0;
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          Thank you for choosing Angel Shares Platform. We look forward to supporting your investment journey and celebrating your successes.

                        </span>
                        <p
                          style="
                            padding: 40px 0 0px 0;
                            display: block;
                            font-size: 14px;
                            line-height: 0px;
                            color: #686868;
                            margin: 0 0 0 0;
                          "
                        >
                          Warm regards,

                        </p>
                        <p
                          style="
                            font-size: 16px;
                            color: #313131;
                            font-weight: 600;
                            margin: 20px 0 0 0;
                          "
                        >
                          Angel Shares Team<br>
                          <a
                            href="mailto:info@angel-shares.com"
                            target="_blank"
                            style="color: #002080; font-weight: 400"
                            >info@angel-shares.com</a><br>
                            <a
                            href="https://angel-shares.com"
                            target="_blank"
                            style="color: #002080; font-weight: 400"
                            >https://angel-shares.com</a>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
        `;
  },
  
  sendPassword: ({ name, email, password }) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap" rel="stylesheet" /> -->
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>first page</title>
      </head>
      <style>
        body {
          font-family: "Inter", sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        p:last-child {
          margin-top: 0;
        }
        img {
          max-width: 100%;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 0;
        }
        tbody {
          background: #fff;
          padding: 20px;
        }
        .group:after {
          content: "";
          display: table;
          clear: both;
        }
      </style>
      <body style="margin: 0; padding: 0">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <!-- style="padding: 20px 0 30px 0;" -->
            <td>
              <table
                align="center"
                cellpadding="0"
                cellspacing="0"
                class="full-width"
              >
                <tr>
                  <td>
                    <div
                      style="
                        border-collapse: collapse;
                        width: 600px;
                        margin: 20px 0;
                      "
                    >
                      <div
                        style="
                          border-radius: 16px;
                          background: #fafafa;
                          padding: 34px 40px;
                          box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
                        "
                      >
                        <div align="center">
                          <!-- <img style="width: 284px; height: 174px;"
                                src="https://client-assets-rh.s3.ap-south-1.amazonaws.com/whatsapp-talkz/development/others/1697280251560-197138012681.6425-Group%20%281%29.png" alt="Group" /> -->
                          <a
                            ><img
                              src="https://i.ibb.co/vQrSjzM/image-Photoroom-png-Photoroom.png"
                              alt="image-Photoroom-png-Photoroom"
                              border="0"
                          /></a>
                        </div>
                        <p
                          style="
                            margin: 20px 0 40px 0;
                            font-size: 22px;
                            color: #313131;
                            font-weight: 600;
                            text-align: center;
                          "
                        >
                          Welcome to
                          <span style="color: #002080">Angel-Shares</span>
                        </p>
                        <p
                          style="
                            font-size: 16px;
                            color: #313131;
                            font-weight: 600;
                            margin: 0 0 20px 0;
                          "
                        >
                          Dear ${name},
                        </p>
                        <span
                          style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          We are thrilled to welcome you to Angel-Shares! Your
                          registration is now complete, and you're all set to
                          experience a new level of communication excellence.
                          <br><br>
                          <b>
                          Email:- ${email}<br>
                          Password:- ${password}<br><br>
                          </b>
                          
                        </span>
    
    
                        <span
                          style="
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          We're here to make sure your communication needs are met
                          with the highest quality service. Should you have any
                          questions or need assistance along the way, don't hesitate
                          to reach out to our dedicated support team at
                          <a
                            href="mailto:info@angelshares.com."
                            target="_blank"
                            style="color: #002080; font-weight: 400"
                            >info@angelshares.com.</a
                          >
                        </span>
                        <span
                          style="
                            padding: 10px 0 0px 0;
                            display: block;
                            font-size: 14px;
                            line-height: 22px;
                            color: #686868;
                            text-align: justify;
                          "
                        >
                          Thank you for choosing Angel-Shares. We're excited to have
                          you on board!
                        </span>
                        <p
                          style="
                            padding: 40px 0 0px 0;
                            display: block;
                            font-size: 14px;
                            line-height: 0px;
                            color: #686868;
                            margin: 0 0 0 0;
                          "
                        >
                          Best regards,
                        </p>
                        <p
                          style="
                            font-size: 16px;
                            color: #313131;
                            font-weight: 600;
                            margin: 20px 0 0 0;
                          "
                        >
                          Angel-Shares Team
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
        `;
  },
};
