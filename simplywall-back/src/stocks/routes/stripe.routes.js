const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');

router.post('/checkoutStripe/', stripeController.checkoutStripe);

module.exports = router;