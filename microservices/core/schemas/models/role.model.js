const { Schema, model } = require("wt-server").mongoose;

const roleSchema = new Schema(
  {
    role: {
      type: Schema.Types.String,
      trim: true,
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

// const Role = mongoose.model("Role", roleSchema);
// module.exports = Role;
module.exports = model("roles", roleSchema, "roles");
