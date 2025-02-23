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
- An API key from [OMDb API](https://www.omdbapi.com/).

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

3. Create a `movies.json` file in the root directory:

    ```json
    {
        "movies": [],
        "TimeWatched": 0
    }
    ```

4. Update the `APIKEY` variable in `app.js` with your OMDb API key:

    ```javascript
    const APIKEY = "your_api_key_here";
    ```

## Usage

1. Start the server:

    ```bash
    node app.js
    ```

2. Open your web browser and navigate to `http://localhost:8080`.

3. Enter the name of a movie in the input field and click "Add Movie".

4. The application will display detailed information about the searched movie and update the total time watched.

## File Structure

- `app.js`: The main application file that handles the server, movie search, and data storage.
- `movies.json`: A JSON file that stores the movie history and total time watched.

