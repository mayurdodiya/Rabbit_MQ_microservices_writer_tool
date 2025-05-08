// var log = require("./logger.lib").log;
// var errLib = require("./error.lib");
// const _ = require("lodash");
// const flatten = require("flat");

// exports.createResponseObject = ({ req, result = 0, message = "", payload = {}, logPayload = false }) => {
//   let payload2log = {};
//   if (logPayload) {
//     payload2log = flatten({ ...payload });
//   }

//   let messageToLog = `RES [${req.requestId}] [${req.method}] ${req.originalUrl}`;
//   messageToLog +=
//     (!_.isEmpty(message) ? `\n${message}` : "") + (!_.isEmpty(payload) && logPayload ? `\npayload: ${JSON.stringify(payload2log, null, 4)}` : "");

//   if (result < 0 && (result !== -50 || result !== -51)) {
//     console.error(messageToLog);
//     // log.error(messageToLog);
//   } else if (!_.isEmpty(messageToLog)) {
//     console.log(messageToLog);
//     // log.info(messageToLog);
//   }

//   return { result: result, message: message, payload: payload };
// };

var log = require("./logger.lib").log;
var errLib = require("./error.lib");
const {
  enums: { HTTP_CODES },
} = require("wt-config");

// exports.handleError = function (err, res) {
//   var statusCode = err.statusCode || 500;
//   return res.status(statusCode).json({
//     status: 'ERROR',
//     statusCode: statusCode,
//     language: 'en_US',
//     payload: null,
//     error: err.error || err.message || err
//   });
// }

// exports.handleSuccess = function (data, res) {
//   return res.status(200).json({
//     status: 'SUCCESS',
//     statusCode: 200,
//     language: 'en_US',
//     payload: data,
//     error: null
//   });
// }

// var handleJsonResponse = function (err, response, body, cb) {
//   //handle error
//   if (err) {
//     // log.error(err);
//     console.error(err);
//     if (cb) {
//       // log.error(err);
//       console.error(err);
//       return cb(errLib.errorMessages.systemError);
//     } else {
//       return;
//     }
//   }

//   //JSON parsing is not needed in all cases. Mainly get apis are returned as document and it needs parsing
//   var jsonBody = body;
//   if (!body.status) {
//     jsonBody = jsonParseSafe(body);
//   }

//   if (!jsonBody.status) {
//     // log.error('Response is not in expected format : ' + body);
//     console.error('Response is not in expected format : ' + body);
//     if (cb) {
//       return cb(errLib.errorMessages.invalidResponse);
//     } else {
//       return;
//     }
//   }
//   //Handle API error
//   if (jsonBody.status.toUpperCase() === 'ERROR' || jsonBody.statusCode !== 200) {
//     // log.error(jsonBody);
//     console.error(jsonBody);
//     if (cb) {
//       return cb(jsonBody);
//     } else {
//       return;
//     }
//   }

//   if (cb) {
//     return cb(null, jsonBody.data);
//   } else {
//     return;
//   }
// };

module.exports = {
  BAD_REQUEST: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message,
      payload,
    });
  },

  DUPLICATE_VALUE: ({
    res,
    message = "Duplicate value.",
    payload = {},
  } = {}) => {
    res.status(HTTP_CODES.DUPLICATE_VALUE).json({
      success: false,
      message,
      payload,
    });
  },

  FORBIDDEN: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.FORBIDDEN).json({
      success: false,
      message,
      payload,
    });
  },

  CATCH_ERROR: ({ res, message = "-", payload = {} } = {}) => {
    let responseCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
    if (
      (message && message.includes("validation failed")) ||
      message.includes("duplicate key error collection")
    )
      responseCode = HTTP_CODES.BAD_REQUEST;
    res.status(responseCode).json({
      success: false,
      message,
      payload,
    });
  },

  METHOD_NOT_ALLOWED: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json({
      success: false,
      message,
      payload,
    });
  },

  MOVED_PERMANENTLY: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.MOVED_PERMANENTLY).json({
      success: false,
      message,
      payload,
    });
  },

  NOT_ACCEPTABLE: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.NOT_ACCEPTABLE).json({
      success: false,
      message,
      payload,
    });
  },

  NOT_FOUND: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.NOT_FOUND).json({
      success: false,
      message,
      payload,
    });
  },

  NO_CONTENT_FOUND: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.NO_CONTENT_FOUND).json({
      success: false,
      message,
      payload,
    });
  },

  OK: ({ res, message = "-", payload = {}, count } = {}) => {
    res.status(HTTP_CODES.OK).json({
      success: true,
      message,
      payload,
      count,
    });
  },

  PERMANENT_REDIRECT: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.PERMANENT_REDIRECT).json({
      success: false,
      message,
      payload,
    });
  },

  UNAUTHORIZED: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.UNAUTHORIZED).json({
      success: false,
      message,
      payload,
    });
  },

  UPGRADE_REQUIRED: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.UPGRADE_REQUIRED).json({
      success: false,
      message,
      payload,
    });
  },

  VALIDATION_ERROR: ({ res, message = "-", payload = {} } = {}) => {
    res.status(HTTP_CODES.VALIDATION_ERROR).json({
      success: false,
      message,
      payload,
    });
  },
};
