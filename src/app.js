const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const bodyParser = require('body-parser');
const facilityRoutes = require('./signin/routes/facility.routes');
const carrierRoutes = require('./signin/routes/carrier.routes');
const driverRoutes = require('./signin/routes/driver.routes');
const truckRoutes = require('./signin/routes/truck.routes');
const trailerRoutes = require('./signin/routes/trailer.routes');
const warehouseRoutes = require('./signin/routes/warehouse.routes');
const ownerRoutes = require('./signin/routes/owner.routes');
const brokerRoutes = require('./signin/routes/broker.routes');
const filterRoutes = require('./signin/routes/filter.routes');
const shortlistRoutes = require('./signin/routes/shortlist.routes');
const docsRoutes = require('./routes/docs.routes');
const signinRoutes = require('./signin/routes/signin.routes');

// const crypto = require('crypto');
// const secret = crypto.randomBytes(64).toString('hex');
// console.log(secret);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', facilityRoutes);
app.use('/api/v1', brokerRoutes);
app.use('/api/v1', carrierRoutes);
app.use('/api/v1', driverRoutes);
app.use('/api/v1', truckRoutes);
app.use('/api/v1', trailerRoutes);
app.use('/api/v1', warehouseRoutes);
app.use('/api/v1', ownerRoutes);
app.use('/api/v1', filterRoutes);
app.use('/api/v1', shortlistRoutes);

app.use('/api-docs', docsRoutes);
app.use('/api/v1', signinRoutes);

app.use('/upload', express.static(path.join(__dirname, 'upload')));

module.exports = app;