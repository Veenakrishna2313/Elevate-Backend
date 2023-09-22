const mongoose = require("mongoose");
const env = require("dotenv");
const winston = require("winston");
require("winston-mongodb");
const mongoDblogger=require("../Loggers/mongoDblogger")

module.exports = function () {
  env.config();
  const atlasConnectionURL = process.env.MONGODB_URI;

  mongoose
    .connect(atlasConnectionURL)
    .then(() => {
      mongoDblogger.info("Connected to MongoDB");
    })
    .catch((err) => {
      mongoDblogger.error("MongoDb connection error", err);
    });
};
