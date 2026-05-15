const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadDocument } = require('../controllers/pdfController');

router.post('/upload', upload.single('pdf'), uploadDocument);

module.exports = router;
