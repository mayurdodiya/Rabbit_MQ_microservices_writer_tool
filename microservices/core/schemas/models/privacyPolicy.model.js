const { Schema, model } = require("wt-server").mongoose;

const privacyPolicySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      trim: true,
    },
    content: {
      type: Schema.Types.String,
      trim: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    metaTitle: {
      type: Schema.Types.String,
      trim: true,
    },
    metaDescription: {
      type: Schema.Types.String,
      trim: true,
    },
    metaKeyWords: [String],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("privacyPolicy", privacyPolicySchema, "privacyPolicy");
