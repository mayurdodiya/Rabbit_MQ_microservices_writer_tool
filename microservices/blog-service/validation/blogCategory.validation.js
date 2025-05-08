const Joi = require("wt-utils/joi.validation");

/**
 * Validatotr to validate create api payload
 */
const createCate = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().default(""),
    slugId: Joi.string().optional(),
  }),
};

/**
 * Validatotr to validate update api payload
 */
const updateCate = {
  body: Joi.object().keys({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    isActive: Joi.boolean(),
  }),
};

/**
 * Validatotr to validate get api payload
 */
const getCategoryValidator = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    sortBy: Joi.string().trim().default("createdAt"),
    sortOrder: Joi.number().default(-1),
    isActive: Joi.boolean(),
    id: Joi.string().trim().optional(),
    slugId: Joi.string().trim().optional(),
  }),
};
module.exports = {
  createCate,
  updateCate,
  getCategoryValidator,
};
