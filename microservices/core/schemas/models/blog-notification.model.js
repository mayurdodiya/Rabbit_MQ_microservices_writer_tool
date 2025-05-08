const { Schema, model } = require("wt-server").mongoose;

const blogNotificationSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: Schema.Types.String,
      default: null,
    },
    isRead: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isDisplay: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model(
  "blogNotification",
  blogNotificationSchema,
  "blogNotification"
);
