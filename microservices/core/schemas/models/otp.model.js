const { Schema, model } = require("wt-server").mongoose;

const otpSchema = new Schema(
  {
    otp: {
      type: Schema.Types.String,
      trim: true,
    },
    expires: {
      type: Schema.Types.Date,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("otps", otpSchema, "otps");
