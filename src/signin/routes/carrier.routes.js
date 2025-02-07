const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrier.controller');

router.post('/carrier/', carrierController.createCarrier);
router.get('/carriers/', carrierController.getCarriers);
router.get('/carrier/:id', carrierController.getCarrierById);
router.put('/carrier/:id', carrierController.updateCarrier);
router.delete('/carrier/:id', carrierController.deleteCarrier);

router.get('/carriers/trucks', carrierController.getTrucks);
router.get('/carriers/trailers', carrierController.getTrailers);
module.exports = router;