const express = require("express");
const app = express();
require("express-async-errors");
const winston = require("winston");
const logError = require("./Loggers/logError");
require("express-async-errors");
require("./startup/route")(app);
require("./startup/database")();
require("./startup/validation")();

  process.on("uncaughtException", (ex) => {
    logError.error(ex.message);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    logError.error(ex.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to your first backend router");
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
