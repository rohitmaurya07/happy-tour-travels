// src/utils/distance.js
import { popularLocations } from '../data/popularLocations';

// Helper to convert degrees to radians
const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Standard road curvature multiplier (straight-line distance to highway road distance).
 * In Indian plains/hills, highway road distance is approximately 1.25x to 1.35x geodesic distance.
 */
const ROAD_FACTOR = 1.28;

/**
 * Exact realistic road distances for popular pairs (in KM)
 */
const knownDistances = {
  // From Jalandhar
  "Jalandhar|Amritsar": 82,
  "Jalandhar|Sri Guru Ram Dass Jee Airport (ATQ)": 95,
  "Jalandhar|Chandigarh": 148,
  "Jalandhar|Shaheed Bhagat Singh Airport (IXC)": 155,
  "Jalandhar|Mohali": 142,
  "Jalandhar|Ludhiana": 61,
  "Jalandhar|Phagwara": 22,
  "Jalandhar|Hoshiarpur": 42,
  "Jalandhar|Pathankot": 112,
  "Jalandhar|Patiala": 152,
  "Jalandhar|Bathinda": 165,
  "Jalandhar|Delhi": 375,
  "Jalandhar|Indira Gandhi International Airport (DEL)": 385,
  "Jalandhar|Gurgaon (Gurugram)": 395,
  "Jalandhar|Noida": 410,
  "Jalandhar|Shimla": 220,
  "Jalandhar|Manali": 315,
  "Jalandhar|Dharamshala": 165,
  "Jalandhar|McLeod Ganj": 175,
  "Jalandhar|Dalhousie": 185,
  "Jalandhar|Khajjiar": 200,
  "Jalandhar|Kullu": 275,
  "Jalandhar|Kasol": 290,
  "Jalandhar|Kasauli": 180,
  "Jalandhar|Jammu": 215,
  "Jalandhar|Katra (Vaishno Devi)": 260,
  "Jalandhar|Srinagar": 480,
  "Jalandhar|Haridwar": 330,
  "Jalandhar|Rishikesh": 350,
  "Jalandhar|Dehradun": 310,
  "Jalandhar|Mussoorie": 340,
  "Jalandhar|Jaipur": 620,
  "Jalandhar|Agra (Taj Mahal)": 590,

  // From Amritsar
  "Amritsar|Chandigarh": 230,
  "Amritsar|Delhi": 450,
  "Amritsar|Indira Gandhi International Airport (DEL)": 460,
  "Amritsar|Shimla": 300,
  "Amritsar|Manali": 395,
  "Amritsar|Dharamshala": 200,
  "Amritsar|Dalhousie": 190,
  "Amritsar|Katra (Vaishno Devi)": 260,
  "Amritsar|Jammu": 215,

  // From Chandigarh
  "Chandigarh|Delhi": 250,
  "Chandigarh|Indira Gandhi International Airport (DEL)": 260,
  "Chandigarh|Shimla": 110,
  "Chandigarh|Manali": 270,
  "Chandigarh|Dharamshala": 240,
  "Chandigarh|Dalhousie": 310,
  "Chandigarh|Haridwar": 205,
  "Chandigarh|Rishikesh": 225,
  "Chandigarh|Dehradun": 170,
  "Chandigarh|Mussoorie": 200,
  "Chandigarh|Kasauli": 55,

  // From Delhi
  "Delhi|Shimla": 340,
  "Delhi|Manali": 530,
  "Delhi|Dharamshala": 475,
  "Delhi|Dalhousie": 560,
  "Delhi|Haridwar": 220,
  "Delhi|Rishikesh": 240,
  "Delhi|Dehradun": 250,
  "Delhi|Mussoorie": 285,
  "Delhi|Agra (Taj Mahal)": 210,
  "Delhi|Jaipur": 280,
};

/**
 * Normalizes city string for lookups
 */
const normalizeCity = (str) => {
  if (!str) return '';
  return str.split(',')[0].trim();
};

/**
 * Find coordinates for a city name from pre-defined dataset
 */
export const findCoordsByName = (name) => {
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  const match = popularLocations.find(
    (l) => l.name.toLowerCase() === clean || clean.includes(l.name.toLowerCase())
  );
  return match ? { lat: match.lat, lon: match.lon } : null;
};

/**
 * Compute distance between two points.
 * 1. Checks exact pair in distance dictionary.
 * 2. If coordinates are provided or found, uses Great Circle (Haversine) * road curvature factor.
 * 3. Fallback minimum 50 km.
 */
export const getDistanceKm = (from, to, fromCoords = null, toCoords = null) => {
  if (!from || !to) return 50;

  const cleanFrom = normalizeCity(from);
  const cleanTo = normalizeCity(to);

  // 1. Direct dictionary check (both ways)
  const key1 = `${cleanFrom}|${cleanTo}`;
  const key2 = `${cleanTo}|${cleanFrom}`;
  if (knownDistances[key1]) return knownDistances[key1];
  if (knownDistances[key2]) return knownDistances[key2];

  // Try substring matches in keys
  for (const [k, dist] of Object.entries(knownDistances)) {
    const [kFrom, kTo] = k.split('|');
    if (
      (cleanFrom.toLowerCase().includes(kFrom.toLowerCase()) || kFrom.toLowerCase().includes(cleanFrom.toLowerCase())) &&
      (cleanTo.toLowerCase().includes(kTo.toLowerCase()) || kTo.toLowerCase().includes(cleanTo.toLowerCase()))
    ) {
      return dist;
    }
  }

  // 2. Coordinate-based distance calculation
  const c1 = fromCoords || findCoordsByName(cleanFrom);
  const c2 = toCoords || findCoordsByName(cleanTo);

  if (c1 && c2) {
    const R = 6371; // Earth radius in km
    const lat1 = toRad(parseFloat(c1.lat));
    const lat2 = toRad(parseFloat(c2.lat));
    const dLat = toRad(parseFloat(c2.lat) - parseFloat(c1.lat));
    const dLon = toRad(parseFloat(c2.lon) - parseFloat(c1.lon));

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDist = R * c;

    // Apply road curvature multiplier
    const roadDist = Math.round(straightDist * ROAD_FACTOR);
    return Math.max(roadDist, 30);
  }

  // Default fallback estimate
  return 120;
};
