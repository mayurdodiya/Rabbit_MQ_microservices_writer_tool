var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var log = require("wt-lib").logger.log;

var errLib = require("wt-lib").error;
var responseLib = require("wt-lib").resp;
var cors = require("cors");
var morgan = require("morgan");


var factory = function (options) {
  var baseUrl = "/api/v1" + options.serviceRoute;
  this.service = express();
  this.service.use(cors());
  this.service.use(morgan("dev"));
  this.service.use(
    bodyParser.json({ limit: 1024 * 1024 * 200, type: "application/json" })
  );
  this.service.use(bodyParser.urlencoded({ extended: true }));
  this.service.use(cookieParser());

  this.service.use(express.static(path.join(__dirname, "public")));

  this.service.all("*", function (req, res, next) {
    log.debug(req.method + "  " + req.originalUrl);
    next();
  });
  log.debug("baseurl =", baseUrl);
  this.service.use(baseUrl, require(options.routeIndex));

  /// Define error handling routes
  // catch 404 and forward to error handler
  this.service.use(function (req, res, next) {
    log.error(errLib.errorMessages.pageNotFound);
    next(errLib.errorMessages.pageNotFound);
  });

  //General error handler
  this.service.use(function (err, req, res, next) {
    log.error(err);
    if (err) {
      return responseLib.CATCH_ERROR({ res, error: err });
      // return responseLib.handleError({ statusCode: 400, error: err }, res);
    }
  });

  return this.service;
};

exports.get = function (options) {
  if (!this.service) {
    this.service = factory(options);
  }
  return this.service;
};
