const Joi = require('joi');
const Movie = require('../models/movie');

const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
});

const createMovie = async (req, res) => {
    try {
        // Validate input with Joi
        const { error } = movieSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Save to database
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create movie' });
    }
};

module.exports =  createMovie;

