// src/utils/distance.js
import { popularLocations } from '../data/popularLocations.js';

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
export const knownDistances = {
  // From Jalandhar
  "jalandhar|amritsar": 82,
  "jalandhar|amritsar airport": 95,
  "jalandhar|sri guru ram dass jee airport (atq)": 95,
  "jalandhar|chandigarh": 148,
  "jalandhar|chandigarh airport": 155,
  "jalandhar|shaheed bhagat singh airport (ixc)": 155,
  "jalandhar|mohali": 142,
  "jalandhar|zirakpur": 152,
  "jalandhar|ludhiana": 61,
  "jalandhar|phagwara": 22,
  "jalandhar|hoshiarpur": 42,
  "jalandhar|pathankot": 112,
  "jalandhar|patiala": 152,
  "jalandhar|bathinda": 165,
  "jalandhar|moga": 70,
  "jalandhar|kapurthala": 22,
  "jalandhar|delhi": 375,
  "jalandhar|delhi airport": 385,
  "jalandhar|indira gandhi international airport (del)": 385,
  "jalandhar|gurgaon": 395,
  "jalandhar|gurgaon / gurugram": 395,
  "jalandhar|noida": 410,
  "jalandhar|faridabad": 415,
  "jalandhar|shimla": 220,
  "jalandhar|manali": 315,
  "jalandhar|dharamshala": 165,
  "jalandhar|mcleod ganj": 175,
  "jalandhar|dalhousie": 185,
  "jalandhar|khajjiar": 200,
  "jalandhar|kullu": 275,
  "jalandhar|kasol": 290,
  "jalandhar|kasauli": 180,
  "jalandhar|solan": 190,
  "jalandhar|mandi": 220,
  "jalandhar|palampur": 190,
  "jalandhar|jammu": 215,
  "jalandhar|katra": 260,
  "jalandhar|katra (vaishno devi)": 260,
  "jalandhar|srinagar": 480,
  "jalandhar|haridwar": 330,
  "jalandhar|rishikesh": 350,
  "jalandhar|dehradun": 310,
  "jalandhar|mussoorie": 340,
  "jalandhar|jaipur": 620,
  "jalandhar|agra (taj mahal)": 590,

  // From Amritsar
  "amritsar|delhi": 450,
  "amritsar|delhi airport": 460,
  "amritsar|indira gandhi international airport (del)": 460,
  "amritsar|chandigarh": 230,
  "amritsar|chandigarh airport": 238,
  "amritsar|jalandhar": 82,
  "amritsar|ludhiana": 142,
  "amritsar|amritsar airport": 14,
  "amritsar|sri guru ram dass jee airport (atq)": 14,
  "amritsar|shimla": 300,
  "amritsar|manali": 395,
  "amritsar|kullu": 360,
  "amritsar|dharamshala": 200,
  "amritsar|dalhousie": 190,
  "amritsar|pathankot": 110,
  "amritsar|jammu": 215,
  "amritsar|katra": 260,
  "amritsar|hoshiarpur": 120,
  "amritsar|patiala": 230,
  "amritsar|mohali": 225,
  "amritsar|dehradun": 390,
  "amritsar|bathinda": 185,

  // From Ludhiana
  "ludhiana|delhi": 315,
  "ludhiana|delhi airport": 325,
  "ludhiana|indira gandhi international airport (del)": 325,
  "ludhiana|chandigarh": 105,
  "ludhiana|chandigarh airport": 112,
  "ludhiana|amritsar": 142,
  "ludhiana|amritsar airport": 154,
  "ludhiana|jalandhar": 61,
  "ludhiana|shimla": 225,
  "ludhiana|manali": 335,
  "ludhiana|kullu": 295,
  "ludhiana|dharamshala": 215,
  "ludhiana|dalhousie": 245,
  "ludhiana|pathankot": 170,
  "ludhiana|patiala": 95,
  "ludhiana|mohali": 98,
  "ludhiana|zirakpur": 108,
  "ludhiana|dehradun": 255,
  "ludhiana|jaipur": 560,
  "ludhiana|bathinda": 135,
  "ludhiana|hoshiarpur": 75,
  "ludhiana|moga": 70,

  // From Delhi / Delhi Airport
  "delhi airport|jalandhar": 385,
  "delhi airport|amritsar": 460,
  "delhi airport|ludhiana": 325,
  "delhi airport|chandigarh": 260,
  "delhi airport|patiala": 255,
  "delhi airport|bathinda": 320,
  "delhi airport|hoshiarpur": 405,
  "delhi airport|moga": 375,
  "delhi airport|kapurthala": 398,
  "delhi airport|pathankot": 490,
  "delhi airport|shimla": 355,
  "delhi airport|manali": 540,
  "delhi airport|kullu": 500,
  "delhi airport|dharamshala": 485,
  "delhi airport|dalhousie": 570,
  "delhi airport|kasauli": 305,
  "delhi airport|solan": 315,
  "delhi airport|mandi": 440,
  "delhi airport|palampur": 505,
  "delhi airport|gurgaon / gurugram": 18,
  "delhi airport|gurgaon": 18,
  "delhi airport|faridabad": 38,
  "delhi airport|panipat": 105,
  "delhi airport|karnal": 140,
  "delhi airport|rohtak": 82,
  "delhi airport|hisar": 175,
  "delhi airport|sonipat": 65,
  "delhi airport|ambala": 220,
  "delhi airport|panchkula": 265,
  "delhi airport|dehradun": 255,
  "delhi airport|haridwar": 235,
  "delhi airport|rishikesh": 255,
  "delhi airport|jaipur": 260,

  // From Delhi City
  "delhi|jalandhar": 375,
  "delhi|amritsar": 450,
  "delhi|ludhiana": 315,
  "delhi|chandigarh": 250,
  "delhi|patiala": 245,
  "delhi|bathinda": 310,
  "delhi|hoshiarpur": 395,
  "delhi|shimla": 345,
  "delhi|manali": 530,
  "delhi|dharamshala": 475,
  "delhi|dalhousie": 560,

  // From Chandigarh / Chandigarh Airport
  "chandigarh|shimla": 110,
  "chandigarh|manali": 270,
  "chandigarh|kullu": 230,
  "chandigarh|dharamshala": 240,
  "chandigarh|dalhousie": 310,
  "chandigarh|kasauli": 55,
  "chandigarh|solan": 68,
  "chandigarh|mandi": 185,
  "chandigarh|palampur": 255,
  "chandigarh|chail": 105,
  "chandigarh|jalandhar": 148,
  "chandigarh|amritsar": 230,
  "chandigarh|ludhiana": 105,
  "chandigarh|patiala": 70,
  "chandigarh|mohali": 10,
  "chandigarh|zirakpur": 12,
  "chandigarh|bathinda": 225,
  "chandigarh|hoshiarpur": 140,
  "chandigarh|pathankot": 245,
  "chandigarh|moga": 175,
  "chandigarh|delhi": 250,
  "chandigarh|delhi airport": 260,
  "chandigarh|gurgaon / gurugram": 280,
  "chandigarh|gurgaon": 280,
  "chandigarh|noida": 275,
  "chandigarh|faridabad": 290,
  "chandigarh|ghaziabad": 265,
  "chandigarh|dehradun": 170,
  "chandigarh|haridwar": 205,
  "chandigarh|rishikesh": 225,
  "chandigarh|mussoorie": 200,
  "chandigarh|jaipur": 490,

  // Local routes in Punjab
  "jalandhar|nakodar": 26,
  "jalandhar|adampur": 19,
  "jalandhar|adampur airport": 25,
  "jalandhar|adampur airport (aip)": 25,
  "jalandhar|shahkot": 38,
  "jalandhar|kartarpur": 15,
  "jalandhar|goraya": 32,
  "jalandhar|phillaur": 44,
  "jalandhar|nurmahal": 33,
  "jalandhar|bhogpur": 28,
  "jalandhar|beas": 45,
  "jalandhar|sultanpur lodhi": 40,
  "jalandhar|nawanshahr (sbs nagar)": 58,
  "jalandhar|banga": 46,
  "jalandhar|dasuya": 56,
  "jalandhar|mukerian": 68,
  "jalandhar|tanda urmar": 38,
  "phagwara|ludhiana": 40,
  "phagwara|chandigarh": 128,
  "phagwara|delhi": 355,
  "phagwara|amritsar": 104,
  "kapurthala|amritsar": 68,
  "kapurthala|ludhiana": 80,
  "hoshiarpur|chandigarh": 140,
  "hoshiarpur|delhi": 395
};

