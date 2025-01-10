//this defines all routes to get to the student data
const express = require('express');
//Import controllers
const {
    getAllMovies, 
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} = require('../controllers/movieController')

const validateMovie = require('../middlewares/validateMovie')
const router = express.Router();

//Define top level router and pass them to the controler
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', validateMovie, createMovie);
router.put('/:id', validateMovie, updateMovie);
router.delete('/:id', deleteMovie);

// Export this controller to server.js
module.exports = router;
