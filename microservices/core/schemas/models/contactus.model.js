const { Schema, model } = require("wt-server").mongoose;

const contactusSchema = new Schema(
  {
    username: { type: String,  },
    email: { type: String, required: true },
    mobileNo: { type: String,  },
    message: { type: String,  },
    
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("contactus", contactusSchema, "contactus");
