const path = require("path");
require("wt-lib").dotenv.config({ path: path.resolve(__dirname, "../.env") });
const server = require("wt-server").Server;
const connection = require("wt-server").Connection;
const msConfig = require("wt-config").microservices;

//* connect to MONOGO DB
connection();

//* event-bus service
const eventBusService = new server(msConfig.services.eventBusService);

module.exports = eventBusService.service;
