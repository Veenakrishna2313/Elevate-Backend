require("express-async-errors");
const winston = require("winston");

const logError = winston.createLogger({
  level: "info", // Change the level to 'info' or 'debug' to capture more messages
  transports: [new winston.transports.File({ filename: "logfile.log" })],
});

module.exports =logError;
