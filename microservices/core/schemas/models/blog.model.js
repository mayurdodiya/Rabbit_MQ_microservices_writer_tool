const { Schema, model } = require("wt-server").mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      trim: true,
    },
    description: { type: Schema.Types.String, default: null, trim: true },
    sortDescription: { type: Schema.Types.String, default: null, trim: true },
    websiteLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    coverPhoto: { type: Schema.Types.String, default: null, trim: true },
    thumbnail: { type: Schema.Types.String, trim: true },
    blogCategoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: "blogcategories",
      },
    ],
    keyWords: [{ type: Schema.Types.String, trim: true, default: null }],
    slugId: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    instagramLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    facebookLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    linkedinLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    twitterLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    youtubeLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    coverPhotoAltTag: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    metaTitle: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    metaDescription: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    FAQs: [
      {
        question: { type: Schema.Types.String, trim: true },
        answer: { type: Schema.Types.String, trim: true },
      },
    ],
    uid: { type: Schema.Types.ObjectId, ref: "users" },
    createdBy: {
      type: Schema.Types.String,
      trim: true,
      default: "User",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    status: {
      type: Schema.Types.String,
      enums: ["Pending", "Approved", "Rejected", "Draft"],
      default: "Pending",
    },
    approvedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    isTrending: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isEditorPick: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isPaidBlog: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    readTime: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("blogs", blogSchema, "blogs");
