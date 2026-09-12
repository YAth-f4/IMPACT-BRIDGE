const express = require('express');
const router = express.Router();
const { getNearbyNgos, getVerifiedHubs } = require('../controllers/mapController');

/**
 * @route   GET /api/map/nearby-ngos
 * @desc    Find nearby NGOs and charitable organizations within radius (OpenStreetMap)
 * @access  Public
 */
router.get('/nearby-ngos', getNearbyNgos);

/**
 * @route   GET /api/map/verified-hubs
 * @desc    Get administrative & program verified hubs (Impact Bridge application database)
 * @access  Public
 */
router.get('/verified-hubs', getVerifiedHubs);

module.exports = router;
