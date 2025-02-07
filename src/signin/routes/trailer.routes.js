const express = require('express');
const router = express.Router();
const trailerController = require('../controllers/trailer.controller');

router.get('/trailers/', trailerController.getTrailers);
router.post('/trailer/', trailerController.createTrailer);
router.get('/trailer/:id', trailerController.getTrailerById);
router.put('/trailers/', trailerController.updateTrailers);
router.delete('/trailer/:id', trailerController.deleteTrailer);

module.exports = router;