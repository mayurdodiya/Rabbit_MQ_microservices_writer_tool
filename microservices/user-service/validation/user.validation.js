const Joi = require("wt-utils/joi.validation");
const { enums } = require("wt-config");

/**
 *Signup
 */
const signup = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
      .trim() // Remove leading/trailing whitespace
      .min(8) // Minimum length of 8 characters (if provided)
      .optional() // Make password an optional field
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[^\\s]*$")) // Regular expression for complexity (if provided)
      .messages({
        "string.empty": "Password is required when provided.", // Customize as needed
        "string.min": "Password must be at least {#limit} characters long.",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      }),
    fcmToken: Joi.string().optional(),
    privacyAccepted: Joi.boolean().default(false),
    refreshToken: Joi.string().optional(),
    accessToken: Joi.string().optional(),
    isSocial: Joi.boolean().default(false),
  }),
};

/**
 * Login.
 */
const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().optional(),
      userName: Joi.string().trim().optional(),
      refreshToken: Joi.string().optional(),
      accessToken: Joi.string().optional(),
      isSocial: Joi.boolean().default(false),
    })
    .when(Joi.object({ isSocial: Joi.equal(true) }), {
      then: Joi.object({
        refreshToken: Joi.string().required(),
        accessToken: Joi.string().required(),
      }),
    }),
};

/**
 * Send OTP.
 */
const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

/**
 *log out
 */
const logout = {
  body: Joi.object().keys({
    fcmToken: Joi.string().optional().allow(""),
  }),
};

/**
 * Verify OTP.
 */
const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required(),
    otp: Joi.string().trim().required(),
  }),
};

/**
 * Change password.
 */
const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string()
      .trim() // Remove leading/trailing whitespace
      .min(8) // Minimum length of 8 characters (if provided)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[^\\s]*$")) // Regular expression for complexity (if provided)
      .required()
      .messages({
        "string.empty": "Password is required when provided.", // Customize as needed
        "string.min": "Password must be at least {#limit} characters long.",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      }),

    confirmNewPassword: Joi.string()
      .trim()
      .required()
      .valid(Joi.ref("newPassword")),
  }),
};

/**
 *Send ForgotPass-Mail
 */
const sendForgotPassMail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

/**
 * Forgot password.
 */
const forgotPassword = {
  body: Joi.object().keys({
    forgotPassToken: Joi.string().trim().required(),
    newPassword: Joi.string()
      .trim() // Remove leading/trailing whitespace
      .min(8) // Minimum length of 8 characters (if provided)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[^\\s]*$")) // Regular expression for complexity (if provided)
      .required()
      .messages({
        "string.empty": "Password is required when provided.", // Customize as needed
        "string.min": "Password must be at least {#limit} characters long.",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      }),
  }),
};

//Update-Profile and update Onboarding-flow
const updateProfile = {
  body: Joi.object().keys({
    email: Joi.string().email().optional(),
    productCategory: Joi.string().trim().optional(),
    productName: Joi.string().trim().optional(),
    productURL: Joi.string().trim().optional(),
    interestedCategories: Joi.array()
      .items(Joi.string().min(3).trim().required())
      .optional(),
    userName: Joi.string().trim().optional(),
    shortBio: Joi.string().trim().optional(),
    instagramLink: Joi.string().optional(),
    facebookLink: Joi.string().optional(),
    linkedinLink: Joi.string().optional(),
    twitterLink: Joi.string().optional(),
    youtubeLink: Joi.string().optional(),
  }),
};

//get user's notification
const getNotifications = {
  query: Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().default(""),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    isRead: Joi.boolean().default(null),
    isDeleted: Joi.boolean().default(null),
    isDisplay: Joi.boolean().default(null),
  }),
};
/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  changePassword,
  logout,
  updateProfile,
  sendForgotPassMail,
  getNotifications,
};
