const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.post('/getStocks/', stockController.getStocks);

module.exports = router;