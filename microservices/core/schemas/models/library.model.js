const { Schema, model } = require("wt-server").mongoose;

// Schema to save blogs of user
const librarySchema = new Schema(
  {
    // Blog id
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
      default: null,
    },

    // User who saved the blog
    uid: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("library", librarySchema, "library");
