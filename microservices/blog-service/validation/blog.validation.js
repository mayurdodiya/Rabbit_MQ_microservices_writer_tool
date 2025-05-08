/**
 * All auth validations are exported from here 👇
 */
const Joi = require("wt-utils/joi.validation");

//create
const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    sortDescription: Joi.string().required(),
    websiteLink: Joi.string().default(null),
    slugId: Joi.string().optional(),
    instagramLink: Joi.string().default(null),
    facebookLink: Joi.string().default(null),
    linkedinLink: Joi.string().default(null),
    twitterLink: Joi.string().default(null),
    youtubeLink: Joi.string().default(null),
    status: Joi.string().valid("Pending", "Draft"),
    blogCategoryId: Joi.array().items(Joi.string().min(3).trim().required()),
    keyWords: Joi.array().items(Joi.string().trim()),
    coverPhotoAltTag: Joi.string().default(null),
    metaTitle: Joi.string().default(null),
    metaDescription: Joi.string().default(null),
    FAQs: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().trim().required(),
          answer: Joi.string().trim().required(),
        })
      )
      .default([]),
    readTime: Joi.string().trim().required(),
  }),
};

//update
const updateBlog = {
  body: Joi.object().keys({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    sortDescription: Joi.string().allow(""),
    websiteLink: Joi.string().allow(""),
    slugId: Joi.string().allow(""),
    instagramLink: Joi.string().allow(""),
    facebookLink: Joi.string().allow(""),
    linkedinLink: Joi.string().allow(""),
    twitterLink: Joi.string().allow(""),
    youtubeLink: Joi.string().allow(""),
    blogCategoryId: Joi.array().items(Joi.string().min(3).trim().required()),
    status: Joi.string().valid("Pending", "Draft", "Approved"),
    keyWords: Joi.array().items(Joi.string().trim()).optional(),
    coverPhotoAltTag: Joi.string().allow(""),
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
    FAQs: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().trim().required(),
          answer: Joi.string().trim().required(),
        })
      )
      .optional(),
    readTime: Joi.string().allow(""),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getBlogs = {
  query: Joi.object().keys({
    id: Joi.string().optional(),
    slugId: Joi.string().optional(),
    search: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
    status: Joi.string()
      .trim()
      .valid("Approved", "Pending", "Draft", "Published")
      .messages({
        "any.only":
          "status must be one of 'Draft', 'Published', 'Pending','Approved'",
      }),
    //   .default("Approved"),
    isTrending: Joi.boolean().optional(),
    isEditorPick: Joi.boolean().optional(),
    blogCategory: Joi.array().items(Joi.string().required()),
    blogCategorySlugIds: Joi.array().items(Joi.string().required()),
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
  }),
};

// Validator to validate save-blogs payload
const saveBlogsValidator = {
  query: Joi.object().keys({
    blogId: Joi.string().trim().required(),
  }),
};

//get saved blogs

const getSavedBlogValidator = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
  }),
};

const getEditorBlogs = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
    search: Joi.string().optional(),
  }),
};

const subscribe4NewsLetter = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const unsubscribe4NewsLetter = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const likeBlogValidator = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

const getExploreBlogs = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
    search: Joi.string().optional(),
  }),
};
module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  saveBlogsValidator,
  getEditorBlogs,
  getSavedBlogValidator,
  subscribe4NewsLetter,
  unsubscribe4NewsLetter,
  likeBlogValidator,
  getExploreBlogs,
};
