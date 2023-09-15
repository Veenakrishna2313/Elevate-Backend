const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  let newUser = await User.findOne({ email: req.body.email });
  if (newUser) return res.status(400).send("User already registered");

  try {
    newUser = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    const token = newUser.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(newUser, ["_id", "name", "email"]));
  } catch (err) {
    console.error("Error in creating a new User");
    res.status(500).send("failed to create a new User", err);
  }
});

module.exports = router;
