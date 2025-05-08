const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const adminValidation = require("../validation/admin.validation");

//controllers
const adminController = require("../controllers/admin.controller");

const { validate } = require("wt-utils");
const { auth } = require("wt-server/middleware");
const router = express.Router();

//getUserList
router.get(
  "/get-all-users",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.getAllUsers),
  adminController.getAllUsers
);

//dashboard
router.get(
  "/get-all-counts",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  adminController.dashboard
);

//updateUserStatus
router.put(
  "/updateUserStatus",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.updateUserStatus),
  adminController.updateUserStatus
);

//changeBlogStatus
router.put(
  "/changeBlogStatus/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.changeBlogStatus),
  adminController.changeBlogStatus
);

//Activate or Deactive a Category
router.put(
  "/change-blog-category-status/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.changeBlogCategoryStatus),
  adminController.changeBlogCagtoryStatus
);

//Api to get all blogs
router.get(
  "/get-all-blogs",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.getAllBlogsValidator),
  adminController.getAllBlogs
);

//Api to get NewsLetter subscribers
router.get(
  "/get-all-newsletter-subscribers",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.getAllNewsletterSubscribers),
  adminController.getAllNewsletterSubscribers
);

//Api to delete a Newsletter subscriber
router.delete(
  "/delete-newsletter-subscriber/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.deleteNewsletterSubscriber),
  adminController.deleteNewsletterSubscriber
);

//Api to create privacy policy
router.post(
  "/create-privacy-policy",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.createPrivacyPolicy),
  adminController.createPrivacyPolicy
);

//Api to get all privacy policies
router.get(
  "/get-all-privacy-policy",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(adminValidation.getAllPrivacyPolicies),
  adminController.getAllPrivacyPolicies
);

//Api to update privacy policy
router.put(
  "/update-privacy-policy",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.updatePrivacyPolicy),
  adminController.updatePrivacyPolicy
);

//Api to delete privacy policy
router.delete(
  "/delete-privacy-policy/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(adminValidation.deletePrivacyPolicy),
  adminController.deletePrivacyPolicy
);

module.exports = router;
