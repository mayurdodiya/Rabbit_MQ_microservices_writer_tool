const express = require("wt-server").express;
const router = express.Router();
const userApisRoutes = require("./userApi.route");
const productCategoryApisRoutes = require("./product-category.route");
const {
  enums: { ROLE },
} = require("wt-config");
const { ...db } = require("wt-schemas");

router.use((req, res, next) => {
  req.db = db;
  next();
});

router.use("/user", userApisRoutes);
router.use("/product-category", productCategoryApisRoutes);
router.use("/contactus", require("./contactus.route"));

module.exports = router;
