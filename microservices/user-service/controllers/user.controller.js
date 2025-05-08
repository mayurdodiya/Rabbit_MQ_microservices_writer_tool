const responseLib = require("wt-lib").resp;
const moment = require("moment");
const { jwt } = require("wt-lib");
const { ObjectId } = require("wt-server").mongoose.Types;
const {
  UserModel,
  OtpModel,
  RoleModel,
  BlogNotificationModel,
  BlogModel, 
} = require("wt-schemas");
const {
  enums: { BLOG_STATUS },
} = require("wt-config");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const {
  generateToken,
  hashPassword,
  comparePassword,
  generateResetPasswordToken,
} = require("wt-utils/bcryptTokens");
const {
  sendOTP,
  sendWelcomeMail,
  changePasswordInformedMail,
  sendForgotPassMail,
} = require("../utils/mail/mail.service");
const { isDataView } = require("util/types");
const {
  ROLE: { USER },
} = require("wt-config").enums;

module.exports = {
  userSignUp: async (req, res) => {
    try {
      let emailExist = await UserModel.findOne({
        email: req.body.email,
        isActive: false,
      });

      const generateOtp = () =>
        ("0".repeat(6) + Math.floor(Math.random() * 10 ** 6)).slice(-6);
      let otp = generateOtp(); //generateOtp for verify email
      const expireTime = moment().add(10, "minute");

      if (emailExist && !emailExist.isEmailVerified) {
        // Save Otp and send otp to user
        await OtpModel.findOneAndUpdate(
          { userId: emailExist._id },
          { $set: { otp: otp, userId: emailExist._id, expires: expireTime } },
          { upsert: true }
        );
        otp = otp.split("");

        //send mail for verify email
        await sendOTP({
          email: emailExist.email,
          otp,
          userName: emailExist.userName,
        });

        return responseLib.OK({
          res,
          message: message.OTP_SENT,
        });
      }

      if (emailExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.USER_ALREADY_EXISTS,
        });
      }

      //login with google
      if (req.body?.isSocial == true && !emailExist) {
        const roleData = await RoleModel.findOne({
          role: "User",
        }).lean();
        req.body.roleId = roleData._id;

        //create random password
        let Password = req.body?.password
          ? await hashPassword({ password: req.body.password })
          : Math.random().toString(36).slice(-10);

        const userCreated = await UserModel.create({
          ...req.body,
          email: req.body.email,
          password: Password,
          roleId: req.body.roleId,
          privacyAccepted: req.body?.privacyAccepted,
          isActive: false,

          status: "active",
          isSocial: true,
          refreshToken: req.body.refreshToken,
          accessToken: req.body.accessToken,
        });

        emailExist = await UserModel.findOne({
          email: userCreated.email,
        }).populate({
          path: "roleId",
          model: "roles",
          select: "_id role",
        });

        return responseLib.OK({
          res,
          message: message.LOGIN_SUCCESS,
          payload: {
            user: emailExist,
            tokens: await generateToken({ _id: emailExist._id }), // Generate auth token.
          },
        });
      }

      const roleData = await RoleModel.findOne({
        role: "User",
      }).lean();
      req.body.roleId = roleData._id;

      //create random password
      let Password = req.body.password
        ? await hashPassword({ password: req.body.password })
        : Math.random().toString(36).slice(-8);

      const userCreated = await UserModel.create({
        ...req.body,
        password: Password,
        privacyAccepted: req.body?.privacyAccepted,
        status: "active",
        selfCreated: true,
        isActive:false,
        isDeleted: false,
      });
      const createOTP = await OtpModel.findOneAndUpdate(
        { userId: userCreated._id },
        { $set: { otp: otp, userId: userCreated._id, expires: expireTime } },
        { upsert: true }
      );
      otp = otp.split("");

      //send mail for verify email
      await sendOTP({
        email: req.body.email,
        otp,
        userName: req.body.userName,
      });

      return responseLib.OK({ res, message: message.SUCCESS, payload: {} });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { email, password, refreshToken, accessToken } = req.body;
      let emailExist = await UserModel.findOne({
        email,
        isActive: true,
      }).populate("roleId");
      
      if (emailExist && emailExist.roleId.role !== USER) {
        return responseLib.FORBIDDEN({
          res,
          message: message.USER_PERMISSION_DENIED,
        });
      }

      if (!emailExist && req.body?.isSocial == false)
        return responseLib.BAD_REQUEST({
          res,
          message: message.USER_EMAIL_NOT_FOUND,
        });

      //login with google first time
      if (req.body?.isSocial == true && !emailExist) {
        //find role
        const roleData = await RoleModel.findOne({
          role: "User",
        }).lean();
        req.body.roleId = roleData._id;

        //create random password
        let Password = req.body?.password
          ? await hashPassword(req.body?.password)
          : Math.random().toString(36).slice(-10);

        const userCreated = await UserModel.create({
          ...req.body,
          email: req.body.email,
          password: Password,
          userName: req.body?.userName,
          roleId: req.body.roleId,
          privacyAccepted: req.body?.privacyAccepted,
          isEmailVerified: true,
          status: "active",
          isSocial: true,
          refreshToken: req.body.refreshToken,
          accessToken: req.body.accessToken,
        });

        emailExist = await UserModel.findOne({
          email: userCreated?.email,
        }).populate({
          path: "roleId",
          model: "roles",
          select: "_id role",
        });
        return responseLib.OK({
          res,
          message: message.LOGIN_SUCCESS,
          payload: {
            user: emailExist,
            tokens: generateToken({ _id: emailExist._id }), // Generate auth token.
          },
        });
      }

      //login with google
      if (req.body.isSocial == true) {
        //decode firebase token
        const decoded = jwt.jwt.decode(accessToken);

        if (decoded?.email != email) {
          return responseLib.BAD_REQUEST({
            res,
            message: "Email is mismath of this refreshtoken and accesstoken!",
          });
        } else {
          //check isEmailVerified true or false
          if (emailExist.isEmailVerified == false)
            return responseLib.BAD_REQUEST({
              res,
              message:
                "Email is not Verified!, You need to first verified your mail.",
            });

          await UserModel.updateOne(
            {
              email: email,
            },
            {
              $set: {
                isSocial: true,
                refreshToken: refreshToken,
                accessToken: accessToken,
              },
            },
            {
              new: true,
            }
          );

          return responseLib.OK({
            res,
            message: message.LOGIN_SUCCESS,
            payload: {
              user: emailExist,
              tokens: generateToken({ _id: emailExist._id }), // Generate auth token.
            },
          });
        }
      }

      //check isEmailVerified true or false
      if (emailExist?.isEmailVerified == false)
        return responseLib.BAD_REQUEST({
          res,
          message: message.USER_NOT_VERIFIED,
        });

      const isPasswordCorrect = await comparePassword({
        password,
        hash: emailExist.password,
      });

      if (!isPasswordCorrect) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.INVALID_PASSWORD,
          payload: {},
        }); // If password doesn't match the user's password, throw an error.
      }

      return responseLib.OK({
        res,
        message: message.LOGIN_SUCCESS,
        payload: {
          user: emailExist,
          tokens: generateToken({ _id: emailExist._id }), // Generate auth token.
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  sendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      const emailExist = await UserModel.findOne({
        email,
        isActive: false,
      }).populate("roleId"); // Get user by email.

      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }

      const generateOtp = () =>
        ("0".repeat(6) + Math.floor(Math.random() * 10 ** 6)).slice(-6);

      let otp = await generateOtp(); //generateOtp for verify email
      const expireTime = moment().add(10, "minute");
      await OtpModel.findOneAndUpdate(
        { userId: emailExist._id },
        { $set: { otp: otp, userId: emailExist._id, expires: expireTime } },
        { upsert: true }
      );

      await sendOTP({
        email: req.body.email,
        otp: otp,
        userName: emailExist.userName,
      });

      return responseLib.OK({
        res,
        message: message.SUCCESS,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      let emailExist = await UserModel.findOne({
        email,
        isActive: false,
      }).populate("roleId"); // Get user by email.

      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }

      let otpExists = await OtpModel.findOne({ userId: emailExist._id });

      if (!otpExists) {
        return responseLib.NOT_FOUND({ res, message: message.OTP_NOT_FOUND }); // If email doesn't exist, throw an error.
      }

      if (otpExists.otp !== otp) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.OTP_NOT_VERIFIED,
        }); // If email doesn't exist, throw an error.
      }

      if (otpExists.expires <= new Date()) {
        return responseLib.BAD_REQUEST({ res, message: message.OTP_EXPIRED }); // If email doesn't exist, throw an error.
      }

      //make user isEmailVerified
      const result = await UserModel.findOneAndUpdate(
        {
          email: emailExist.email,
          isActive: false,
        },
        { $set: { isEmailVerified: true, isActive: true } },
        { new: true }
      );

      await sendWelcomeMail({ email: req.body.email });
      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          user: result,
          tokens: await generateToken({ _id: emailExist._id }), // Generate auth token.
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  sendForgotPassMail: async (req, res) => {
    try {
      const { email } = req.body;

      const emailExist = await UserModel.findOne(
        {
          email,
          isActive: true,
        },
        { email: 1, userName: 1, roleId: 1 }
      ); // Get user by email.

      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }
      let forgotPassToken = await generateResetPasswordToken({
        data: emailExist,
      }); // Generate auth token.
      const link = `${process.env.FRONTEND_URL}/reset-password?forgotPassToken=${forgotPassToken}`;

      await sendForgotPassMail({
        email: req.body.email,
        userName: emailExist.userName,
        link: link,
      });

      return responseLib.OK({
        res,
        message: message.SUCCESS,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const reqBody = req.body;
      const token = reqBody.forgotPassToken; //verify the token

      // Check for token
      if (!token) {
        return responseLib.UNAUTHORIZED({
          res,
          message: message.UNAUTHORIZED,
        });
      }

      // check if token is expired or not
      const JWT_SECRET = process.env.RESET_PASSWORD_TOKEN_SECRET;

      const { payload } = jwt.jwt.decode(token, { complete: true });

      const currentTime = Math.floor(Date.now() / 1000);
      const timeinSeconds = currentTime + 10 * 60;

      if (timeinSeconds - payload.exp > 600) {
        return responseLib.UNAUTHORIZED({
          res,
          message: message.TOKEN_EXPIRED,
        });
      }
      const DATA = jwt.jwt.verify(token, JWT_SECRET); // Verify token

      const emailExist = await UserModel.findOne({
        email: DATA.data.email,
        isActive: true,
      }).populate("roleId"); // Get user by email.

      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_EMAIL_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }

      let password = await hashPassword({ password: reqBody.newPassword });

      await UserModel.findOneAndUpdate(
        { _id: emailExist._id, isActive: true },
        { $set: { password: password } },
        { new: true }
      ); // Update user password by _id.

      return responseLib.OK({
        res,
        message: message.SUCCESS,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const reqBody = req.body;

      const user = await UserModel.findOne({ _id: req.user._id });

      const isPasswordCorrect = await comparePassword({
        password: reqBody.oldPassword,
        hash: user.password,
      });

      if (!isPasswordCorrect) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.INVALID_PASSWORD,
        });
      }

      let password = await hashPassword({ password: reqBody.newPassword });

      await UserModel.findOneAndUpdate(
        { _id: user._id, deletedAt: null },
        { $set: { password: password } },
        { new: true }
      ); // Update user password by _id.

      await changePasswordInformedMail({ email: user.email });

      return responseLib.OK({
        res,
        message: message.SUCCESS,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await UserModel.findOne({
        email: req.user.email,
        isActive: true,
      }).populate("roleId"); // Get user by email.

      if (!user) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_EMAIL_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }

      const pipeline = [
        { $match: { email: req.user.email, isActive: true } }, // Filter based on criteria
        {
          $lookup: {
            from: "productcategories", // Replace 'ProductCategory' with actual collection name
            localField: "productCategory", // Field referencing the category ID
            foreignField: "_id", // Field in ProductCategory collection that holds the ID
            as: "productCategoryDetails", // Name for the populated field
          },
        },
        {
          $unwind: {
            path: "$productCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "blogcategories", // Replace 'InterestCategory' with actual collection name
            localField: "interestedCategories", // Field referencing the category IDs (array)
            foreignField: "_id", // Field in InterestCategory collection that holds the ID
            as: "interestedCategoriesDetails", // Name for the populated field
          },
        },
        {
          $project: {
            createdAt: 1,
            userName: 1,
            email: 1,
            shortBio: 1,
            profileImage: 1,
            productName: 1,
            productCategoryDetails: 1,
            productURL: 1,
            isActive: 1,
            productCategoryName: "$productCategoryDetails.title", // Get name from first element
            interestedCategoriesNames: {
              $map: {
                input: "$interestedCategoriesDetails",
                as: "category",
                in: "$$category.title",
              },
            }, // Project only names from array
            instagramLink: 1,
            facebookLink: 1,
            linkedinLink: 1,
            twitterLink: 1,
            youtubeLink: 1,
          },
        },
      ];

      const findUser = await UserModel.aggregate(pipeline);
      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: findUser,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const emailExist = await UserModel.findOne({
        email: req.user.email,
        isActive: true,
      }).populate("roleId"); // Get user by email.

      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_EMAIL_NOT_FOUND,
        }); // If email doesn't exist, throw an error.
      }
      let body = req.body;
      if (req.file) body.profileImage = req.file.location;
      const updatedProfile = await UserModel.findOneAndUpdate(
        { _id: emailExist._id, isActive: true },
        { $set: { ...body, isProfileCompleted: true } },
        { new: true }
      ).lean(); // Update user-profile by _id.

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: updatedProfile,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
      });
    }
  },

  getNotifications: async (req, res) => {
    try {
      //*  find criteria
      let findCriteria = {
        receiverId: req.user._id,
        ...(req.query.isDisplay != null && { isDisplay: req.query.isDisplay }),
        ...(req.query.isRead != null && { isRead: req.query.isRead }),
        ...(req.query.isDeleted != null && { isDeleted: req.query.isDeleted }),
      };

      //* Get Notifications
      const data = await BlogNotificationModel.find(findCriteria)
        .sort({ [req.query.sortBy]: req.query.sortOrder })
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit)
        .lean();
      const count = await BlogNotificationModel.countDocuments(findCriteria);
      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: { count, data },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({ res, message: error.message });
    }
  },

  /**
   * Fetches blogs based on user's interested categories.
   *
   * @param {Object} req - Express request object containing user ID and query params.
   * @param {Object} res - Express response object to send the response.
   * @property {number} page - Page number for pagination.
   * @property {number} limit - Number of blogs per page.
   *
   * @returns {Object} - Response object with the blogs and count.
   *
   * @throws Will return an error response if there's a failure in fetching the blogs.
   */
  getBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      let criteria = {};

      const userId = new ObjectId(req.user._id);

      if (!userId) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_EMAIL_NOT_FOUND,
        });
      }

      if (search && search !== "") {
        criteria = {
          ...criteria,
          $or: [
            {
              title: { $regex: new RegExp(search, "i") },
            },
            {
              slugId: { $regex: new RegExp(search, "i") },
            },
          ],
        };
      }

      const user = await UserModel.findOne({
        _id: userId,
        isActive: true,
      }).select("interestedCategories");

      criteria = {
        ...criteria,
        blogCategoryId: {
          $in: user?.interestedCategories,
        },
        isDeleted: false,
        isActive: true,
        status: BLOG_STATUS.APPROVED,
      };

      const pipeline = [
        {
          $match: {
            ...criteria,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: (parseInt(page) - 1) * limit,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "blogcategories",
            localField: "blogCategoryId",
            foreignField: "_id",
            as: "BlogCategory",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "uid",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  userName: 1,
                  email: 1,
                  profileImage: 1,
                },
              },
            ],
            as: "Users",
          },
        },
        {
          $unwind: "$Users",
        },
        {
          $lookup: {
            from: "library",
            localField: "_id",
            foreignField: "blogId",
            as: "library_blogs",
            pipeline: [
              {
                $match: {
                  uid: userId,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            isSaved: {
              $cond: {
                if: {
                  $eq: [{ $size: "$library_blogs" }, 0],
                },
                then: false,
                else: true,
              },
            },
          },
        },
      ];

      const blogs = await BlogModel.aggregate(pipeline);
      const counts = await BlogModel.countDocuments(criteria);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: { blogs, counts },
      });
    } catch (error) {
      log.error("Error fetching user interested catetory blogs:->", error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
        payload: error,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email, isActive: true });

      if (!user) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });
      }

      const result = await UserModel.updateOne(
        { email: email },
        { $set: { isDeleted: true, isActive: false } },
        { new: true }
      );

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {},
      });
    } catch (error) {
      console.log(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
        payload: error,
      });
    }
  },
};
