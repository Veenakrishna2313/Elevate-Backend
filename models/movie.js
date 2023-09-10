const mongoose = require("mongoose");
const Joi = require("joi");
const {genreSchema} = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    minlength: 0,
    maxlength: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    minlength: 0,
    maxlength: 255,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    dailyRentalRate: Joi.number().min(0).required(),
    numberInStock: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
