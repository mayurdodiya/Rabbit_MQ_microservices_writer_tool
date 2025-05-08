const { model, Schema } = require("wt-server").mongoose;

const toneSchema = new Schema(
  {
    tone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("tone", toneSchema, "tone");
