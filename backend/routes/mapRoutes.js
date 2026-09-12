const express = require('express');
const router = express.Router();
const { getNearbyNgos } = require('../controllers/mapController');

/**
 * @route   GET /api/map/nearby-ngos
 * @desc    Find nearby NGOs and charitable organizations within radius
 * @access  Public
 */
router.get('/nearby-ngos', getNearbyNgos);

module.exports = router;
