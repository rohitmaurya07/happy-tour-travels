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
  "jalandhar|begowal": 42,
  "begowal|jalandhar": 42,
  "jalandhar|shahkot": 38,
  "shahkot|jalandhar": 38,
  "jalandhar|sultanpur lodhi": 40,
  "sultanpur lodhi|jalandhar": 40,
  "jalandhar|phillaur": 44,
  "phillaur|jalandhar": 44,
  "jalandhar|hoshiarpur": 42,
  "hoshiarpur|jalandhar": 42,
  "jalandhar|banga": 46,
  "banga|jalandhar": 46,
  "jalandhar|hariana": 54,
  "hariana|jalandhar": 54,
  "jalandhar|gardhiwala": 62,
  "gardhiwala|jalandhar": 62,
  "jalandhar|ludhiana": 61,
  "ludhiana|jalandhar": 61,
  "jalandhar|nawanshahr": 58,
  "nawanshahr|jalandhar": 58,
  "jalandhar|amritsar": 82,
  "amritsar|jalandhar": 82,
  "jalandhar|amritsar airport": 95,
  "amritsar airport|jalandhar": 95,
  "jalandhar|batala": 78,
  "batala|jalandhar": 78,
  "jalandhar|moga": 70,
  "moga|jalandhar": 70,
  "jalandhar|jagraon": 76,
  "jagraon|jalandhar": 76,
  "jalandhar|khanna": 95,
  "khanna|jalandhar": 95,
  "jalandhar|samrala": 100,
  "samrala|jalandhar": 100,
  "jalandhar|rajpura": 145,
  "rajpura|jalandhar": 145,
  "jalandhar|mandi gobindgarh": 115,
  "mandi gobindgarh|jalandhar": 115,
  "jalandhar|sirhind": 125,
  "sirhind|jalandhar": 125,
  "jalandhar|fatehgarh sahib": 125,
  "fatehgarh sahib|jalandhar": 125,
  "jalandhar|rupnagar": 125,
  "rupnagar|jalandhar": 125,
  "jalandhar|pathankot": 112,
  "pathankot|jalandhar": 112,
  "jalandhar|gurdaspur": 105,
  "gurdaspur|jalandhar": 105,
  "jalandhar|tarn taran": 105,
  "tarn taran|jalandhar": 105,
  "jalandhar|barnala": 120,
  "barnala|jalandhar": 120,
  "jalandhar|sangrur": 135,
  "sangrur|jalandhar": 135,
  "jalandhar|malerkotla": 120,
  "malerkotla|jalandhar": 120,
  "jalandhar|nabha": 140,
  "nabha|jalandhar": 140,
  "jalandhar|firozpur": 151,
  "firozpur|jalandhar": 151,
  "jalandhar|patiala": 150,
  "patiala|jalandhar": 150,
  "jalandhar|bathinda": 184,
  "bathinda|jalandhar": 184,
  "jalandhar|chandigarh": 148,
  "chandigarh|jalandhar": 148,
  "jalandhar|chandigarh airport": 155,
  "chandigarh airport|jalandhar": 155,
  "jalandhar|mohali": 142,
  "mohali|jalandhar": 142,
  "jalandhar|ambala": 171,
  "ambala|jalandhar": 171,
  "jalandhar|kurukshetra": 200,
  "kurukshetra|jalandhar": 200,
  "jalandhar|thanesar": 200,
  "thanesar|jalandhar": 200,
  "jalandhar|karnal": 235,
  "karnal|jalandhar": 235,
  "jalandhar|panipat": 270,
  "panipat|jalandhar": 270,
  "jalandhar|yamunanagar": 250,
  "yamunanagar|jalandhar": 250,
  "jalandhar|dehradun": 310,
  "dehradun|jalandhar": 310,
  "jalandhar|muzaffarnagar": 322,
  "muzaffarnagar|jalandhar": 322,
  "jalandhar|meerut": 368,
  "meerut|jalandhar": 368,
  "jalandhar|delhi": 375,
  "delhi|jalandhar": 375,
  "jalandhar|delhi airport": 385,
  "delhi airport|jalandhar": 385,
  "jalandhar|gurugram": 395,
  "gurugram|jalandhar": 395,
  "jalandhar|noida": 410,
  "noida|jalandhar": 410,
  "jalandhar|faridabad": 415,
  "faridabad|jalandhar": 415,
  "jalandhar|ghaziabad": 394,
  "ghaziabad|jalandhar": 394,
  "delhi|dehradun": 250,
  "dehradun|delhi": 250,
  "delhi|ambala": 242,
  "ambala|delhi": 242,
  "delhi|bathinda": 315,
  "bathinda|delhi": 315,
  "delhi|chandigarh": 260,
  "chandigarh|delhi": 260,
  "delhi|mohali": 247,
  "mohali|delhi": 247,
  "delhi|firozpur": 435,
  "firozpur|delhi": 435,
  "delhi|patiala": 251,
  "patiala|delhi": 251,
  "delhi|malerkotla": 313,
  "malerkotla|delhi": 313,
  "delhi|gurdaspur": 465,
  "gurdaspur|delhi": 465,
  "delhi|ropar": 276,
  "ropar|delhi": 276,
  "delhi|rupnagar": 276,
  "rupnagar|delhi": 276,
  "delhi|rajpura": 225,
  "rajpura|delhi": 225,
  "delhi|khanna": 270,
  "khanna|delhi": 270,
  "delhi|amritsar": 450,
  "amritsar|delhi": 450,
  "delhi|batala": 445,
  "batala|delhi": 445,
  "delhi|phagwara": 348,
  "phagwara|delhi": 348,
  "delhi|ludhiana": 310,
  "ludhiana|delhi": 310,
  "delhi|moga": 378,
  "moga|delhi": 378,
  "delhi airport|shimla": 377,
  "shimla|delhi airport": 377,
  "delhi airport|kasauli": 320,
  "kasauli|delhi airport": 320,
  "delhi airport|solan": 330,
  "solan|delhi airport": 330,
  "delhi airport|chail": 400,
  "chail|delhi airport": 400,
  "delhi airport|mandi": 480,
  "mandi|delhi airport": 480,
  "delhi airport|kullu": 500,
  "kullu|delhi airport": 500,
  "delhi airport|kasol": 520,
  "kasol|delhi airport": 520,
  "delhi airport|dharamshala": 510,
  "dharamshala|delhi airport": 510,
  "delhi airport|mcleod ganj": 515,
  "mcleod ganj|delhi airport": 515,
  "delhi airport|palampur": 490,
  "palampur|delhi airport": 490,
  "delhi airport|bir": 500,
  "bir|delhi airport": 500,
  "delhi airport|manali": 550,
  "manali|delhi airport": 550,
  "delhi airport|dalhousie": 590,
  "dalhousie|delhi airport": 590,
  "delhi airport|chamba": 625,
  "chamba|delhi airport": 625,
  "delhi airport|jibhi": 520,
  "jibhi|delhi airport": 520,
  "amritsar airport|kapurthala": 80,
  "kapurthala|amritsar airport": 80,
  "amritsar airport|nakodar": 112,
  "nakodar|amritsar airport": 112,
  "amritsar airport|phagwara": 103,
  "phagwara|amritsar airport": 103,
  "amritsar airport|ludhiana": 160,
  "ludhiana|amritsar airport": 160,
  "amritsar airport|moga": 105,
  "moga|amritsar airport": 105,
  "amritsar airport|zira": 84,
  "zira|amritsar airport": 84,
  "amritsar airport|batala": 48,
  "batala|amritsar airport": 48,
  "amritsar airport|gurdaspur": 82,
  "gurdaspur|amritsar airport": 82,
  "amritsar airport|pathankot": 116,
  "pathankot|amritsar airport": 116,
  "amritsar airport|hoshiarpur": 120,
  "hoshiarpur|amritsar airport": 120,
  "amritsar airport|firozpur": 107,
  "firozpur|amritsar airport": 107,
  "amritsar airport|faridkot": 142,
  "faridkot|amritsar airport": 142,
  "amritsar airport|mansa": 220,
  "mansa|amritsar airport": 220,
  "amritsar airport|chandigarh": 229,
  "chandigarh|amritsar airport": 229,
  "amritsar airport|dalhousie": 204,
  "dalhousie|amritsar airport": 204,
  "chandigarh airport|kasauli": 69,
  "kasauli|chandigarh airport": 69,
  "chandigarh airport|solan": 76,
  "solan|chandigarh airport": 76,
  "chandigarh airport|shimla": 123,
  "shimla|chandigarh airport": 123,
  "chandigarh airport|chail": 123,
  "chail|chandigarh airport": 123,
  "chandigarh airport|kufri": 135,
  "kufri|chandigarh airport": 135,
  "chandigarh airport|narkanda": 195,
  "narkanda|chandigarh airport": 195,
  "chandigarh airport|mandi": 220,
  "mandi|chandigarh airport": 220,
  "chandigarh airport|bir billing": 220,
  "bir billing|chandigarh airport": 220,
  "chandigarh airport|bir": 220,
  "bir|chandigarh airport": 220,
  "chandigarh airport|palampur": 225,
  "palampur|chandigarh airport": 225,
  "chandigarh airport|jibhi": 233,
  "jibhi|chandigarh airport": 233,
  "chandigarh airport|kullu": 244,
  "kullu|chandigarh airport": 244,
  "chandigarh airport|kasol": 253,
  "kasol|chandigarh airport": 253,
  "chandigarh airport|dharamshala": 253,
  "dharamshala|chandigarh airport": 253,
  "chandigarh airport|manikaran": 258,
  "manikaran|chandigarh airport": 258,
  "chandigarh airport|mcleod ganj": 263,
  "mcleod ganj|chandigarh airport": 263,
  "chandigarh airport|manali": 280,
  "manali|chandigarh airport": 280,
  "chandigarh airport|solang valley": 290,
  "solang valley|chandigarh airport": 290,
  "chandigarh airport|dalhousie": 307,
  "dalhousie|chandigarh airport": 307,
  "chandigarh airport|chamba": 327,
  "chamba|chandigarh airport": 327,
  "chandigarh airport|khajjiar": 329,
  "khajjiar|chandigarh airport": 329,
  "jalandhar|indira gandhi international airport del": 385,
  "indira gandhi international airport del|jalandhar": 385,
  "jalandhar|phagwara": 22,
  "phagwara|jalandhar": 22,
  "jalandhar|kapurthala": 22,
  "kapurthala|jalandhar": 22,
  "jalandhar|adampur": 19,
  "adampur|jalandhar": 19,
  "jalandhar|nakodar": 26,
  "nakodar|jalandhar": 26,
  "delhi airport|bir billing": 500,
  "bir billing|delhi airport": 500
};

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
const HILL_KEYWORDS = [
  'shimla', 'manali', 'dharamshala', 'dalhousie', 'kullu', 'kasol', 'kasauli',
  'solan', 'mandi', 'palampur', 'chail', 'mussoorie', 'rishikesh', 'dehradun',
  'nainital', 'kufri', 'mcleod ganj', 'khajjiar', 'tosh', 'rohtang', 'atal tunnel',
  'spiti', 'kinnaur', 'leh', 'ladakh', 'lahaul', 'jibhi', 'tirthan', 'dhanaulti', 'patnitop'
];

