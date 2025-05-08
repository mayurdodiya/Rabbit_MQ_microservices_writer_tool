var log = require("wt-lib").logger.log;
var mongoose = require("mongoose");

let MONGO_URL = process.env.MONGOURI;
var Connection = async () => {
  await mongoose
    .connect(MONGO_URL)
    .then(() => {
      log.info("MongoDb Connection Done");
    })
    .catch((err) => {
      log.info("error on connecting " + err);
    });
};

module.exports = Connection;
