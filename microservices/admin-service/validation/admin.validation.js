const { create } = require("wt-schemas/models/role.model");
const Joi = require("wt-utils/joi.validation");

// Validator to validate get-all-users payload
const getAllUsers = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    isActive: Joi.boolean(),
    sortBy: Joi.string().trim(),
    sortOrder: Joi.string().trim().valid("asc", "desc"),
  }),
};

// Validator to validate update-user-status payload
const updateUserStatus = {
  body: Joi.object().keys({
    id: Joi.string().trim().required(),
    isActive: Joi.boolean().required(),
  }),
};

// Validator to validate change-blog-status payload
const changeBlogStatus = {
  body: Joi.object().keys({
    isTrending: Joi.boolean(),
    isEditorPick: Joi.boolean(),
    isActive: Joi.boolean(),
    status: Joi.string()
      .trim()
      .valid("Approved", "Rejected", "Pending", "Draft")
      .messages({
        "any.only": "status must be one of 'Approved', 'Rejected', 'Pending'",
      }),
  }),
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};

//Activate or Deactive a Category
const changeBlogCategoryStatus = {
  body: Joi.object().keys({
    isActive: Joi.boolean(),
  }),
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};

// Validator to validate get-all-blogs payload
const getAllBlogsValidator = {
  query: Joi.object().keys({
    id: Joi.string().trim(),
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
    status: Joi.string()
      .trim()
      .valid("Pending", "Rejected", "Approved")
      .messages({
        "any.only": "Status must be one of 'Pending', 'Rejected', 'Approved'",
      }),
    isTrending: Joi.boolean(),
    isEditorPick: Joi.boolean(),
    sortBy: Joi.string().trim(),
    createdBy: Joi.string().trim().valid("User", "Admin", "SuperAdmin"),
    sortOrder: Joi.string().trim().valid("asc", "desc"),
  }),
};

// Validator to validate get-all-newsletter-subscribers payload
const getAllNewsletterSubscribers = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    sortBy: Joi.string().trim().optional(),
    sortOrder: Joi.string().trim().valid("asc", "desc"),
  }),
};

// Validator to validate delete-newsletter-subscriber payload
const deleteNewsletterSubscriber = {
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};

// Validator to validate create Privacy-Policy payload
const createPrivacyPolicy = {
  body: Joi.object().keys({
    title: Joi.string().trim().optional(),
    content: Joi.string().trim().optional(),
    metaTitle: Joi.string().trim().optional(),
    metaDescription: Joi.string().trim().optional(),
    metaKeyWords: Joi.array().items(Joi.string().trim()).optional(),
  }),
};

// Validator to validate get-all-privacy-policies payload
const getAllPrivacyPolicies = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().trim().optional(),
    isDeleted: Joi.boolean(),
    id: Joi.string().trim(),
    sortBy: Joi.string().trim(),
    sortOrder: Joi.string().trim().valid("asc", "desc"),
    title: Joi.string().trim().valid("terms", "disclaimer", "policy", "home"),
  }),
};

// Validator to validate update-privacy-policy payload
const updatePrivacyPolicy = {
  body: Joi.object().keys({
    id: Joi.string().trim().required(),
    title: Joi.string().trim().optional(),
    content: Joi.string().trim().optional(),
    metaTitle: Joi.string().trim().optional(),
    metaDescription: Joi.string().trim().optional(),
    metaKeyWords: Joi.array().items(Joi.string().trim()).optional(),
  }),
};

// Validator to validate delete-privacy-policy payload
const deletePrivacyPolicy = {
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};
/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  getAllUsers,
  updateUserStatus,
  changeBlogStatus,
  changeBlogCategoryStatus,
  getAllBlogsValidator,
  getAllNewsletterSubscribers,
  deleteNewsletterSubscriber,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  getAllPrivacyPolicies,
  deletePrivacyPolicy,
};
