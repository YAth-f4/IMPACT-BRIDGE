const { searchNearbyNgos } = require('../services/overpassService');

/**
 * Controller to handle GET /api/map/nearby-ngos
 *
 * Query parameters:
 * - lat: latitude (-90 to 90)
 * - lng: longitude (-180 to 180)
 * - radius: search radius in meters (100 to 50000, default 5000)
 */
async function getNearbyNgos(req, res) {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    // Validate presence of lat and lng
    if (lat === undefined || lng === undefined || lat === '' || lng === '') {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: "lat" and "lng" are required.'
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRadius = parseInt(radius, 10);

    // Validate lat/lng numerical ranges
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "lat" parameter. Latitude must be a number between -90 and 90.'
      });
    }

    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "lng" parameter. Longitude must be a number between -180 and 180.'
      });
    }

    // Validate radius bounds (min 100m, max 50000m / 50km)
    if (isNaN(parsedRadius) || parsedRadius < 100 || parsedRadius > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "radius" parameter. Radius must be an integer between 100 and 50000 meters.'
      });
    }

    // Fetch nearby NGOs from Overpass
    const results = await searchNearbyNgos(parsedLat, parsedLng, parsedRadius);

    return res.status(200).json({
      success: true,
      count: results.length,
      userLocation: {
        lat: parsedLat,
        lng: parsedLng
      },
      radiusMeters: parsedRadius,
      source: 'OpenStreetMap via Overpass API',
      attribution: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
      results
    });
  } catch (error) {
    console.error('[MapController] Error fetching nearby NGOs:', error.message);

    // Differentiate between timeout / upstream service failure and internal error
    const isUpstream = error.name === 'AbortError' || error.message.includes('Overpass') || error.message.includes('fetch');
    const statusCode = isUpstream ? 503 : 500;

    return res.status(statusCode).json({
      success: false,
      error: isUpstream
        ? 'OpenStreetMap service is temporarily busy or unreachable. Please try again shortly.'
        : 'An error occurred while fetching nearby organizations.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  getNearbyNgos
};
