const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const pg = require('pg');
const cors = require('cors');
const superAgent = require('superagent');
const PORT = process.env.PORT || 3000;
const app = express('app');




app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

