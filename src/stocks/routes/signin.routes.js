const express = require('express');
const router = express.Router();
const signinController = require('../controllers/signin.controller');

router.post('/signin/', signinController.getSigninResults);
router.post('/signup/', signinController.registerUser);
router.post('/getToken/', signinController.getSignToken);

module.exports = router;