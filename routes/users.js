const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const mongoose=require('mongoose');

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  let newUser=await User.findOne({email:req.body.email});
  if(newUser) return res.status(400).send("User already registered");

  try {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.send(newUser);
  } catch (err) {
    console.error("Error in creating a new User");
    res.status(500).send("failed to create a new User", err);
  }
  
});

module.exports=router;