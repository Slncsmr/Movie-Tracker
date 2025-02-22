const http = require('http');
const url = require('url');
const qstring = require('querystring');
const fs = require('fs');
const APIKEY = "";

let movieHistory = [];
let TimeWatched = 0;

function loadMovieHistory() {
    const filePath = 'movies.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err && data) {
            const parsedData = JSON.parse(data);
            movieHistory = parsedData.movies || [];
            TimeWatched = parsedData.TimeWatched || 0;
        }
    });
}

function appendMovieDataToFile(movieData) {
    const filePath = 'movies.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return;
        }

        let movies = [];
        if (data) {
            const parsedData = JSON.parse(data);
            movies = parsedData.movies || [];
            
        }

        if (!movies.some(movie => movie.Title === movieData.Title)) {
            movies.push(movieData);
            movieHistory.push(movieData); // Update movieHistory array
        }

        const updatedData = {
            movies: movies,
            TimeWatched: TimeWatched
        };

        fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
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
                    '<input type="submit" value="Add Movie">' +
                    '</form>'+
                    `<p>Time Watched: ${TimeWatched} minutes</p>`; // Display TimeWatched

    if (movieData) {
        page += `<div>
                    <h1>Current Movie Info</h1>
                    <img src="${movieData.Poster}" alt="${movieData.Title}">
                    <br>
                    <p><strong>Title:</strong> ${movieData.Title}</p>
                    <p><strong>Year:</strong> ${movieData.Year}</p>
                    <p><strong>Genre:</strong> ${movieData.Genre}</p>
                    <p><strong>Director:</strong> ${movieData.Director}</p>
                    <p><strong>Actors:</strong> ${movieData.Actors}</p>
                    <p><strong>Plot:</strong> ${movieData.Plot}</p>
                    <p><strong>Runtime:</strong> ${movieData.Runtime} minutes</p>
                 </div>`;
    }

    if (movieHistory.length > 0) {
        page += `<h2>Previous Movie Searches:</h2>`;
        movieHistory.slice().reverse().forEach(movie => {
            page += `<div style="border-bottom: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <br>
                        <p><strong>Title:</strong> ${movie.Title}</p>
                        <p><strong>Year:</strong> ${movie.Year}</p>
                        <p><strong>Genre:</strong> ${movie.Genre}</p>
                        <p><strong>Director:</strong> ${movie.Director}</p>
                        <p><strong>Actors:</strong> ${movie.Actors}</p>
                        <p><strong>Plot:</strong> ${movie.Plot}</p>
                        <p><strong>Runtime:</strong> ${movie.Runtime} minutes</p>
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
        try {
            const movieJson = JSON.parse(movieData);

            if (movieJson.Response === "False") { // Check if movie not found
                sendResponse(null, res);
                return;
            }

            if(movieJson.Runtime === 'N/A')
            {
                movieJson.Runtime = '0 min';
            }

            const runtime = movieJson.Runtime.replace(' min', '') ;

            const selectedData = {
                Runtime: runtime,
                Title: movieJson.Title,
                Year: movieJson.Year,
                Genre: movieJson.Genre,
                Director: movieJson.Director,
                Actors: movieJson.Actors,
                Plot: movieJson.Plot,
                Poster: movieJson.Poster || '' // Avoids undefined values
            };

            TimeWatched += parseInt(selectedData.Runtime); // Update TimeWatched before sending response
            appendMovieDataToFile(selectedData);
            sendResponse(selectedData, res);
        } catch (error) {
            console.error("Error parsing movie data:", error);
            sendResponse(null, res);
        }
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
    loadMovieHistory();
});