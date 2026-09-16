const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// POST /api/newsletter/subscribe - Public subscription endpoint
router.post('/subscribe', newsletterController.subscribe);

// GET /api/newsletter/subscribers - List subscribers
router.get('/subscribers', newsletterController.getSubscribers);

module.exports = router;
