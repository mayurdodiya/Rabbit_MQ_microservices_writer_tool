const express = require("wt-server").express;
const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const paymentValidation = require("../validation/payment.validation");

const { validate } = require("wt-utils");

// Controller
const paymentController = require("../controllers/payment.controller");

// Middleware
const { auth } = require("wt-server/middleware");

const router = express.Router();

router.post(
  "/payment-link",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(paymentValidation.createPaymentLink),
  paymentController.createPaymentLink
);

//webhook for lemonsqueezy
router.post("/webhook", paymentController.lemonsqueezyWebhook);

//get payment-history by user
router.get(
  "/get-my-payment-history",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER, ROLE.ADMIN] }),
  validate(paymentValidation.getPaymentHistoryByUser),
  paymentController.getPaymentHistoryByUser
);

//get payment-history by Admin
router.get(
  "/get-payment-history",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(paymentValidation.getPaymentHistoryByAdmin),
  paymentController.getPaymentHistoryByAdmin
);
module.exports = router;