/**
 * Normalizes location string for lookups
 */
export const normalizeCity = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[(),.\-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
};

/**
 * Find coordinates for a city/area name using multiple fallback strategies
 */
export const findCoordsByName = (name, locationsList = popularLocations) => {
  if (!name || typeof name !== 'string') return null;
  const raw = name.trim().toLowerCase();
  if (!raw) return null;

  // 1. Direct exact name match
  let match = locationsList.find((l) => (l.name || '').toLowerCase() === raw);
  if (match && match.lat && match.lon) return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };

  // 2. Normalized alphanumeric match
  const cleanRaw = normalizeCity(raw);
  match = locationsList.find((l) => {
    const locClean = normalizeCity(l.name);
    return locClean === cleanRaw;
  });
  if (match && match.lat && match.lon) return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };

  // 3. Substring match against full name (prioritize longer name matches)
  const candidates = locationsList.filter((l) => {
    const locClean = normalizeCity(l.name);
    return cleanRaw.includes(locClean) || locClean.includes(cleanRaw);
  }).sort((a, b) => (b.name || '').length - (a.name || '').length);

  if (candidates.length > 0 && candidates[0].lat && candidates[0].lon) {
    return { lat: parseFloat(candidates[0].lat), lon: parseFloat(candidates[0].lon) };
  }

  // 4. Split comma-separated tokens (e.g. "Rama Mandi, Jalandhar" -> check "Rama Mandi", then "Jalandhar")
  const parts = raw.split(',').map((p) => normalizeCity(p)).filter(Boolean);
  for (const part of parts) {
    const partMatch = locationsList.find((l) => {
      const locClean = normalizeCity(l.name);
      return locClean === part || locClean.includes(part) || part.includes(locClean);
    });
    if (partMatch && partMatch.lat && partMatch.lon) {
      return { lat: parseFloat(partMatch.lat), lon: parseFloat(partMatch.lon) };
    }
  }

  return null;
};

/**
 * Compute distance between two points.
 * 1. Checks exact pair in distance dictionary.
 * 2. Checks substring match in distance dictionary.
 * 3. Uses coordinate-based geodesic formula (Haversine * ROAD_FACTOR).
 * 4. Returns null if coordinates cannot be resolved (so caller can fetch live OSM coords).
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

  // 2. High-precision coordinate-based calculation
  const c1 = fromCoords || findCoordsByName(from);
  const c2 = toCoords || findCoordsByName(to);

  if (c1 && c2 && c1.lat && c2.lat) {
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
    return Math.max(roadDist, 5);
  }

  // 3. Substring matches in dictionary only if coordinates could not be resolved
  for (const [k, dist] of Object.entries(knownDistances)) {
    const [kFrom, kTo] = k.split('|');
    if (
      (cleanFrom === kFrom || cleanFrom.startsWith(kFrom + ' ') || cleanFrom.endsWith(' ' + kFrom)) &&
      (cleanTo === kTo || cleanTo.startsWith(kTo + ' ') || cleanTo.endsWith(' ' + kTo))
    ) {
      return dist;
    }
  }

  return null;
};


