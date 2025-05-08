const responseLib = require("wt-lib").resp;
const moment = require("moment");
const { ObjectId } = require("wt-server").mongoose.Types;
const { jwt } = require("wt-lib");

const {
  UserModel,
  OtpModel,
  RoleModel,
  BlogModel,
  ProductCategory,
} = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("wt-utils/bcryptTokens");

module.exports = {
  // //get message from broker and send it to the user
  // getMessage: async (req, res) => {
  //   try {
  //     //get message from broker
  //     // return responseLib.success(res, { message });
  //   } catch (error) {
  //     log.error("Error in getMessage:", error);
  //     return responseLib.error(res, { error });
  //   }
  // },
};
