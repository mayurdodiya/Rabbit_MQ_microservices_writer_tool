const jwt = require("jsonwebtoken");
const { log } = require("./logger.lib");


exports.encodeToken = function (data, expiresIn) {
  try {
    log.debug("data to be encoded", data, process.env.JWT_SECRET);
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: expiresIn || "365d" });
    return token;
  } catch (error) {
    log.error("error while encoding the token", error);
    return error;
  }
};

exports.decodeToken = function (encToken) {
  try {
    const token = jwt.verify(encToken, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    log.error("error while decoding the token", error);
    return error;
  }
};
exports.jwt = jwt;
