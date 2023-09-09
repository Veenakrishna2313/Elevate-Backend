const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");


router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  if (!genres) return res.status(404).send("No genres found");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const gen = await Genre.findById(req.params.id);

  if (!gen) return res.status(404).send("Genre not found");
  res.send(gen);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error);

  try {
    const newGenre = await Genre.create({
      name: req.body.name,
    });
    res.send(newGenre);
  } catch (err) {
    console.error("Error in creating a new genre");
    res.status(500).send("failed to create a new genre", err);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre) return res.status(404).send("id doesnt exist");

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const gen = await Genre.findByIdAndDelete(req.params.id);

  if (!gen) return res.status(404).send("Invalid genre");

  res.send(gen);
});

module.exports = router;
