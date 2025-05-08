const { Schema, model } = require("wt-server").mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    userName: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    privacyAccepted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      lowercase: true,
    },
    mobileNo: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    password: {
      type: Schema.Types.String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    isSocial: { type: Schema.Types.Boolean, default: false },
    refreshToken: { type: Schema.Types.String, default: null },
    accessToken: { type: Schema.Types.String, default: null },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
    isEmailVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "productcategories",
    },
    productName: { type: Schema.Types.String, default: null },
    productURL: { type: Schema.Types.String, default: null },
    interestedCategories: [
      { type: Schema.Types.ObjectId, ref: "blogcategories" },
    ],
    profileImage: { type: Schema.Types.String, default: null },
    shortBio: { type: Schema.Types.String, default: null },
    instagramLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    facebookLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    linkedinLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    twitterLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    youtubeLink: {
      type: Schema.Types.String,
      trim: true,
      default: null,
    },
    isProfileCompleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = model("users", userSchema, "users");
