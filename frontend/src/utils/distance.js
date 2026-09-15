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
  "Jalandhar|Amritsar Airport": 95,
  "Jalandhar|Sri Guru Ram Dass Jee Airport (ATQ)": 95,
  "Jalandhar|Chandigarh": 148,
  "Jalandhar|Chandigarh Airport": 155,
  "Jalandhar|Shaheed Bhagat Singh Airport (IXC)": 155,
  "Jalandhar|Mohali": 142,
  "Jalandhar|Zirakpur": 152,
  "Jalandhar|Ludhiana": 61,
  "Jalandhar|Phagwara": 22,
  "Jalandhar|Hoshiarpur": 42,
  "Jalandhar|Pathankot": 112,
  "Jalandhar|Patiala": 152,
  "Jalandhar|Bathinda": 165,
  "Jalandhar|Delhi": 375,
  "Jalandhar|Delhi Airport": 385,
  "Jalandhar|Indira Gandhi International Airport (DEL)": 385,
  "Jalandhar|Gurgaon / Gurugram": 395,
  "Jalandhar|Gurgaon": 395,
  "Jalandhar|Noida": 410,
  "Jalandhar|Faridabad": 415,
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
  "Jalandhar|Katra": 260,
  "Jalandhar|Katra (Vaishno Devi)": 260,
  "Jalandhar|Srinagar": 480,
  "Jalandhar|Haridwar": 330,
  "Jalandhar|Rishikesh": 350,
  "Jalandhar|Dehradun": 310,
  "Jalandhar|Mussoorie": 340,
  "Jalandhar|Jaipur": 620,
  "Jalandhar|Agra (Taj Mahal)": 590,

  // From Amritsar
  "Amritsar|Delhi": 450,
  "Amritsar|Delhi Airport": 460,
  "Amritsar|Indira Gandhi International Airport (DEL)": 460,
  "Amritsar|Chandigarh": 230,
  "Amritsar|Chandigarh Airport": 238,
  "Amritsar|Jalandhar": 82,
  "Amritsar|Ludhiana": 142,
  "Amritsar|Amritsar Airport": 14,
  "Amritsar|Shimla": 300,
  "Amritsar|Manali": 395,
  "Amritsar|Kullu": 360,
  "Amritsar|Dharamshala": 200,
  "Amritsar|Dalhousie": 190,
  "Amritsar|Pathankot": 110,
  "Amritsar|Jammu": 215,
  "Amritsar|Katra": 260,
  "Amritsar|Hoshiarpur": 120,
  "Amritsar|Patiala": 230,
  "Amritsar|Mohali": 225,
  "Amritsar|Dehradun": 390,

  // From Ludhiana
  "Ludhiana|Delhi": 315,
  "Ludhiana|Delhi Airport": 325,
  "Ludhiana|Chandigarh": 105,
  "Ludhiana|Chandigarh Airport": 112,
  "Ludhiana|Amritsar": 142,
  "Ludhiana|Amritsar Airport": 154,
  "Ludhiana|Jalandhar": 61,
  "Ludhiana|Shimla": 225,
  "Ludhiana|Manali": 335,
  "Ludhiana|Kullu": 295,
  "Ludhiana|Dharamshala": 215,
  "Ludhiana|Dalhousie": 245,
  "Ludhiana|Pathankot": 170,
  "Ludhiana|Patiala": 95,
  "Ludhiana|Mohali": 98,
  "Ludhiana|Zirakpur": 108,
  "Ludhiana|Dehradun": 255,
  "Ludhiana|Jaipur": 560,

  // From Delhi / Delhi Airport
  "Delhi Airport|Jalandhar": 385,
  "Delhi Airport|Amritsar": 460,
  "Delhi Airport|Ludhiana": 325,
  "Delhi Airport|Chandigarh": 260,
  "Delhi Airport|Patiala": 255,
  "Delhi Airport|Bathinda": 320,
  "Delhi Airport|Hoshiarpur": 405,
  "Delhi Airport|Moga": 375,
  "Delhi Airport|Kapurthala": 398,
  "Delhi Airport|Pathankot": 490,
  "Delhi Airport|Shimla": 355,
  "Delhi Airport|Manali": 540,
  "Delhi Airport|Kullu": 500,
  "Delhi Airport|Dharamshala": 485,
  "Delhi Airport|Dalhousie": 570,
  "Delhi Airport|Kasauli": 305,
  "Delhi Airport|Solan": 315,
  "Delhi Airport|Mandi": 440,
  "Delhi Airport|Palampur": 505,
  "Delhi Airport|Gurgaon / Gurugram": 18,
  "Delhi Airport|Gurgaon": 18,
  "Delhi Airport|Faridabad": 38,
  "Delhi Airport|Panipat": 105,
  "Delhi Airport|Karnal": 140,
  "Delhi Airport|Rohtak": 82,
  "Delhi Airport|Hisar": 175,
  "Delhi Airport|Sonipat": 65,
  "Delhi Airport|Ambala": 220,
  "Delhi Airport|Panchkula": 265,

  // From Chandigarh
  "Chandigarh|Shimla": 110,
  "Chandigarh|Manali": 270,
  "Chandigarh|Kullu": 230,
  "Chandigarh|Dharamshala": 240,
  "Chandigarh|Dalhousie": 310,
  "Chandigarh|Kasauli": 55,
  "Chandigarh|Solan": 68,
  "Chandigarh|Mandi": 185,
  "Chandigarh|Palampur": 255,
  "Chandigarh|Chail": 105,
  "Chandigarh|Jalandhar": 148,
  "Chandigarh|Amritsar": 230,
  "Chandigarh|Ludhiana": 105,
  "Chandigarh|Patiala": 70,
  "Chandigarh|Mohali": 10,
  "Chandigarh|Zirakpur": 12,
  "Chandigarh|Bathinda": 225,
  "Chandigarh|Hoshiarpur": 140,
  "Chandigarh|Pathankot": 245,
  "Chandigarh|Moga": 175,
  "Chandigarh|Delhi": 250,
  "Chandigarh|Delhi Airport": 260,
  "Chandigarh|Gurgaon / Gurugram": 280,
  "Chandigarh|Noida": 275,
  "Chandigarh|Faridabad": 290,
  "Chandigarh|Ghaziabad": 265,
  "Chandigarh|Dehradun": 170,
  "Chandigarh|Haridwar": 205,
  "Chandigarh|Rishikesh": 225,
  "Chandigarh|Mussoorie": 200,
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
