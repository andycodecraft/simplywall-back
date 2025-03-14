const express = require('express');
const router = express.Router();
const pdfsController = require('../controllers/pdfs.controller');

router.post('/getPDFList/', pdfsController.getPDFList);
router.get('/downloadPDF/', pdfsController.downloadPDF);

module.exports = router;