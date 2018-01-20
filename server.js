'use strict';

const express = require('express');
const fs = require('fs'); // remove if unnecessary
const bodyParser = require('body-parser');
const pg = require('pg');
const cors = require('cors');
const superAgent = require('superagent');
const PORT = process.env.PORT || 3000;
const app = express();

require('dotenv').config();
const conString = process.env.API_URL;
const DETAIL = process.env.API_URL_DETAIL;
const IMG_URI = process.env.IMG_URI;
const IMG_DEFAULT = process.env.IMG_DEFAULT;
const api_key = process.env.api_key;
// const URL_RECOMMENDED = process.env.URL_RECOMMENDED;

const client = new pg.Client(conString);
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// gets all info from all popular movies --> want to get the 4 most popular movies
app.get('/', (req, res) => {
  let url_popular = `https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=${process.env.api_key}`;
  superAgent.get(url_popular)
    .then(data => {
      let arrPopular = data.body.results.sort(function (a, b) {
        return b.popularity - a.popularity;
      }).filter((movie, index) => {
        if (index < 4) { return movie; }
      });
      res.send(arrPopular);
      // console.log(data.body.results[0].title);
      // res.send(data.body.results[0].title);
    }).catch(err => console.error(err));
});


// first time visiting webpage populated movies
app.get('/recommend', (req, res) => {
  let Url_Recommend = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1`
  superAgent.get(Url_Recommend)
    .then(data => {
      let initialRecMovies = data.body.results.filter((movie, index) => {
        if (index < 4) {return movie;}
        console.log(movie);
      });
      res.send(initialRecMovies);
    })
    .catch(err => console.log(err));

});








// `${IMG_URI}${IMG_DEFAULT}${data.body.poster_path}">` this is the poster path figure out why this isnt working

app.get('/one', (req, res) => {
  superAgent.get(DETAIL)
    .then(data => {
      console.log(data.body.adult);
      res.send([data.body.title, data.body.overview, data.body.tagline, data.body.genres,]);
      err => res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});