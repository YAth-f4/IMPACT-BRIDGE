/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 *
 * @param {number} lat1 - User latitude in degrees
 * @param {number} lon1 - User longitude in degrees
 * @param {number} lat2 - Target latitude in degrees
 * @param {number} lon2 - Target longitude in degrees
 * @returns {number} Distance in kilometers rounded to 2 decimal places
 */
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) {
    return 0;
  }

  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;

  // Round to 1 decimal place (or 2 if < 1km)
  return distance < 1 ? Math.round(distance * 100) / 100 : Math.round(distance * 10) / 10;
}

module.exports = {
  calculateHaversineDistanceKm
};
