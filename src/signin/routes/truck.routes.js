const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truck.controller');

router.get('/trucks/', truckController.getTrucks);
router.post('/truck/', truckController.createTruck);
router.get('/truck/:id', truckController.getTruckById);
router.put('/trucks/', truckController.updateTrucks);
router.delete('/truck/:id', truckController.deleteTruck);

module.exports = router;