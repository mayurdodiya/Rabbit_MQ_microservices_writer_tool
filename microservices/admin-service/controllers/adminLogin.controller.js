const responseLib = require("wt-lib").resp;
const { UserModel } = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const { generateToken, comparePassword } = require("wt-utils/bcryptTokens");
const { ROLE: { ADMIN } } = require("wt-config").enums;

module.exports = {
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
     
      let emailExist = await UserModel.findOne({
        email: email,
        isActive: true,
      }).populate("roleId");
      
      if (!emailExist && req.body?.isSocial === false)
        return responseLib.BAD_REQUEST({
          res,
          message: message.ADMIN_EMAIL_NOT_FOUND,
        });
      
      if (emailExist.roleId.role !== ADMIN)
        return responseLib.BAD_REQUEST({
          res,
          message: message.ADMIN_EMAIL_NOT_FOUND,
        });

      const isPasswordCorrect = await comparePassword({
        password,
        hash: emailExist.password,
      });

      if (!isPasswordCorrect) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.INVALID_PASSWORD,
          payload: {},
        }); // If password doesn't match the user's password, throw an error.
      }

      return responseLib.OK({
        res,
        message: message.LOGIN_SUCCESS,
        payload: {
          user: emailExist,
          tokens: await generateToken({ _id: emailExist._id }), // Generate auth token.
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },
};
