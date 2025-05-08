const express = require("wt-server").express;
const router = express.Router();
// Routes
const blogCategoryApisRoutes = require("./blogCategory.route");
const blogApisRoutes = require("./blog.route");
const paymentApisRoutes = require("./payment.route");
const toneAPiRoutes = require('./tone.route')

const {
  enums: { ROLE },
} = require("wt-config");
const { ...db } = require("wt-schemas");

router.use((req, res, next) => {
  req.db = db;
  next();
});

router.use("/blog-categories", blogCategoryApisRoutes);
router.use("/blogs", blogApisRoutes);
router.use("/payment", paymentApisRoutes);
router.use("/tone", toneAPiRoutes);

module.exports = router;
  