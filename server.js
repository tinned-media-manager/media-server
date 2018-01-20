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

const client = new pg.Client(conString);
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// gets all info from all popular movies
app.get('/', (req, res) => {
  superAgent.get(conString)
    .then(data => {
      console.log(data.body.results[0].title);
      res.send(data.body.results[0].title);
      err => res.send(err);
    });
});

// `${IMG_URI}${IMG_DEFAULT}${data.body.poster_path}">` this is the poster path figure out why this isnt working

app.get('/one', (req, res) => {
  superAgent.get(DETAIL)
    .then(data => {
      console.log(data.body.adult);
      res.send([data.body.title, data.body.overview, data.body.tagline, data.body.genres, ]);
      err => res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});