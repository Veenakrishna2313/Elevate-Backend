const express = require("express");
const { Customer, validate } = require("../models/customer");
const Joi = require("joi");
const router = express.Router();
const auth = require("./../middleware/auth");

router.get("/", async (req, res) => {
  const allCustomers = await Customer.find().sort("name");

  res.send(allCustomers);
});

router.get("/:id", async (req, res) => {
  const requestedCustomer = await Customer.findById(req.params.id);

  if (!requestedCustomer)
    res.status(404).send("Customer with the given id was not found");
  res.send(requestedCustomer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:id",auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(404).send(error.details[0].message);

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!updatedCustomer) res.status(404).send("id doesn't exist");

  res.send(updatedCustomer);
});

router.delete("/:id", auth,async (req, res) => {
  const deletedCustomer = await Customer.findOneAndDelete(req.params.id);

  if (!deletedCustomer) res.status.send("Not able to delete customer");

  res.send(deletedCustomer);
});

module.exports = router;
