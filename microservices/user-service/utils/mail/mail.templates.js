module.exports = {
  // sendOTP1: ({ otp, userName }) => {
  //   return `
  //     <!DOCTYPE html>
  //   <html lang="en">

  //   <head>
  //       <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <link rel="preconnect" href="https://fonts.googleapis.com">
  //       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  //       <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
  //           rel="stylesheet">
  //       <title> first page </title>
  //   </head>
  //   <style>
  //       body {
  //           font-family: "Montserrat", sans-serif;
  //           background-color: #f5f5f5;
  //       }

  //       * {
  //           box-sizing: border-box;
  //           font-family: "Montserrat", sans-serif;

  //       }

  //       p:last-child {
  //           margin-top: 0;

  //       }

  //       img {
  //           max-width: 100%;
  //       }

  //       h1,
  //       h2,
  //       h3,
  //       h4,
  //       h5,
  //       h6 {
  //           margin-top: 0;

  //       }

  //       tbody {
  //           padding: 20px;
  //       }

  //       .group:after {
  //           content: "";
  //           display: table;
  //           clear: both;
  //       }
  //   </style>

  //   <body style="margin: 0; padding: 0;">
  //       <table cellpadding="0" cellspacing="0" width="100%">
  //           <tr>
  //               <!-- style="padding: 20px 0 30px 0;" -->
  //               <td>
  //                   <table align="center" cellpadding="0" cellspacing="0" class="full-width">
  //                       <tr>
  //                           <td>
  //                               <div style="
  //                               background: #fff;
  //                               box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.12);
  //                               width: 715px;
  //                               ">
  //                                   <table width="100%" cellpadding="0" cellspacing="0">
  //                                       <tr>
  //                                           <td style="padding: 50px;">
  //                                               <div style="padding-bottom: 40px;">
  //                                                   <img style="max-width: 164px; backgraound: transparent;"
  //                                                       src="https://writertools-v1.s3.us-east-1.amazonaws.com/images/users/profileImage/e7824758-2564-4ce3-ad43-857a7f675ad6.webp"
  //                                                       alt="Group-48097286-1" border="0">
  //                                               </div>
  //                                               <div>
  //                                                   <h2 style="color: #121A26;
  //                                                   font-size: 25px;
  //                                                   margin: 0 0 16px 0;
  //                                                   font-style: normal;
  //                                                   font-weight: 700;
  //                                                   line-height: 30px; ">
  //                                                       Your login code
  //                                                   </h2>
  //                                                   <p style="font-size: 14px;
  //                                                   line-height: normal;
  //                                                   color: #292D36;
  //                                                   font-weight: 500;
  //                                                   margin: 0 0 16px 0;
  //                                                   ">
  //                                                       Hi ${userName},
  //                                                   </p>
  //                                                   <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #292D36;
  //                                                   font-weight: 500;
  //                                                   margin: 0 0 16px 0;
  //                                                   ">
  //                                                       This is your
  //                                                       verification code:
  //                                                   </p>
  //                                                   <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #858585;
  //                                                   font-weight: 600;
  //                                                   margin: 0 0 16px 0;
  //                                                   ">
  //                                                       Before we get started,
  //                                                       we need to verify your
  //                                                       email address for
  //                                                       security
  //                                                       purposes. To complete
  //                                                       the verification
  //                                                       process, Return to the
  //                                                       login
  //                                                       page and
  //                                                       enter the code below to
  //                                                       sign in.
  //                                                   </p>
  //                                                    <p style="font-size: 24px; line-height: 32px; color: #121A26; font-weight: 700; background-color: #f5f5f5; padding: 10px; border-radius: 5px; text-align: center;">
  //                                                   ${otp}
  //                                               </p>
  //                                               </div>
  //                                               <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #858585;
  //                                                   font-weight: 600;
  //                                                   margin: 20px 0 16px 0;
  //                                                   ">
  //                                                   This code will expire in <a style="color: #4990EC;">10 minutes</a> and
  //                                                   can only be used once.
  //                                               </p>
  //                                               <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #858585;
  //                                                   font-weight: 600;
  //                                                   margin: 0 0 16px 0;
  //                                                   ">
  //                                                   You'll have access to all the wonderful features <a
  //                                                       style="color: #4990EC;">WriterTools</a> has to offer
  //                                                   including creating Amazing Blogs, exploring unique designs, and more If
  //                                                   you have any questions or need assistance, please don't hesitate to
  //                                                   reach out
  //                                                   to our customer support team at <a style="color: #1A73E8;"
  //                                                       href="mailto:support@writertools.ai">support@writertools.ai</a>
  //                                                   We're here to help
  //                                                   Thank you for choosing WriterTools.
  //                                               </p>
  //                                               <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #858585;
  //                                                   font-weight: 600;
  //                                                   margin: 0 0 30px 0;
  //                                                   ">
  //                                                   If you did not make this request, you can safely ignore this email.
  //                                               </p>
  //                                               <div>
  //                                                   <p style="font-size: 14px;
  //                                                   line-height: 24px;
  //                                                   color: #292D36;
  //                                                   float: left;
  //                                                   font-weight: 400;
  //                                                   margin: 0 0 16px 0;
  //                                                   ">
  //                                                       Regards, <br />
  //                                                       <span style="font-weight:600;">WriterTools</span>
  //                                                   </p>
  //                                                   <div style="float: right;">
  //                                                         <div style="float: right;">
  //                                                             <a href="https://www.instagram.com/writertools/" target="_blank">
  //                                                                 <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/instagram.jpg-1722257085905" alt="instagram">
  //                                                             </a>
  //                                                         </div>
  //                                                         <div style="float: right; margin-right: 10px;">
  //                                                             <a href="https://www.linkedin.com/company/writertools" target="_blank">
  //                                                                 <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/linkedIn.jpg-1722257210206" alt="linkedin">
  //                                                             </a>
  //                                                         </div>
  //                                                         <div style="float: right; margin-right: 10px;">
  //                                                             <a href="https://x.com/WritertoolsAi" target="_blank">
  //                                                                 <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/twitter.jpg-1722257265016" alt="twitter">
  //                                                             </a>
  //                                                         </div>
  //                                                         <div style="float: right; margin-right: 10px;">
  //                                                             <a href="https://www.facebook.com/profile.php?id=61569178111094" target="_blank">
  //                                                                 <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/facebook.jpg-1722257323209" alt="facebook">
  //                                                             </a>
  //                                                         </div>
  //                                                     </div>
  //                                               </div>
  //                                           </td>
  //                                       </tr>
  //                                   </table>

  //                           </td>
  //                       </tr>

  //                   </table>
  //               </td>
  //           </tr>
  //       </table>
  //   </body>

  //   </html>
  //   `;
  // },

  sendOTP: ({ otp, userName }) => {
    return `
      <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet">
        <title> first page </title>
    </head>
    <style>
        body {
            font-family: "Montserrat", sans-serif;
            background-color: #f5f5f5;
        }
    
        * {
            box-sizing: border-box;
            font-family: "Montserrat", sans-serif;
    
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
            padding: 20px;
        }
    
        .group:after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
      
    <body style="margin: 0; padding: 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <!-- style="padding: 20px 0 30px 0;" -->
                <td>
                    <table align="center" cellpadding="0" cellspacing="0" class="full-width">
                        <tr>
                            <td>
                                <div style="
                                background: #fff;
                                box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.12);
                                width: 715px;
                                ">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 50px;">
                                                <div style="padding-bottom: 40px;">
                                                    <img style="max-width: 164px; backgraound: transparent;"
                                                        src="https://writertools-v1.s3.us-east-1.amazonaws.com/images/users/profileImage/e7824758-2564-4ce3-ad43-857a7f675ad6.webp"
                                                        alt="Group-48097286-1" border="0">
                                                </div>
                                                <div>
                                                    <h2 style="color: #121A26;
                                                    font-size: 25px;
                                                    margin: 0 0 16px 0;
                                                    font-style: normal;
                                                    font-weight: 700;
                                                    line-height: 30px; ">
                                                        Your login code
                                                    </h2>
                                                    <p style="font-size: 14px;
                                                    line-height: normal;
                                                    color: #292D36;
                                                    font-weight: 500;
                                                    margin: 0 0 16px 0;
                                                    ">
                                                        Hi ${userName},
                                                    </p>
                                                    <p style="font-size: 14px;
                                                    line-height: 24px;
                                                    color: #292D36;
                                                    font-weight: 500;
                                                    margin: 0 0 16px 0;
                                                    ">
                                                        This is your
                                                        verification code:
                                                    </p>
                                                    <p style="font-size: 14px;
                                                    line-height: 24px;
                                                    color: #858585;
                                                    font-weight: 600;
                                                    margin: 0 0 16px 0;
                                                    ">
                                                        Before we get started,
                                                        we need to verify your
                                                        email address for
                                                        security
                                                        purposes. To complete
                                                        the verification
                                                        process, Return to the
                                                        login
                                                        page and
                                                        enter the code below to
                                                        sign in.
                                                    </p>
                                                     <p style="font-size: 24px; line-height: 32px; color: #121A26; font-weight: 700; background-color: #f5f5f5; padding: 10px; border-radius: 5px; text-align: center;">
                                                    ${Array.isArray(otp) ? otp.join("") : otp}
                                                </p>
                                                </div>
                                                <p style="font-size: 14px;
                                                line-height: normal;
                                                color: #292D36;
                                                font-weight: 500;
                                                margin: 0 0 16px 0;
                                                ">
                                                    Hi ${userName},
                                                </p>
                                                <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #292D36;
                                                font-weight: 500;
                                                margin: 0 0 16px 0;
                                                ">
                                                    This is your
                                                    verification code:
                                                </p>
                                                <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #858585;
                                                font-weight: 600;
                                                margin: 0 0 16px 0;
                                                ">
                                                    Before we get started,
                                                    we need to verify your
                                                    email address for
                                                    security
                                                    purposes. To complete
                                                    the verification
                                                    process, Return to the
                                                    login
                                                    page and
                                                    enter the code below to
                                                    sign in.
                                                </p>
                                                <div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                font-size: 20px;
                                                font-weight:600;
                                                margin-right: 12px;
                                                justify-content: center;
                                                float: left;">${otp[0]}</div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                margin-right: 12px;
                                                font-size: 20px;
                                                font-weight: 600;
                                                justify-content: center;
                                                float: left;">${otp[1]}</div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                margin-right: 12px;
                                                font-size: 20px;
                                                font-weight: 600;
                                                justify-content: center;
                                                float: left;">${otp[2]}</div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                margin-right: 12px;
                                                font-size: 20px;
                                                font-weight: 600;
                                                justify-content: center;
                                                float: left;">${otp[3]}</div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                margin-right: 12px;
                                                font-size: 20px;
                                                font-weight: 600;
                                                justify-content: center;
                                                float: left;">${otp[4]}</div>
                                                    <div style="width: 40px; height: 40px;
                                                display: flex;
                                                align-items: center;
                                                margin-right: 12px;
                                                font-size: 20px;
                                                font-weight: 600;
                                                justify-content: center;
                                                ">${otp[5]}</div>
                                                </div>
                                            </div>
                                            <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #858585;
                                                font-weight: 600;
                                                margin: 20px 0 16px 0;
                                                ">
                                                This code will expire in <a style="color: #4990EC;">10 minutes</a> and
                                                can only be used once.
                                            </p>
                                            <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #858585;
                                                font-weight: 600;
                                                margin: 0 0 16px 0;
                                                ">
                                                You'll have access to all the wonderful features <a
                                                    style="color: #4990EC;">WriterTools</a> has to offer
                                                including creating Amazing Blogs, exploring unique designs, and more If
                                                you have any questions or need assistance, please don't hesitate to
                                                reach out
                                                to our customer support team at <a style="color: #1A73E8;"
                                                    href="mailto:support@writertools.ai">support@writertools.ai</a>
                                                We're here to help
                                                Thank you for choosing WriterTools.
                                            </p>
                                            <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #858585;
                                                font-weight: 600;
                                                margin: 0 0 30px 0;
                                                ">
                                                If you did not make this request, you can safely ignore this email.
                                            </p>
                                            <div>
                                                <p style="font-size: 14px;
                                                line-height: 24px;
                                                color: #292D36;
                                                float: left;
                                                font-weight: 400;
                                                margin: 0 0 16px 0;
                                                ">
                                                    Regards, <br />
                                                    <span style="font-weight:600;">WriterTools</span>
                                                </p>
                                                <div style="float: right;">
                                                          <div style="float: right;">
                                                              <a href="https://www.instagram.com/writertools/" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/instagram.jpg-1722257085905" alt="instagram">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://www.linkedin.com/company/writertools" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/linkedIn.jpg-1722257210206" alt="linkedin">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://x.com/WritertoolsAi" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/twitter.jpg-1722257265016" alt="twitter">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://www.facebook.com/profile.php?id=61569178111094" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/facebook.jpg-1722257323209" alt="facebook">
                                                              </a>
                                                          </div>
                                                      </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
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

  welcomMail: () => {
    return `
           <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
      <title> first page </title>
  </head>
  <style>
      body {
          font-family: "Montserrat", sans-serif;
          background-color: #f5f5f5;
      }
  
      * {
          box-sizing: border-box;
          font-family: "Montserrat", sans-serif;
  
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
          padding: 20px;
      }
  
      .group:after {
          content: "";
          display: table;
          clear: both;
      }
  </style>
  
  <body style="margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <!-- style="padding: 20px 0 30px 0;" -->
              <td>
                  <table align="center" cellpadding="0" cellspacing="0" class="full-width">
                      <tr>
                          <td>
                              <div style="
                              background: #fff;
                              box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.12);
                              width: 715px;
                              ">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                          <td style="padding: 50px;">
                                              <div style="padding-bottom: 40px;">
                                                  <img style="max-width: 164px; backgraound: transparent;"
                                                      src="https://writertools-v1.s3.us-east-1.amazonaws.com/images/users/profileImage/e7824758-2564-4ce3-ad43-857a7f675ad6.webp"
                                                      alt="Group-48097286-1" border="0">
                                              </div>
                                              <div>
                                                  <h2 style="color: #121A26;
                                                  font-size: 25px;
                                                  margin: 0 0 16px 0;
                                                  font-style: normal;
                                                  font-weight: 700;
                                                  line-height: 30px; ">
                                                      Welcome👋
                                                  </h2>
                                                  <p style="font-size: 14px;
                                                  line-height: normal;
                                                  color: #858585;
                                                  font-weight: 600;
                                                  line-height: 24px;
                                                  margin: 0 0 16px 0;
                                                  ">
                                                      We’re thrilled to welcome you to WriterTools! Thank you for joining
                                                      our vibrant
                                                      community of writers and readers who are passionate about sharing
                                                      and
                                                      discovering unique stories and insights. By creating a free account,
                                                      you've
                                                      become part of a global network that celebrates the power of words
                                                      and the
                                                      experiences of human writers.
                                                  </p>
                                                  <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #858585;
                                                  font-weight: 600;
                                                  margin: 0 0 30px 0;
                                                  ">
                                                      Thank you for being here and for choosing to engage with
                                                      <span style="color: #1A73E8;">WriterTools</span>.
                                                      We look forward to seeing the incredible content you'll create and
                                                      explore.
                                                  </p>
  
                                                  <div>
                                                      <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #292D36;
                                                  float: left;
                                                  font-weight: 400;
                                                  margin: 0;
                                                  ">
                                                          Warm regards, <br />
                                                          <span style="font-weight: 600;">The WriterTools Team</span>
                                                      </p>
                                                      <div style="float: right;">
                                                          <div style="float: right;">
                                                              <a href="https://www.instagram.com/writertools/" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/instagram.jpg-1722257085905" alt="instagram">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://www.linkedin.com/company/writertools" target="_blank">
                                                                              <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/linkedIn.jpg-1722257210206" alt="linkedin">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://x.com/WritertoolsAi" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/twitter.jpg-1722257265016" alt="twitter">
                                                              </a>
                                                          </div>
                                                          <div style="float: right; margin-right: 10px;">
                                                              <a href="https://www.facebook.com/profile.php?id=61569178111094" target="_blank">
                                                                  <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/facebook.jpg-1722257323209" alt="facebook">
                                                              </a>
                                                          </div>
                                                      </div>
                                                  </div>
                                          </td>
                                      </tr>
                                  </table>
  
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

  changePasswordInformedMail: () => {
    return `
          <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Password Changed Successfully</title>
        <style>
            body {
                font-family: sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            h1 {
                text-align: center;
            }
            p {
                line-height: 1.5;
            }
            .security-tips {
                margin-top: 20px;
                border-top: 1px solid #ddd;
                padding-top: 10px;
            }
            .security-tips h3 {
                margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Password Has Been Changed</h1>
            <p>This email confirms that your password for [Your Website Name] has been successfully changed.</p>
            <p>We recommend you keep your password safe and secure. Here are some tips to help you do that:</p>
            <div class="security-tips">
                <h3>Security Tips:</h3>
                <ul>
                    <li>Use a strong password that is at least 8 characters long and includes a mix of uppercase and lowercase letters, numbers, and symbols.</li>
                    <li>Don't reuse your password for other websites or accounts.</li>
                    <li>Consider using a password manager to help you create and store strong passwords.</li>
                </ul>
            </div>
            <p>If you did not request a password change, please contact us immediately at [Your Email Address] to report unauthorized activity.</p>
            <p>Sincerely,</p>
            <p>The WriterTools Team</p>
        </div>
    </body>
    </html>
    
          `;
  },

  sendForgotPassMail: ({ link, userName }) => {
    return `
        <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
      <title> first page </title>
  </head>
  <style>
      body {
          font-family: "Montserrat", sans-serif;
          background-color: #f5f5f5;
      }
  
      * {
          box-sizing: border-box;
          font-family: "Montserrat", sans-serif;
  
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
          padding: 20px;
      }
  
      .group:after {
          content: "";
          display: table;
          clear: both;
      }
  </style>
  
  <body style="margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <!-- style="padding: 20px 0 30px 0;" -->
              <td>
                  <table align="center" cellpadding="0" cellspacing="0" class="full-width">
                      <tr>
                          <td>
                              <div style="
                              background: #fff;
                              box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.12);
                              width: 715px;
                              ">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                          <td style="padding: 50px;">
                                              <div style="padding-bottom: 40px;">
                                                  <img style="max-width: 164px; backgraound: transparent;"
                                                      src="https://writertools-v1.s3.us-east-1.amazonaws.com/images/users/profileImage/e7824758-2564-4ce3-ad43-857a7f675ad6.webp"
                                                      alt="Group-48097286-1" border="0">
                                              </div>
                                              <div>
                                                  <h2 style="color: #121A26;
                                                  font-size: 25px;
                                                  margin: 0 0 16px 0;
                                                  font-style: normal;
                                                  font-weight: 700;
                                                  line-height: 30px; ">
                                                      Reset Your Password
                                                  </h2>
                                                  <p style="font-size: 14px;
                                                  line-height: normal;
                                                  color: #292D36;
                                                  font-weight: 600;
                                                  margin: 0 0 16px 0;
                                                  ">
                                                      Hi ${userName},
                                                  </p>
  
                                                  <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #858585;
                                                  font-weight: 600;
                                                  margin: 0 0 20px 0;
                                                  ">
                                                      We received a request to reset the password associated with your
                                                      WriterTools
                                                      account. If you made this request, please click the link below to
                                                      set a
                                                      new password: 
                                                      <div style="margin: 5px 0 0 0;">
                                                          <a href="${link}"
                                                              target="_blank">
                                                              <button style="color: #fff; border: 1px solid #121a26; background-color: #121a26; border-radius: 4px; cursor: pointer; padding: 5px 10px; font-size: 12px;"><p style="display: flex; justify-content: center; align-items: center; margin: 0;">Click here</p></button>
                                                          </a>
                                                      </div>
                                                          </p>
  
                                              </div>
                                              <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #858585;
                                                  font-weight: 600;
                                                  margin: 20px 0 20px 0;
                                                  ">
                                                  For security purposes, this link will expire in 24 hours. If you did not
                                                  request a
                                                  password reset, please ignore this email or contact our support team for
                                                  assistance.
                                              </p>
                                              <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #858585;
                                                  font-weight: 600;
                                                  margin: 0 0 30px 0;
                                                  ">
                                                  Thank you for being a part of the <a
                                                      style="color: #1A73E8;">WriterTools</a> community. We're here to
                                                  help
                                                  you get back to creating and exploring amazing content.
                                              </p>
  
                                              <div>
                                                  <p style="font-size: 14px;
                                                  line-height: 24px;
                                                  color: #292D36;
                                                  float: left;
                                                  font-weight: 500;
                                                  margin: 0;
                                                  ">
                                                      Best regards, <br />
                                                      <span style="font-weight: 600;">The WriterTools Team</span>
                                                  </p>
                                                  <div style="float: right;">
                                                      <div style="float: right;">
                                                          <a href="https://www.instagram.com/writertools/" target="_blank">
                                                              <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/instagram.jpg-1722257085905" alt="instagram">
                                                          </a>    
                                                      </div>
                                                      <div style="float: right; margin-right: 10px;">
                                                          <a href="https://www.linkedin.com/company/writertools" target="_blank">
                                                              <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/linkedIn.jpg-1722257210206" alt="linkedin">
                                                          </a>
                                                      </div>
                                                      <div style="float: right; margin-right: 10px;">
                                                          <a href="https://x.com/WritertoolsAi" target="_blank">
                                                              <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/twitter.jpg-1722257265016" alt="twitter">
                                                          </a>
                                                      </div>
                                                      <div style="float: right; margin-right: 10px;">
                                                          <a href="https://www.facebook.com/profile.php?id=61569178111094" target="_blank">
                                                              <img src="https://writertools-v1.s3.amazonaws.com/images/users/profileImage/facebook.jpg-1722257323209" alt="facebook">
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                  </table>
  
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
