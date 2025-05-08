const { Schema, model } = require("wt-server").mongoose;

const newsLetterSchema = new Schema(
  {
    email: {
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
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("newsLetter", newsLetterSchema, "newsLetter");
