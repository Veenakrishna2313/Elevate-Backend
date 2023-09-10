const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");

  if (!rentals) res.status(404).send("No rentals found");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const currentRental = await Rental.findById(req.params.id);
  if (!currentRental) res.status(404).send("No Rental with the given id");
  res.send(currentRental);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    //start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      session.endSession();
      return res.status(404).send("Invalid customer");
    }

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      session.endSession();
      return res.status(400).send("Invalid movie");
    }

    if (movie.numberInStock === 0) {
      session.endSession();
      return res.status(400).send("Movie not in stock");
    }

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save({ session });
    movie.numberInStock--;

    await rental.save({ session });
    await movie.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send(rental);
  } catch (error) {
    session.endSession();
    res.status(500).send("An error occurred while processing the request.");
  }
});

module.exports = router;
