require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const env = require("dotenv");
env.config();
const atlasConnectionURL = process.env.MONGODB_URI;

const mongoDblogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logfile.log" }), // File transport
    new winston.transports.MongoDB({
      level: "info", // Log level for MongoDB transport (you can change it)
      db: atlasConnectionURL, // MongoDB connection URL
      options: {
        useUnifiedTopology: true,
      },
      collection: "logs", // Collection where logs will be stored in MongoDB
    }),
  ],
});

module.exports = mongoDblogger;