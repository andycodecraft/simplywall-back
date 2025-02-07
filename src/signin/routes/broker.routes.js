const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/broker.controller');

router.post('/broker/', brokerController.createBroker);
router.get('/brokers/', brokerController.getBrokers);
router.get('/broker/:id', brokerController.getBrokerById);
router.put('/broker/:id', brokerController.updateBroker);
router.delete('/broker/:id', brokerController.deleteBroker);

router.get('/broker/:id/reviews/', brokerController.getBrokerReviews);
router.post('/broker/:id/review/', brokerController.addBrokerReview);
router.put('/broker/:id/review/:reviewId', brokerController.updateBrokerReview);
router.delete('/broker/:id/review/:reviewId', brokerController.deleteBrokerReview);

module.exports = router;