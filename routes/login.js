const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity");
const jwt=require("jsonwebtoken");
const env = require("dotenv");


env.config();
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  let newUser = await User.findOne({ email: req.body.email });
  if (!newUser) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(
    req.body.password,
    newUser.password
  );

  if (!validPassword) return res.status(400).send("Invalid email or password");
    
const token=newUser.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(),
  });

  return schema.validate(user);
}
module.exports = router;
