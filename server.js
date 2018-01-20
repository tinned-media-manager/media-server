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

// gets the 4 most popular movies
app.get('/api/movies/popular', (req, res) => {
  let url_popular = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
  superAgent.get(url_popular)
    .then(data => {
      let arrPopular = data.body.results.filter((movie, index) => {
        if (index < 4) {return movie;}
      });
      res.send(arrPopular);
    }).catch(err => console.error(err));
});

// gets 4 recommended movies
app.get('/api/movies/recommend', (req, res) => {
  let url_recommend = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1`;
  superAgent.get(url_recommend)
    .then(data => {
      let arrRecommend = data.body.results.filter((movie, index) => {
        if (index < 4) {return movie;}
      });
      res.send(arrRecommend);
    })
    .catch(err => console.error(err));
});

// `${IMG_URI}${IMG_DEFAULT}${data.body.poster_path}">` this is the poster path figure out why this isnt working

app.get('/api/movies/one', (req, res) => {
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