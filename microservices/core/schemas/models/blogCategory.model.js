const { Schema, model } = require("wt-server").mongoose;

const blogCategorySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      trim: true,
    },
    description: { type: Schema.Types.String, default: null, trim: true },
    slugId: { type: Schema.Types.String, default: null, trim: true },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("blogcategories", blogCategorySchema, "blogcategories");
