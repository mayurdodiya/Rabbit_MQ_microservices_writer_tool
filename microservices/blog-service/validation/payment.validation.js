/**
 * All auth validations are exported from here 👇
 */
const Joi = require("wt-utils/joi.validation");

//create PaymentLink
const createPaymentLink = {
  body: Joi.object().keys({
    blogId: Joi.string().required(),
    price: Joi.number().default(0.99),
    currency: Joi.string().default("USD"),
  }),
};

//get PaymentHistory by user
const getPaymentHistoryByUser = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    blogId: Joi.string().optional(),
  }),
};

//get PaymentHistory by Admin
const getPaymentHistoryByAdmin = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    blogId: Joi.string().optional(),
    uid: Joi.string().optional(),
    search: Joi.string().optional(),
  }),
};

module.exports = {
  createPaymentLink,
  getPaymentHistoryByUser,
  getPaymentHistoryByAdmin,
};
