const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// GET /api/about — Publicly accessible endpoint returning complete About page content
router.get('/', aboutController.getAbout);

// GET /api/about/changemakers/:slug — Retrieve single changemaker profile by slug
router.get('/changemakers/:slug', aboutController.getChangemakerProfile);

module.exports = router;
