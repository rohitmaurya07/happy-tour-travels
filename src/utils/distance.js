// src/utils/distance.js

/**
 * Compute distance between two points.
 * If `fromCoords` and `toCoords` are provided (lat/lon objects), use the haversine formula.
 * Otherwise fall back to a static lookup table for known city pairs.
 * Returns distance in kilometers (rounded to nearest integer).
 */
export const getDistanceKm = (from, to, fromCoords = null, toCoords = null) => {
  // Helper to convert degrees to radians
  const toRad = (deg) => (deg * Math.PI) / 180;

  if (fromCoords && toCoords) {
    const R = 6371; // Earth radius in km
    const dLat = toRad(toCoords.lat - fromCoords.lat);
    const dLon = toRad(toCoords.lon - fromCoords.lon);
    const lat1 = toRad(parseFloat(fromCoords.lat));
    const lat2 = toRad(parseFloat(toCoords.lat));
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Static distance lookup (fallback)
  const map = {
    "Jalandhar|Amritsar": 80,
    "Jalandhar|Chandigarh": 150,
    "Jalandhar|Delhi NCR": 350,
    "Jalandhar|Shimla": 250,
    "Jalandhar|Manali": 300,
    "Jalandhar|Ludhiana": 60,
    "Jalandhar|Patiala": 100,
    "Jalandhar|Hoshiarpur": 70,
    // Add more pairs as needed
  };
  const key = `${from.trim()}|${to.trim()}`;
  return map[key] ?? 0;
};