/**
 * Calculates realistic road curvature multiplier based on geographical terrain.
 * - Indian Plains & National Highways (NH44 / GT Road): 1.145x geodesic distance.
 * - Hill Stations & Mountain passes: 1.38x - 1.50x geodesic distance.
 */
export const getRoadFactor = (from, to, c1 = null, c2 = null) => {
  const f = (from || '').toLowerCase();
  const t = (to || '').toLowerCase();

  const isHighMountain = ['manali', 'kullu', 'kasol', 'tosh', 'rohtang', 'spiti', 'leh', 'ladakh', 'lahaul'].some(
    k => f.includes(k) || t.includes(k)
  );
  if (isHighMountain) return 1.50;

  const isHill =
    HILL_KEYWORDS.some(k => f.includes(k) || t.includes(k)) ||
    (c1?.regionType === 'HILL' || c2?.regionType === 'HILL') ||
    (c1?.state && ['himachal pradesh', 'uttarakhand', 'ladakh'].includes(c1.state.toLowerCase())) ||
    (c2?.state && ['himachal pradesh', 'uttarakhand', 'ladakh'].includes(c2.state.toLowerCase()));
  if (isHill) return 1.38;

  return 1.145;
};

/**
 * Compute distance between two points.
 * 1. Checks exact pair in distance dictionary.
 * 2. Uses coordinate-based geodesic formula with dynamic terrain road curvature.
 * 3. Checks substring match in distance dictionary as fallback.
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

    // Apply dynamic terrain-aware road curvature multiplier
    const factor = getRoadFactor(from, to, c1, c2);
    const roadDist = Math.round(straightDist * factor);
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



