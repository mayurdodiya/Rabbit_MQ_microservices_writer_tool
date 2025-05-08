const express = require("wt-server").express;
const {
  enums: { ROLE },
} = require("wt-config");
const { auth } = require("wt-server/middleware");
const { validate } = require("wt-utils");
const toneController = require("../controllers/tone.controller");
const toneValidaton = require("../validation/tone.validation");
const router = express.Router();

// Api end point to create tone
router.post(
  "/create",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(toneValidaton.createTone),
  toneController.createTone
);

router.get(
  "/get",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(toneValidaton.getTone),
  toneController.getAllTones
);

router.put(
  "/update",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(toneValidaton.updateTone),
  toneController.updateTone
);

//Activate or Deactive a Tone
router.put(
  "/change-tone-status/:id",
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  validate(toneValidaton.changeToneStatus),
  toneController.changeToneStatus
);




module.exports = router;
