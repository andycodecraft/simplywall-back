const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');

router.post('/driver/', driverController.createDriver);
router.get('/drivers/', driverController.getDrivers);
router.get('/driver/:id', driverController.getDriverById);
router.put('/drivers/', driverController.updateDrivers);
router.delete('/driver/:id', driverController.deleteDriver);

router.get('/drivers/carriers', driverController.getCarriers);

module.exports = router;