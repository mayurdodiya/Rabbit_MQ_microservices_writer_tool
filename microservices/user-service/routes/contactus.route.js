//controllers
const ContactusController = require("../controllers/contactus.js");
const express = require("wt-server").express;

const router = express.Router();
const { auth } = require("wt-server/middleware");

const {
    enums: { ROLE },
  } = require("wt-config");
  
router.post(
  "/addContact",
  ContactusController.addContact
);

router.get("/getContacts",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
    ContactusController.getContacts);


module.exports = router;
