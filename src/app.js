const express = require('express');
const cors = require('cors');
require('dotenv').config();


const bodyParser = require('body-parser');
const signinRoutes = require('./signin/routes/signin.routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', signinRoutes);

module.exports = app;