const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");

  if (!movies) res.status(404).send("No Movies found");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const currentMovie = await Movie.findById(req.params.id);
  if (!currentMovie) res.status(404).send("No movie with the given id");
   res.send(currentMovie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send("Invalid  genreid");

  const newMovie = await Movie.create({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  res.send(newMovie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!updatedMovie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(updatedMovie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
