const { Schema, model } = require("wt-server").mongoose;

const likeDislikeHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "blogs", required: true },
    action: {
      type: Schema.Types.String,
      enum: ["like", "dislike"],
      required: true,
    },
    createdAt: { type: Schema.Types.Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model(
  "likeDislikeHistory",
  likeDislikeHistorySchema,
  "likeDislikeHistory"
);
