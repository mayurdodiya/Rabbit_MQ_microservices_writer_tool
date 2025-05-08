const path = require("path");
require("wt-lib").dotenv.config({ path: path.resolve(__dirname, "../.env") });
const server = require("wt-server").Server;
const connection = require("wt-server").Connection;
const msConfig = require("wt-config").microservices;
const { userVerificationJob } = require("./utils/scheduler");

//* connect to MONOGO DB
connection();

//  Function to Start All cron Jobs
(() => {
  userVerificationJob.start();
})();

//* user service
const userService = new server(msConfig.services.userService);

module.exports = userService.service;
