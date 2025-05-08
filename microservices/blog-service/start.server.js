const path = require("path");
require("wt-lib").dotenv.config({ path: path.resolve(__dirname, "../.env") });
const server = require("wt-server").Server;
const connection = require("wt-server").Connection;
const msConfig = require("wt-config").microservices;

//* connect to MONOGO DB
connection();

//* user service
const blogService = new server(msConfig.services.blogService);

module.exports = blogService.service;
