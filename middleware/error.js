const winston = require("winston");
const logError = require("../Loggers/logError");
const mongoDblogger = require("../Loggers/mongoDblogger");

module.exports = function (err, req, res, next) {
  logError.error(err.message);
  mongoDblogger.error(err.message);
  res.status(500).send("Something happened");
};
