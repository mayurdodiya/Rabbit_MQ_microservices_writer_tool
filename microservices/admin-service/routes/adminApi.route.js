//controllers
const adminController = require("../controllers/adminLogin.controller");
const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const adminValidation = require("../validation/adminLogin.validation");

const { validate } = require("wt-utils");
const { auth } = require("wt-server/middleware");
const router = express.Router();

/**
 * Admin-Login
 */

router.post(
  "/login",
  validate(adminValidation.login),
  adminController.adminLogin
);

module.exports = router;
