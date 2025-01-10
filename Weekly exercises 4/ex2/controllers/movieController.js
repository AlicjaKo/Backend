// This controlrel has functiones to routes
const Movie = require('../models/movie');

//GET /movies
const getAllMovies = async(req, res) => {
    try {
        const query = {};
        if (req.query.title) query.title = req.query.title;
        if (req.query.minYear) query.year = {$gte: parseInt(req.query.minYear)};
        const movies = await Movie.find(query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies' });
    }
};

//GET /movies/id
const getMovieById = async(req, res) => {
    try {
        const { id } = req.params;
        const movie = await moviesCollection.findOne({ _id: ObjectId(id) });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movie' });
    }
};

//POST /movie
const createMovie = async (req, res) => {
    try {
        const movie = req.body;

        if (!movie.title || !movie.director || !movie.year) {
            return res.status(400).json({ error: 'Missing required fields: title, director, or year' });
        }

        const result = await moviesCollection.insertOne(movie);
        res.status(201).json(result.ops[0]); // Return the newly added movie
    } catch (error) {
        res.status(500).json({ error: 'Error adding movie' });
    }
};

//PUT update an existing movie by ID
const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = req.body;

        if (!updatedMovie.title || !updatedMovie.director || !updatedMovie.year) {
            return res.status(400).json({ error: 'Missing required fields: title, director, or year' });
        }

        const result = await moviesCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updatedMovie }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating movie' });
    }
};

//DELETE a movie by ID
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await moviesCollection.deleteOne({ _id: ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(204).send(); // No content, successful deletion
    } catch (error) {
        res.status(500).json({ error: 'Error deleting movie' });
    }
};

// Export all controlers
module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
}