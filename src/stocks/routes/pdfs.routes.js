const express = require('express');
const router = express.Router();
const pdfsController = require('../controllers/pdfs.controller');

router.post('/getPDFList/', pdfsController.getPDFList);
router.post('/downloadPDF/', pdfsController.downloadPDF);

module.exports = router;