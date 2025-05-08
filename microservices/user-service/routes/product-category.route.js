//controllers
const productCategoryController = require("../controllers/product-category");
const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const productCategoryValidation = require("../validation/product-category.validation");

const { validate } = require("wt-utils");
const { auth } = require("wt-server/middleware");
const router = express.Router();

router.post(
  "/create",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER] }),
  validate(productCategoryValidation.createCate),
  productCategoryController.createCate
);

router.get("/get", productCategoryController.getCate);

router.put(
  "/update/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.USER] }),
  validate(productCategoryValidation.updateCate),
  productCategoryController.updateCate
);

module.exports = router;
