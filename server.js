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

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});