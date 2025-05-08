const express = require("wt-server").express;
const router = express.Router();
const adminEventsApisRoutes = require("./adminEventsApi.route");
const {
  enums: { ROLE },
} = require("wt-config");
const { ...db } = require("wt-schemas");

router.use((req, res, next) => {
  req.db = db;
  next();
});

router.use("/admin-events", adminEventsApisRoutes);

module.exports = router;
