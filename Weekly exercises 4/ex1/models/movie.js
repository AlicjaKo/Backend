//This defines movie schema
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { 
        type: Number, 
        required: true,
    },
    director: { type: String, required: true },
});
const Movie = mongoose.model('Movie', movieSchema, 'Movie Demo Collection');

module.export = Movie;