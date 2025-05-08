const express = require("wt-server").express;
const router = express.Router();
const dashboardRoutes = require("./dashboard.route");
const adminLoginRoute = require("./adminApi.route");

const {
  enums: { ROLE },
} = require("wt-config");
const { ...db } = require("wt-schemas");
const { validate } = require("wt-utils");

router.use((req, res, next) => {
  req.db = db;
  next();
});

router.use("/dashboard", dashboardRoutes);

router.use("/admin", adminLoginRoute);

module.exports = router;
