const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facility.controller');

router.get('/facilities/', facilityController.getFacilities);
router.post('/facility/', facilityController.createFacility);
router.get('/facility/:id', facilityController.getFacilityById);
router.put('/facility/:id', facilityController.updateFacility);
router.delete('/facility/:id', facilityController.deleteFacility);

router.get('/facility/:id/googleReviews', facilityController.getGoogleReviews);
router.get('/facility/:id/ourComments', facilityController.getOurComments);
router.post('/facility/:id/ourComment', facilityController.addOurComment);
router.put('/facility/:id/ourComment/:commentId', facilityController.updateOurComment);
router.delete('/facility/:id/ourComment/:commentId', facilityController.deleteOurComment);

module.exports = router;