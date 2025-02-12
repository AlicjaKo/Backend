const express = require('express') //we say that 'express' is required
const morgan = require('morgan'); //we install morgan
const app = express(); //app will be an alias for express()
const port = 3004; //we set up the port 3004

//Setting up margan in dev format
app.use(morgan('dev'));

//we add that express will be using json
app.use(express.json());

//we are setting up that app listens on the given port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

//the array that is going to be uploaded
const movies = [ 
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 }, 
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 }, 
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 } 
];

//get all the movies
app.get('/', (req, res) => {
    let myhtml = '<h1>Awesome movies!</h1>';
    myhtml += '<ul>';
    movies.forEach(movie => {
        myhtml += `<li>Movie: ${movie.title} was directed by ${movie.director} in ${movie.year}</li>`;
    });
    myhtml += '</ul>'
    res.send(myhtml);
})


//get all the movies
app.get('/movies', (req,res) => {
    let filteredMovies = movies;

    if ( req.query.title ) {
        filteredMovies = filteredMovies.filter( movie => movie.title === req.query.title);
    }

    if ( req.query.year ) {
        filteredMovies = filteredMovies.filter( movie => movie.year === parseInt(req.query.year));
    }
    if ( req.query.director ) {
        filteredMovies = filteredMovies.filter( movie => movie.director === req.query.director);
    }

    res.json ( filteredMovies );
});

//get the movie by an id
app.get('/movies/:id', (req,res) => {
    const movie = movies.find( movie => movie.id === parseInt( req.params.id ))
    if( movie ){
        res.json ( movie )
    }
    else {
        res.status(404).send('No movie found');
    }
});

//add a movie
app.post('/movies', (req,res) => {
    const { id, title, director, year } = req.body
    
    if( !title || !director || !year  ){
        //something missing or wrong
        return res.status(400).send('invalid post: movie was declared not correctly')
    }
    if( year < 1888 || year > new Date().getFullYear() ){
        //something missing or wrong
        return res.status(400).send('invalid post: invalid year of the movie')
    }
    // Generate a unique id for the new movie
    
    const newMovie = { id, title, director, year };
    movies.push( newMovie );
    res.status(201).json( newMovie );
})

//put request by id
app.put('/movies/:id', (req,res) => {
    const movie = movies.find( movie => movie.id === parseInt( req.params.id ))
    if( movie ){
        const { title, director, year } = req.body
        if( !title || !director || !year ){
            //something missing or wrong
            return res.status(400).send('invalid put: movie was declared not correctly')
        }
        movie.title = title;
        movie.director = director;
        movie.year = year;

        res.status(200).json(movie);
    }
    else {
        res.status(404).send('No movie found');
    }
});

//delete request by id
app.delete('/movies/:id', (req,res) => {
    const movie = movies.findIndex( movie => movie.id === parseInt( req.params.id ))
    if( movie !== -1 ){
        movies.splice(movie,1);

        res.status(204).send();
    }
    else {
        res.status(404).send('No movie found');
    }
});


// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found: The requested resource does not exist.');
});