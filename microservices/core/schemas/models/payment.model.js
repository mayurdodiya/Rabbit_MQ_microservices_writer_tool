const { Schema, model } = require("wt-server").mongoose;

const paymentSchema = new Schema(
  {
    uid: { type: Schema.Types.ObjectId, ref: "users" },
    blogId: { type: Schema.Types.ObjectId, ref: "blogs" },
    sessionData: [], // this will be an array of objects
    paymentId: { type: Schema.Types.String, default: null },
    amount: { type: Schema.Types.Number, default: 0 },
    status: {
      type: Schema.Types.String,
      default: "Pending",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("payment", paymentSchema, "payment");
