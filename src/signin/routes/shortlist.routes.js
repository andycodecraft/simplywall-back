const express = require('express');
const router = express.Router();
const shortlistController = require('../controllers/shortlist.controller');

router.get('/shortlist/carriers/', shortlistController.getCarriers);
router.get('/shortlist/trucks/', shortlistController.getTrucks);
router.get('/shortlist/trailers/', shortlistController.getTrailers);

module.exports = router;