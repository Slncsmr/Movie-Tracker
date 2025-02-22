const http = require('http');
const url = require('url');
const qstring = require('querystring');
const fs = require('fs');
const APIKEY = "" // Place your OMDb API key here

let movieHistory = []; // Array to store movie search history

// Function to read movie history from the file and update movieHistory array
function loadMovieHistory() {
    const filePath = 'movies.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err && data) {
            movieHistory = JSON.parse(data);
        }
    });
}

// Function to append movie data to a JSON file and prevent duplicates
function appendMovieDataToFile(movieData) {
    const filePath = 'movies.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return;
        }

        let movies = [];
        if (data) {
            movies = JSON.parse(data);
        }

        // Prevent duplicate entries
        if (!movies.some(movie => movie.Title === movieData.Title)) {
            movies.push(movieData);
        }

        fs.writeFile(filePath, JSON.stringify(movies, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            }
        });
    });
}

function sendResponse(movieData, res) {
    let page = '<html>' +
               '<head>'+
                    '<title>Movie Tracker</title>'+
                    '<link rel="stylesheet" href="style.css">'+
               '</head>' +
               '<body>' +
                    '<form method="post">' +
                    'Movie Name: <input name="movie"><br>' +
                    '<input type="submit" value="Get Movie Info">' +
                    '</form>';

    // Display current movie search result
    if (movieData) {
        page += `<h1>Current Movie Info</h1>
                 <p><strong>Title:</strong> ${movieData.Title}</p>
                 <p><strong>Year:</strong> ${movieData.Year}</p>
                 <p><strong>Genre:</strong> ${movieData.Genre}</p>
                 <p><strong>Director:</strong> ${movieData.Director}</p>
                 <p><strong>Actors:</strong> ${movieData.Actors}</p>
                 <p><strong>Plot:</strong> ${movieData.Plot}</p>`;
    }

    // Display history of previously searched movies in stack format (latest first)
    if (movieHistory.length > 0) {
        page += `<h2>Previous Movie Searches:</h2>`;
        movieHistory.slice().reverse().forEach(movie => {  // Reverse to show latest first
            page += `<div style="border-bottom: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                        <p><strong>Title:</strong> ${movie.Title}</p>
                        <p><strong>Year:</strong> ${movie.Year}</p>
                        <p><strong>Genre:</strong> ${movie.Genre}</p>
                        <p><strong>Director:</strong> ${movie.Director}</p>
                        <p><strong>Actors:</strong> ${movie.Actors}</p>
                        <p><strong>Plot:</strong> ${movie.Plot}</p>
                     </div>`;
        });
    }

    page += '</body></html>';
    res.end(page);
}

function parseMovie(movieResponse, res) {
    let movieData = '';
    movieResponse.on('data', function (chunk) {
        movieData += chunk;
    });

    movieResponse.on('end', function () {
        const movieJson = JSON.parse(movieData);
        const selectedData = {
            Title: movieJson.Title,
            Year: movieJson.Year,
            Genre: movieJson.Genre,
            Director: movieJson.Director,
            Actors: movieJson.Actors,
            Plot: movieJson.Plot
        };

        // Prevent duplicate entries in memory
        if (!movieHistory.some(movie => movie.Title === selectedData.Title)) {
            movieHistory.push(selectedData);
        }

        sendResponse(selectedData, res);
        appendMovieDataToFile(selectedData);
    });
}

function getMovie(movieName, res) {
    movieName = movieName.split(' ').join('+');
    console.log(movieName);
    let options = {
        host: 'www.omdbapi.com',
        path: '/?t=' + movieName + '&apikey=' + APIKEY
    };
    http.request(options, function(movieResponse) {
        parseMovie(movieResponse, res);
    }).end();
}

http.createServer(function (req, res) {
    console.log(req.method);
    if (req.method == "POST") {
        let reqData = '';
        req.on('data', function (chunk) {
            reqData += chunk;
        });
        req.on('end', function() {
            let postParams = qstring.parse(reqData);
            getMovie(postParams.movie, res);
        });
    } else {
        sendResponse(null, res);
    }
}).listen(8080, () => {
    // Load existing movie history when the server starts
    loadMovieHistory();
});
