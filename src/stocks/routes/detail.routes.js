const express = require('express');
const router = express.Router();
const detailController = require('../controllers/detail.controller');

router.post('/getTopStocks/', detailController.getTopStocks);
router.post('/getTopStockById/', detailController.getTopStockById);

module.exports = router;
