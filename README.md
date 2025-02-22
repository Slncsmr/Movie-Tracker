# Movie Tracker

Movie Tracker is a simple Node.js application that allows users to search for movies using the OMDb API and keep track of the movies they have watched, along with the total time spent watching movies.

## Features

- Search for movies by title using the OMDb API.
- Display detailed information about the searched movie.
- Keep a history of previously searched movies.
- Track the total time spent watching movies.
- Store movie history and total time watched in a JSON file.

## Prerequisites

- Node.js installed on your machine.
- An API key from [OMDb API](http://www.omdbapi.com/apikey.aspx).

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/Movie-Tracker.git
    cd Movie-Tracker
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Create a [movies.json](http://_vscodecontentref_/1) file in the root directory:

    ```json
    {
        "movies": [],
        "TimeWatched": 0
    }
    ```

4. Update the [APIKEY](http://_vscodecontentref_/2) variable in [app.js](http://_vscodecontentref_/3) with your OMDb API key:

    ```javascript
    const APIKEY = "your_api_key_here";
    ```

## Usage

1. Start the server:

    ```bash
    node app.js
    ```

2. Open your web browser and navigate to [http://localhost:8080](http://_vscodecontentref_/4).

3. Enter the name of a movie in the input field and click "Add Movie".

4. The application will display detailed information about the searched movie and update the total time watched.

## File Structure

- [app.js](http://_vscodecontentref_/5): The main application file that handles the server, movie search, and data storage.
- [movies.json](http://_vscodecontentref_/6): A JSON file that stores the movie history and total time watched.

## Code Overview

### [loadMovieHistory()](http://_vscodecontentref_/7)

Loads the movie history and total time watched from [movies.json](http://_vscodecontentref_/8).

### [appendMovieDataToFile(movieData)](http://_vscodecontentref_/9)

Appends new movie data to [movies.json](http://_vscodecontentref_/10) and updates the total time watched.

### [sendResponse(movieData, res)](http://_vscodecontentref_/11)

Generates and sends the HTML response to the client, displaying the current movie information, total time watched, and movie history.

### [parseMovie(movieResponse, res)](http://_vscodecontentref_/12)

Parses the movie data received from the OMDb API, updates the total time watched, and calls [appendMovieDataToFile](http://_vscodecontentref_/13) and [sendResponse](http://_vscodecontentref_/14).

### [getMovie(movieName, res)](http://_vscodecontentref_/15)

Sends a request to the OMDb API to search for a movie by title.

### [http.createServer()](http://_vscodecontentref_/16)

Creates the HTTP server that handles incoming requests and responses.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
