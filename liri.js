
require("dotenv").config();

// Loading programs used in the apps. 
var Keys = require("./keys")
var axios = require('axios')
var fs = require('fs')
var moment = require('moment')
var Spotify = require('node-spotify-api')

// var spotify = new Spotify(keys.spotify)

// This function will search the Bands-In-Town API, and 
// render the Name of the Venue, location of venue, and date of the evenet
function concertThis() {
    var searchTerm = process.argv;
    var artistSearch = searchTerm.slice(3).join("")
    if (searchTerm[2] === "do-what-it-says") {
        artistSearch
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

    axios.get(queryURL)
        .then(function (response) {
            console.log(response)
            var artistResults = response.data;
            for (var i = 0; i < artistResults.length; i++) {
                var time = moment(artistResults[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
                console.log(`
                --------------
                Venue: ${artistResults[i].venue.name}
                City: ${artistResults[i].venue.city}
                Time: ${time}
                --------------`)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
concertThis();