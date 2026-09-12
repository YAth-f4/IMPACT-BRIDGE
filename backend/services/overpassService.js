const { calculateHaversineDistanceKm } = require('../utils/distance');

// In-memory cache: key -> { timestamp, data }
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OVERPASS_TIMEOUT_MS = 12 * 1000; // 12 seconds per endpoint

// High performance Overpass API endpoints (lz4 is the fastest compressed instance)
const OVERPASS_ENDPOINTS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];

/**
 * Builds high-performance Overpass QL query string using nwr (node/way/relation)
 */
function buildOverpassQuery(lat, lng, radius) {
  return `[out:json][timeout:15];
(
  nwr["amenity"="ngo"](around:${radius},${lat},${lng});
  nwr["office"="ngo"](around:${radius},${lat},${lng});
  nwr["office"="charity"](around:${radius},${lat},${lng});
  nwr["office"="association"](around:${radius},${lat},${lng});
  nwr["amenity"="social_facility"](around:${radius},${lat},${lng});
  nwr["amenity"="community_centre"](around:${radius},${lat},${lng});
);
out center tags;`;
}

/**
 * Formats full address from OSM tags
 */
function formatAddress(tags = {}) {
  if (tags['addr:full']) {
    return tags['addr:full'];
  }
  const parts = [
    tags['addr:housenumber'] ? `${tags['addr:housenumber']} ${tags['addr:street'] || ''}`.trim() : tags['addr:street'],
    tags['addr:suburb'] || tags['addr:neighbourhood'] || tags['addr:district'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:postcode'],
    tags['addr:country']
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Local area (unspecified street)';
}

/**
 * Categorizes an OSM entity into a human-friendly badge
 */
function categorizeEntity(tags = {}) {
  if (tags.amenity === 'ngo' || tags.office === 'ngo') return 'Non-Governmental Org';
  if (tags.office === 'charity' || tags.charity) return 'Charity & Relief';
  if (tags.amenity === 'social_facility' || tags.social_facility) return 'Social Support Facility';
  if (tags.amenity === 'community_centre') return 'Community Center';
  if (tags.office === 'association') return 'Community Association';
  return 'Non-Profit / NGO';
}

/**
 * Generates an informative display name from OSM tags
 */
function getEntityName(tags = {}) {
  if (tags.name) return tags.name;
  if (tags['name:en']) return tags['name:en'];
  if (tags.operator) return `${tags.operator} (Center)`;
  if (tags.brand) return tags.brand;

  const addrCity = tags['addr:city'] || tags['addr:suburb'] || '';
  const prefix = addrCity ? `${addrCity} ` : '';

  if (tags.amenity === 'community_centre') {
    return `${prefix}Community Civic Center`;
  }
  if (tags.amenity === 'social_facility') {
    const focus = tags['social_facility:for'] ? ` (${tags['social_facility:for']})` : '';
    return `${prefix}Social Care Facility${focus}`;
  }
  if (tags.office === 'charity') {
    return `${prefix}Charitable Relief Trust`;
  }
  if (tags.office === 'ngo' || tags.amenity === 'ngo') {
    return `${prefix}Regional NGO Outreach Center`;
  }
  if (tags.office === 'association') {
    return `${prefix}Civic Action Association`;
  }

  return `${prefix}Community Aid Initiative`;
}

/**
 * Cleans up cache entries older than CACHE_TTL_MS
 */
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

/**
 * Queries an Overpass API endpoint with a timeout
 */
async function fetchFromOverpassEndpoint(endpoint, query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ImpactBridge-NGO-Locator/1.0 (https://impactbridge.org)'
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Overpass returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Searches for nearby NGOs using Overpass API with caching and fallback
 *
 * @param {number} userLat - User latitude
 * @param {number} userLng - User longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} List of sorted NGOs
 */
async function searchNearbyNgos(userLat, userLng, radius = 5000) {
  cleanupCache();

  // Cache key with 3 decimal places (~110m precision)
  const cacheKey = `${Number(userLat).toFixed(3)}_${Number(userLng).toFixed(3)}_${radius}`;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const query = buildOverpassQuery(userLat, userLng, radius);
  let rawData = null;
  let lastError = null;

  // Attempt endpoints in order of performance
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      rawData = await fetchFromOverpassEndpoint(endpoint, query);
      if (rawData && Array.isArray(rawData.elements)) {
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Overpass] Request failed on ${endpoint}: ${err.message}. Retrying fallback...`);
    }
  }

  if (!rawData || !Array.isArray(rawData.elements)) {
    throw new Error(`Failed to query OpenStreetMap data from Overpass: ${lastError ? lastError.message : 'No elements received'}`);
  }

  // Parse and normalize elements
  const results = [];
  const seenIds = new Set();

  for (const el of rawData.elements) {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;

    if (lat === undefined || lon === undefined) continue;

    const uniqueId = `${el.type}/${el.id}`;
    if (seenIds.has(uniqueId)) continue;
    seenIds.add(uniqueId);

    const tags = el.tags || {};
    const name = getEntityName(tags);
    const distanceKm = calculateHaversineDistanceKm(userLat, userLng, lat, lon);

    results.push({
      id: uniqueId,
      osmId: el.id,
      type: el.type,
      name,
      category: categorizeEntity(tags),
      latitude: lat,
      longitude: lon,
      distanceKm,
      address: formatAddress(tags),
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || tags['contact:website'] || tags.url || null,
      email: tags.email || tags['contact:email'] || null,
      openingHours: tags.opening_hours || null,
      description: tags.description || (tags['social_facility:for'] ? `Focus: ${tags['social_facility:for']}` : null),
      osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      source: 'OpenStreetMap'
    });
  }

  // Sort nearest first
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  // Store in cache
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: results
  });

  return results;
}

module.exports = {
  searchNearbyNgos,
  buildOverpassQuery,
  formatAddress,
  categorizeEntity,
  getEntityName
};
