const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');

router.get('/filter/fields', filterController.getFilterFields);
router.get('/filters', filterController.getFilters);
router.post('/filter', filterController.createFilter);
router.delete('/filter/:id', filterController.deleteFilter);

module.exports = router;