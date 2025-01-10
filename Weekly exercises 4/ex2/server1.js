require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectToDatabase = require('./config/db');
const moviesRoutes = require('./routes/movies');

const app = express();
const PORT = 3004;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

//General route
app.get('/', (req, res) => {
    res.send("Welcome to movie management system!")
});

//Routes for the whole app
app.use('/movies', moviesRoutes);

// Start the server
const startServer = async() => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log("Server running on port 3004");
    });
};

startServer();

// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found: The requested resource does not exist.');
});