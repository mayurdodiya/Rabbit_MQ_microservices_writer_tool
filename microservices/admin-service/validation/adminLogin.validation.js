const Joi = require("wt-utils/joi.validation");

/**
 * Login.
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
};

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  login,
};
