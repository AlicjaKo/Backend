const express = require('express');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3004;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://mongo:mongo@cluster0.4hki1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let moviesCollection;

async function connectDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('moviesDB');
        moviesCollection = db.collection('movies');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

connectDB();

// GET all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await moviesCollection.find().toArray();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// GET a specific movie by ID
app.get('/movies/:id', async (req, res) => {
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
});

// POST a new movie
app.post('/movies', async (req, res) => {
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
});

// PUT update an existing movie by ID
app.put('/movies/:id', async (req, res) => {
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
});

// DELETE a movie by ID
app.delete('/movies/:id', async (req, res) => {
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
});

// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found: The requested resource does not exist.');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
