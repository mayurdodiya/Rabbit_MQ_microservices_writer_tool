const log = require("wt-lib").logger.log;
const responseLib = require("wt-lib").resp;
const { enums } = require("wt-config");

async function validateSortQuery(req, res, allowedKeys, sortBy) {
  try {
    let sortQuery = sortBy[0] !== "-" ? sortBy : sortBy.slice(1, sortBy.length);
    if (allowedKeys.indexOf(sortQuery) === -1) {
      log.error("Invalid sort query");
      return responseLib.BAD_REQUEST({ res, message: "Invalid sort query" });
      throw new Error("Invalid sort query");
    }
  } catch (error) {
    log.error(error);
  }
}

module.exports = { validateSortQuery };
