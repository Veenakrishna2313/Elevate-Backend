const express = require("express");
const app = express();
const logger=require('./logger');
const authenticator =require('./authenticator');
const genres=require('./routes/genres');
const customers=require('./routes/customers');
const movies=require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const mongoose = require("mongoose");
const env = require('dotenv');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const PORT = process.env.PORT || 3000;

env.config();
const atlasConnectionURL = process.env.MONGODB_URI;


mongoose.connect(atlasConnectionURL)
  .then(() => {
    console.log("Connected to MongoDB");
    
  })
  .catch((err) => console.log("Couldn't connect", err));

app.use(express.json());
app.use(logger);
app.use(authenticator);
app.use("/api/genres",genres);
app.use("/api/customers",customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);


app.get("/", (req, res) => {
  res.send("Welcome to your first backend router");
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


