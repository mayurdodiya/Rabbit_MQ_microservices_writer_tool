//controllers
const userController = require("../controllers/user.controller");
const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const userValidation = require("../validation/user.validation");

const { validate } = require("wt-utils");
const { auth } = require("wt-server/middleware");
const { uploadFile, uploadAndProcessFiles } = require("wt-utils/s3.bucket");
const router = express.Router();

/**
 * Signup
 */
router.post(
  "/signup",
  validate(userValidation.signup),
  userController.userSignUp
);

/**
 * Login
 */
router.post("/login", validate(userValidation.login), userController.userLogin);

/**
 * Send OTP.
 */
router.post(
  "/send-otp",
  validate(userValidation.sendOtp),
  userController.sendOtp
);

/**
 * Verify OTP.
 */
router.post(
  "/verify-otp",
  validate(userValidation.verifyOtp),
  userController.verifyOtp
);

/**
 * Forgot password.
 */
router.put(
  "/forgot-password",
  validate(userValidation.forgotPassword),
  userController.forgotPassword
);

/**
 * Change password.
 */
router.put(
  "/reset-password",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER] }),
  validate(userValidation.changePassword),
  userController.changePassword
);

/**
 *Send ForgotPass-Mail
 */
router.post(
  "/send-forgotpass-mail",
  validate(userValidation.sendForgotPassMail),
  userController.sendForgotPassMail
);

//Get user profile
router.get(
  "/get-profile",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER] }),
  userController.getProfile
);

//update user profile and Onboarding-flow
router.put(
  "/update-profile",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER] }),
  uploadFile.single("profileImage"),
  uploadAndProcessFiles,
  validate(userValidation.updateProfile),
  userController.updateProfile
);

//get user's notification
router.get(
  "/get-notification",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(userValidation.getNotifications),
  userController.getNotifications
);

/**
 * Gell Blogs of user interest catetories
 */
router.get(
  "/get-blogs",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  userController.getBlogs
);

/**
 * Delete user profile
 */
router.patch(
  "/delete-profile",  
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  userController.deleteUser
);


module.exports = router;
