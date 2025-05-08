//controllers
const adminEventsController = require("../controllers/adminEvents.controller");
const express = require("wt-server").express;

const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const adminEventsValidation = require("../validation/adminEvents.validation");

const router = express.Router();

module.exports = router;
