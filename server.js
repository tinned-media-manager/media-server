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
        if (index < 4) { return movie; }
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
        if (index < 4) { return movie; }
      });
      res.send(arrRecommend);
    })
    .catch(err => console.error(err));
});

// `${IMG_URI}${IMG_DEFAULT}${data.body.poster_path}">` this is the poster path figure out why this isnt working



// gets movies based on user search by title
app.get('/api/movies/:title', (req, res) => {
  let url_search = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${req.params.title}`;
  superAgent.get(url_search)
    .then(data => {
      console.log(req.params.title)
      res.send(data.body.results);
    })
    .catch(err => console.error(err));
});
//remember to make the get one grab the id from the movie we click on right now it is hardcoded for one movie.

app.get('/api/movies/one/:id', (req, res) => {
  let detail_Url = `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${api_key}&append_to_response=videos,images`
  superAgent.get(detail_Url)
    .then(data => {
      console.log(data.body.id);
      res.send([data.body.title, data.body.overview, data.body.tagline, data.body.genres]);
      err => res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});