const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const blogCategoryValidation = require("../validation/blogCategory.validation");

const { validate } = require("wt-utils");

const blogCategoryController = require("../controllers/blog-category.controller");
const { auth } = require("wt-server/middleware");
const router = express.Router();

router.post(
  "/create",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(blogCategoryValidation.createCate),
  blogCategoryController.createCate
);

router.get(
  "/get",
  validate(blogCategoryValidation.getCategoryValidator),
  blogCategoryController.getCate
);

//update
router.put(
  "/update/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(blogCategoryValidation.updateCate),
  blogCategoryController.updateCate
);

module.exports = router;  
