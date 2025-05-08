const Joi = require("wt-utils/joi.validation");

const createTone = {
  body: Joi.object().keys({
    tone: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const updateTone = {
  body: Joi.object().keys({
    tone: Joi.string(),
    description: Joi.string(),
  }),
};

const getTone = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
    id: Joi.string().trim().optional(),
  }),
};

const changeToneStatus = {
  body: Joi.object().keys({
    isActive: Joi.boolean(),
  }),
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};



module.exports = {
  createTone,
  getTone,
  updateTone,
  changeToneStatus,
};
