const winston=require('winston');

 const logError = winston.createLogger({
   level: "info", // Change the level to 'info' or 'debug' to capture more messages
   transports: [new winston.transports.File({ filename: "logfile.log" })],
 });

module.exports = function (err, req, res, next) {
logError.error(err.message)
  res.status(500).send("Something happened");
};