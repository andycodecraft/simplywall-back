const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
const signinRoutes = require('./stocks/routes/signin.routes');
const pdfsRoutes = require('./stocks/routes/pdfs.routes');
const stripeRoutes = require('./stocks/routes/stripe.routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', signinRoutes);
app.use('/api/v1', pdfsRoutes);
app.use('/api/v1', stripeRoutes);

module.exports = app;
