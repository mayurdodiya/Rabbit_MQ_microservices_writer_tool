const Joi = require("wt-utils/joi.validation");

const createCate = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().default(""),
  }),
};

const updateCate = {
  body: Joi.object().keys({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    isActive: Joi.boolean(),
  }),
};
/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  createCate,
  updateCate,
};
