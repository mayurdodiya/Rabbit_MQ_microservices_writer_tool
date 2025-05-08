const jwt = require("wt-lib").jwt;
const responseLib = require("wt-lib").resp;
const {
  enums: { ROLE },
} = require("wt-config");
const log = require("wt-lib").logger.log;
const { message } = require("wt-utils");
const { MulterError } = require("multer");

// exports.auth = (roles) =>
//   async function (req, res, next) {
//     try {
//       let token = (req.header('x-auth-token') || req.header('Authorization'))?.replace(/Bearer +/g, '');

//       //* Check for token type Bearer
//       if (!token) {
//         return responseLib.BAD_REQUEST({ res, message: message.TOKEN_MISSING, });
//       }

//       const decodedData = jwt.decodeToken(token);

//       if (roles?.length > 0 && !roles?.includes(decodedData.role)) {
//         return responseLib.UNAUTHORIZED({ res, message: message.UNAUTHORIZED, });
//       }

//       if (decodedData._id) {
//         req.user = decodedData;
//         return next();
//       }

//       return responseLib.BAD_REQUEST({ res, message: message.GENERAL_ERROR, });
//     } catch (error) {
//       console.log("Error in auth middleware", error);
//       return responseLib.CATCH_ERROR({ res, message: message.GENERAL_ERROR, });
//     }
//   };

module.exports = {
  auth: ({ isTokenRequired = true, usersAllowed = [] } = {}) => {
    return async (req, res, next) => {
      //* get token from request header and remove Bearer from it
      let token = (
        req.header("x-auth-token") || req.header("Authorization")
      )?.replace(/Bearer +/g, "");

      //* check if token is required and token is present in the request header or not
      if (isTokenRequired && !token)
        return responseLib.BAD_REQUEST({
          res,
          message: message.TOKEN_REQUIRED,
        });

      if (!isTokenRequired && !token) return next();

      //* decode token and get user details from it
      let decoded = jwt.jwt.decode(token);
      //* log decoded token details
      log.info(`[DECODED] [CONTENT: ${JSON.stringify(decoded)}]`);

      //* check if token is valid or not
      if (!decoded?._id)
        return responseLib.UNAUTHORIZED({
          res,
          message: message.INVALID_TOKEN,
        });
      //* get user details from database
      let user = await req.db.UserModel.findOne({
        _id: decoded._id,
        // ...(decoded._id && { _id: decoded._id }),
        // ...(decoded.email && { email: decoded.email }),
        // isActive: true,
      })
        .populate("roleId")
        .lean();

      //* check if user is deleted or not
      if (!user)
        return responseLib.UNAUTHORIZED({
          res,
          message: message.INVALID_TOKEN,
        });

      //* check if user is active or not
      if (!user.isActive && user.isUpdateRole)
        return responseLib.UNAUTHORIZED({
          res,
          message: message.ACCOUNT_DISABLED,
        });

      //* set user details in request object
      req.user = {
        ...decoded,
        ...user,
        _id: user._id.toString(),
        role: user?.roleId?.role,
      };

      //* check if user is admin or not
      if (req.user.role === ROLE.ADMIN || usersAllowed.includes("*"))
        return next();

      //* check if user is allowed to access the resource or not
      if (usersAllowed.includes(req.user.role)) return next();

      return responseLib.UNAUTHORIZED({ res, message: message.UNAUTHORIZED });
    };
  },

  errorHandaler: () => {
    log.error("ERROR MESSAGE: ", error.message, "\nERROR STACK: ", error.stack);

    if (error instanceof MulterError) {
      log.error(error);
      return responseLib.BAD_REQUEST({
        res,
        message: message.INVALID_FIELD,
        payload: { context: error.code },
      });
    }

    if (
      error instanceof JsonWebTokenError ||
      error instanceof NotBeforeError ||
      error instanceof TokenExpiredError
    )
      return responseLib.UNAUTHORIZED({ res, message: message.INVALID_TOKEN });

    return responseLib.CATCH_ERROR({
      res,
      message: message.INTERNAL_SERVER_ERROR,
      payload: { context: error.message },
    });
  },
};
