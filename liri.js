require("dotenv").config();



// Loading programs used in the apps. 
var keys = require("./keys")
var axios = require('axios')
var fs = require('fs')
var moment = require('moment')
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify)


// This function will search the Bands-In-Town API, and 
// render the Name of the Venue, location of venue, and date of the evenet
function concertThis() {

    var searchTerm = process.argv;
    var artistSearch = searchTerm.slice(3).join("")
    if (searchTerm[2] === "do-what-it-says") {
        artistSearch;
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp";

    axios.get(queryURL)
        .then(function (response) {
            var artistResults = response.data;
            for (var i = 0; i < artistResults.length; i++) {
                var time = moment(artistResults[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
                console.log(`
                --------------
                Venue: ${artistResults[i].venue.name}
                City: ${artistResults[i].venue.city}, ${artistResults[i].venue.region}
                Time: ${time}
                --------------`)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

function movieThis(movie) {
    if (process.argv[2] !== "do-what-it-says" && process.argv[3] === undefined) {
        movie = "Mr. Nobody";
    } else if (process.argv[2] === "do-what-it-says") {
        movie;
    } else {
        movie = process.argv.slice(3).join("+")
    }
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL)
        .then(function (response) {
          
            console.log(`
            ---------------
            Title: ${response.data.Title}
            Release: ${response.data.Year}
            IMDB Rating: ${response.data.imdbRating}
            Rotten Tomatoes Rating: ${JSON.stringify(response.data.Ratings[1].Value, null, 2)}
            Filmed: ${response.data.Country};
            Language: ${response.data.Language};
            Plot: ${response.data.Plot};
            Actors: ${response.data.Actors};
            ---------------`)
        });
}
function spotifySong(song) {
    if (process.argv[2] !== "do-what-it-says" && process.argv[3] === undefined) {
      song = "'The Sign' Ace of Base";
    } else if (process.argv[2] === "do-what-it-says"){
      song;
    } else {
      song = process.argv.slice(3).join(" ");
    }
    
    spotify.search({ type: "track", query: song })
      .then(function(response) {
        console.log(`
        ------------------
        Artist Name: ${response.tracks.items[0].album.artists[0].name}
        Song Name: ${response.tracks.items[0].name}
        Album Name: ${response.tracks.items[0].album.name}
        Song Preview: ${response.tracks.items[0].external_urls.spotify}
        ------------------
        `);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }      
      var test = data.split(",");      
      if (test.length === 2) {
        runThis(test[0], test[1]);
      } 
    });
  }

function runThis(input, data) {
    if (input === "concert-this") {
        concertThis(data);
    } else if (input === "movie-this"){
        movieThis(data)
    } else if (input === "spotify-this-song") {
        spotifySong(data)
    } else if (input === "do-what-it-says"){
        doWhatItSays();
    }
};

function run(argOne, argTwo) {
    runThis(argOne, argTwo)
};

run(process.argv[2], process.argv[3]);