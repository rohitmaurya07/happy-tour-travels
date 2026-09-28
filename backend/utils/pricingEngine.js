import { readJson } from './storage.js';

const ROAD_FACTOR = 1.28;
const toRad = (deg) => (deg * Math.PI) / 180;

export const KNOWN_DISTANCES = {
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
  "jalandhar|dehradun": 325,
  "dehradun|jalandhar": 325,
  "jalandhar|muzaffarnagar": 322,
  "muzaffarnagar|jalandhar": 322,
  "jalandhar|meerut": 368,
  "meerut|jalandhar": 368,
  "jalandhar|delhi": 370,
  "delhi|jalandhar": 370,
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
  "delhi|ludhiana": 330,
  "ludhiana|delhi": 330,
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
  "amritsar airport|ludhiana": 155,
  "ludhiana|amritsar airport": 155,
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
  "mussoorie|delhi airport": 280,
  "delhi airport|mussoorie": 280,
  "rishikesh|delhi airport": 260,
  "delhi airport|rishikesh": 260,
  "haridwar|delhi airport": 240,
  "delhi airport|haridwar": 240,
  "haldwani|delhi airport": 300,
  "delhi airport|haldwani": 300,
  "nainital|delhi airport": 300,
  "delhi airport|nainital": 300,
  "jalandhar|lansdowne": 450,
  "lansdowne|jalandhar": 450,
  "jalandhar|nainital": 585,
  "nainital|jalandhar": 585,
  "jalandhar|sonprayag": 590,
  "sonprayag|jalandhar": 590,
  "jalandhar|badrinath": 670,
  "badrinath|jalandhar": 670,
  "jalandhar|roorkee": 302,
  "roorkee|jalandhar": 302,
  "jalandhar|haridwar": 328,
  "haridwar|jalandhar": 328,
  "jalandhar|rishikesh": 360,
  "rishikesh|jalandhar": 360,
  "jalandhar|kotdwar": 380,
  "kotdwar|jalandhar": 380,
  "jalandhar|haldwani": 600,
  "haldwani|jalandhar": 600,
  "delhi airport|khatu shyam ji": 280,
  "khatu shyam ji|delhi airport": 280,
  "delhi airport|khatu shyam": 280,
  "khatu shyam|delhi airport": 280,
  "delhi airport|vrindavan dham": 160,
  "vrindavan dham|delhi airport": 160,
  "delhi airport|vrindavan": 160,
  "vrindavan|delhi airport": 160,
  "ludhiana|chandigarh": 100,
  "chandigarh|ludhiana": 100,
  "ludhiana|chandigarh airport": 110,
  "chandigarh airport|ludhiana": 110,
  "ludhiana|rupnagar": 115,
  "rupnagar|ludhiana": 115,
  "ludhiana|faridkot": 120,
  "faridkot|ludhiana": 120,
  "ludhiana|firozpur": 130,
  "firozpur|ludhiana": 130,
  "ludhiana|amritsar": 140,
  "amritsar|ludhiana": 140,
  "ludhiana|bathinda": 145,
  "bathinda|ludhiana": 145,
  "ludhiana|bathinda airport": 145,
  "bathinda airport|ludhiana": 145,
  "ludhiana|muktsar": 150,
  "muktsar|ludhiana": 150,
  "ludhiana|sri muktsar sahib": 150,
  "sri muktsar sahib|ludhiana": 150,
  "ludhiana|tarn taran": 150,
  "tarn taran|ludhiana": 150,
  "ludhiana|batala": 155,
  "batala|ludhiana": 155,
  "ludhiana|gurdaspur": 160,
  "gurdaspur|ludhiana": 160,
  "ludhiana|pathankot": 165,
  "pathankot|ludhiana": 165,
  "ludhiana|anandpur sahib": 150,
  "anandpur sahib|ludhiana": 150,
  "ludhiana|nangal": 145,
  "nangal|ludhiana": 145,
  "ludhiana|ambala": 110,
  "ambala|ludhiana": 110,
  "ludhiana|panchkula": 115,
  "panchkula|ludhiana": 115,
  "ludhiana|yamunanagar": 165,
  "yamunanagar|ludhiana": 165,
  "ludhiana|kurukshetra": 180,
  "kurukshetra|ludhiana": 180,
  "ludhiana|kaithal": 190,
  "kaithal|ludhiana": 190,
  "ludhiana|karnal": 200,
  "karnal|ludhiana": 200,
  "ludhiana|abohar": 240,
  "abohar|ludhiana": 240,
  "ludhiana|fazilka": 205,
  "fazilka|ludhiana": 205,
  "ludhiana|fatehabad": 255,
  "fatehabad|ludhiana": 255,
  "ludhiana|panipat": 225,
  "panipat|ludhiana": 225,
  "ludhiana|sonipat": 270,
  "sonipat|ludhiana": 270,
  "ludhiana|rohtak": 280,
  "rohtak|ludhiana": 280,
  "ludhiana|hisar": 300,
  "hisar|ludhiana": 300,
  "ludhiana|sirsa": 300,
  "sirsa|ludhiana": 300,
  "ludhiana|rewari": 300,
  "rewari|ludhiana": 300,
  "ludhiana|gurugram": 330,
  "gurugram|ludhiana": 330,
  "ludhiana|delhi airport": 330,
  "delhi airport|ludhiana": 330,
  "ludhiana|faridabad": 350,
  "faridabad|ludhiana": 350,
  "ludhiana|hanumangarh": 300,
  "hanumangarh|ludhiana": 300,
  "ludhiana|sri ganganagar": 330,
  "sri ganganagar|ludhiana": 330,
  "ludhiana|bhiwadi": 350,
  "bhiwadi|ludhiana": 350,
  "ludhiana|alwar": 370,
  "alwar|ludhiana": 370
};

export const normalizeLocation = (str) => {
  if (!str || typeof str !== 'string') return '';
  let clean = str.replace(/[(),.\-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

  // Airport alias normalizations
  if (
    clean.includes('indira gandhi') ||
    clean.includes('igi airport') ||
    clean.includes('delhi igi') ||
    clean.includes('delhi t1') ||
    clean.includes('delhi t2') ||
    clean.includes('delhi t3') ||
    clean.includes('delhi international airport') ||
    clean === 'delhi airport del' ||
    clean === 'del'
  ) {
    return 'delhi airport';
  }

  if (
    clean.includes('guru ram dass') ||
    clean.includes('guru ram das') ||
    clean.includes('amritsar international airport') ||
    clean.includes('rajasansi') ||
    clean === 'amritsar airport atq' ||
    clean === 'atq'
  ) {
    return 'amritsar airport';
  }

  if (
    clean.includes('bhagat singh') ||
    clean.includes('chandigarh international airport') ||
    clean === 'chandigarh airport ixc' ||
    clean === 'ixc'
  ) {
    return 'chandigarh airport';
  }

  if (
    clean.includes('jolly grant') ||
    clean.includes('dehradun airport') ||
    clean === 'ded'
  ) {
    return 'dehradun airport';
  }

  if (clean.includes('adampur airport') || clean === 'aip') {
    return 'adampur airport';
  }

  if (clean.includes('bathinda airport') || clean === 'bup') {
    return 'bathinda airport';
  }

  return clean;
};

export const findLocationCoords = (name, locationsList = null) => {
  if (!name || typeof name !== 'string') return null;
  const raw = name.trim().toLowerCase();
  if (!raw) return null;

  const locations = locationsList || readJson('popularLocations') || [];

  // 1. Direct exact match
  let match = locations.find((l) => (l.name || '').toLowerCase() === raw);
  if (match && match.lat && match.lon) return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };

  // 2. Normalized alphanumeric match
  const cleanRaw = normalizeLocation(raw);
  match = locations.find((l) => {
    const locClean = normalizeLocation(l.name);
    return locClean === cleanRaw;
  });
  if (match && match.lat && match.lon) return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };

  // 3. Substring match against full name (prioritize longer name matches)
  const candidates = locations.filter((l) => {
    const locClean = normalizeLocation(l.name);
    return cleanRaw.includes(locClean) || locClean.includes(cleanRaw);
  }).sort((a, b) => (b.name || '').length - (a.name || '').length);

  if (candidates.length > 0 && candidates[0].lat && candidates[0].lon) {
    return { lat: parseFloat(candidates[0].lat), lon: parseFloat(candidates[0].lon) };
  }

  // 4. Split comma-separated tokens (e.g. "Model Town, Jalandhar")
  const parts = raw.split(',').map((p) => normalizeLocation(p)).filter(Boolean);
  for (const part of parts) {
    const partMatch = locations.find((l) => {
      const locClean = normalizeLocation(l.name);
      return locClean === part || locClean.includes(part) || part.includes(locClean);
    });
    if (partMatch && partMatch.lat && partMatch.lon) {
      return { lat: parseFloat(partMatch.lat), lon: parseFloat(partMatch.lon) };
    }
  }

  return null;
};

const HILL_KEYWORDS = [
  'shimla', 'manali', 'dharamshala', 'dalhousie', 'kullu', 'kasol', 'kasauli',
  'solan', 'mandi', 'palampur', 'chail', 'mussoorie', 'rishikesh', 'dehradun',
  'nainital', 'kufri', 'mcleod ganj', 'khajjiar', 'tosh', 'rohtang', 'atal tunnel',
  'spiti', 'kinnaur', 'leh', 'ladakh', 'lahaul', 'jibhi', 'tirthan', 'dhanaulti', 'patnitop'
];

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

export const calculateDistance = (from, to, fromCoords = null, toCoords = null) => {
  if (!from || !to) return 50;

  const cleanFrom = normalizeLocation(from);
  const cleanTo = normalizeLocation(to);

  // 1. Direct exact pair lookup
  const key1 = `${cleanFrom}|${cleanTo}`;
  const key2 = `${cleanTo}|${cleanFrom}`;
  if (KNOWN_DISTANCES[key1]) return KNOWN_DISTANCES[key1];
  if (KNOWN_DISTANCES[key2]) return KNOWN_DISTANCES[key2];

  // 2. Substring matching in known distances (both directions)
  const matchingDist = Object.entries(KNOWN_DISTANCES).find(([k]) => {
    const [kFrom, kTo] = k.split('|');
    return (
      (cleanFrom.includes(kFrom) && cleanTo.includes(kTo)) ||
      (cleanFrom.includes(kTo) && cleanTo.includes(kFrom))
    );
  });
  if (matchingDist) return matchingDist[1];

  // 3. High-precision coordinate-based calculation using popularLocations
  const c1 = fromCoords || findLocationCoords(from);
  const c2 = toCoords || findLocationCoords(to);

  if (c1 && c2 && c1.lat && c2.lat) {
    const R = 6371;
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

  return 60;
};



export const validateVehiclePricing = (vehicle) => {
  if (!vehicle || typeof vehicle !== 'object') {
    return { valid: false, message: 'Vehicle configuration object is required.' };
  }

  if (!vehicle.name || !vehicle.name.trim()) {
    return { valid: false, message: 'Vehicle name is required.' };
  }

  const numericFields = [
    { key: 'plainRatePerKm', label: 'Plain rate (₹/km)' },
    { key: 'hillRatePerKm', label: 'Hill rate (₹/km)' },
    { key: 'oneWayRate', label: 'One-way rate (₹/km)' },
    { key: 'roundTripRate', label: 'Round-trip rate (₹/km)' },
    { key: 'extraKmRate', label: 'Extra KM rate (₹/km)' },
    { key: 'minBookingKm', label: 'Minimum booking KM' },
    { key: 'airportBasePrice', label: 'Airport base price' },
    { key: 'driverAllowance', label: 'Driver allowance' }
  ];

  for (const field of numericFields) {
    if (vehicle[field.key] !== undefined && vehicle[field.key] !== null && vehicle[field.key] !== '') {
      const val = Number(vehicle[field.key]);
      if (isNaN(val) || val < 0) {
        return { valid: false, message: `${field.label} cannot be negative or invalid.` };
      }
    }
  }

  // Long distance validation
  if (vehicle.longDistance) {
    const startAfterKm = Number(vehicle.longDistance.startAfterKm);
    const baseFare = Number(vehicle.longDistance.baseFare);
    const additionalKmRate = Number(vehicle.longDistance.additionalKmRate);
    const minBookingKm = Number(vehicle.minBookingKm) || 0;

    if (isNaN(startAfterKm) || startAfterKm < 0) {
      return { valid: false, message: 'Long distance threshold KM must be a non-negative number.' };
    }
    if (isNaN(baseFare) || baseFare < 0) {
      return { valid: false, message: 'Long distance base fare cannot be negative.' };
    }
    if (isNaN(additionalKmRate) || additionalKmRate < 0) {
      return { valid: false, message: 'Long distance additional KM rate cannot be negative.' };
    }
    if (startAfterKm < minBookingKm) {
      return { valid: false, message: `Long distance threshold (${startAfterKm} km) cannot be lower than minimum booking distance (${minBookingKm} km).` };
    }
  }

  // Local slabs validation (overlapping / duplicate / negative check)
  if (Array.isArray(vehicle.slabs) && vehicle.slabs.length > 0) {
    const sorted = [...vehicle.slabs].sort((a, b) => Number(a.minKm) - Number(b.minKm));
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const minKm = Number(s.minKm);
      const maxKm = Number(s.maxKm);
      const price = Number(s.price);

      if (isNaN(minKm) || minKm < 0) {
        return { valid: false, message: `Slab #${i + 1} starting KM must be non-negative.` };
      }
      if (isNaN(maxKm) || maxKm <= minKm) {
        return { valid: false, message: `Slab #${i + 1} ending KM (${maxKm}) must be greater than starting KM (${minKm}).` };
      }
      if (isNaN(price) || price < 0) {
        return { valid: false, message: `Slab #${i + 1} price cannot be negative.` };
      }

      if (i > 0) {
        const prev = sorted[i - 1];
        const prevMin = Number(prev.minKm);
        const prevMax = Number(prev.maxKm);
        if (minKm === prevMin && maxKm === prevMax) {
          return { valid: false, message: `Duplicate slab range detected: ${minKm}–${maxKm} KM.` };
        }
        if (minKm < prevMax) {
          return { valid: false, message: `Overlapping slabs detected: Slab ${prevMin}–${prevMax} KM overlaps with ${minKm}–${maxKm} KM.` };
        }
      }
    }
  }

  // Hourly packages validation
  if (vehicle.packages) {
    if (vehicle.packages.fourHours) {
      const p4 = Number(vehicle.packages.fourHours.price);
      const k4 = Number(vehicle.packages.fourHours.includedKm);
      if (isNaN(p4) || p4 < 0) return { valid: false, message: '4-hour package price cannot be negative.' };
      if (isNaN(k4) || k4 <= 0) return { valid: false, message: '4-hour package included KM must be greater than 0.' };
    }
    if (vehicle.packages.eightHours) {
      const p8 = Number(vehicle.packages.eightHours.price);
      const k8 = Number(vehicle.packages.eightHours.includedKm);
      if (isNaN(p8) || p8 < 0) return { valid: false, message: '8-hour package price cannot be negative.' };
      if (isNaN(k8) || k8 <= 0) return { valid: false, message: '8-hour package included KM must be greater than 0.' };
    }
  }

  return { valid: true };
};



export const resolveRouteDetails = (pickup, destination) => {
  const cleanFrom = normalizeLocation(pickup);
  const cleanTo = normalizeLocation(destination);

  const routes = readJson('pricingRoutes') || [];
  const locations = readJson('popularLocations') || [];

  // 1. Direct exact directional match
  let matchedRoute = routes.find((r) => {
    if (r.active === false) return false;
    const rFrom = normalizeLocation(r.pickup);
    const rTo = normalizeLocation(r.destination);
    return rFrom === cleanFrom && rTo === cleanTo;
  });

  // 2. Direct exact reverse match
  if (!matchedRoute) {
    matchedRoute = routes.find((r) => {
      if (r.active === false) return false;
      const rFrom = normalizeLocation(r.pickup);
      const rTo = normalizeLocation(r.destination);
      return rFrom === cleanTo && rTo === cleanFrom;
    });
  }

  // 3. Substring match across entire city/hub (e.g. "Model Town, Jalandhar" -> "Jalandhar", "IGI Delhi Airport" -> "Delhi Airport")
  // Prioritize longer, most specific matches (e.g. "Delhi Airport" before "Delhi")
  if (!matchedRoute) {
    const candidates = routes.filter((r) => {
      if (r.active === false) return false;
      const rFrom = normalizeLocation(r.pickup);
      const rTo = normalizeLocation(r.destination);
      return (
        (cleanFrom.includes(rFrom) && cleanTo.includes(rTo)) ||
        (cleanFrom.includes(rTo) && cleanTo.includes(rFrom))
      );
    }).sort((a, b) => {
      const lenA = (a.pickup || '').length + (a.destination || '').length;
      const lenB = (b.pickup || '').length + (b.destination || '').length;
      return lenB - lenA;
    });

    if (candidates.length > 0) {
      matchedRoute = candidates[0];
    }
  }

  // 4. Token / Comma-separated or Word boundary match (e.g. "Rama Mandi, Jalandhar" -> check tokens "Rama Mandi", "Jalandhar")
  if (!matchedRoute) {
    const fromTokens = (pickup || '').split(/[,/|]+/).map(t => normalizeLocation(t)).filter(Boolean);
    const toTokens = (destination || '').split(/[,/|]+/).map(t => normalizeLocation(t)).filter(Boolean);

    for (const fTok of [cleanFrom, ...fromTokens]) {
      for (const tTok of [cleanTo, ...toTokens]) {
        matchedRoute = routes.find(r => {
          if (r.active === false) return false;
          const rFrom = normalizeLocation(r.pickup);
          const rTo = normalizeLocation(r.destination);
          return (
            (rFrom === fTok && rTo === tTok) ||
            (rFrom === tTok && rTo === fTok) ||
            (fTok.includes(rFrom) && tTok.includes(rTo)) ||
            (fTok.includes(rTo) && tTok.includes(rFrom))
          );
        });
        if (matchedRoute) break;
      }
      if (matchedRoute) break;
    }
  }

  if (matchedRoute) {
    return {
      route: matchedRoute,
      routeType: (matchedRoute.routeType || 'PLAIN').toUpperCase(),
      pricingType: matchedRoute.pricingType || 'per_km',
      fixedPrices: matchedRoute.vehiclePrices || {},
      customDistance: matchedRoute.distanceKm || null
    };
  }

  const locFrom = locations.find((l) => {
    const n = normalizeLocation(l.name);
    return n === cleanFrom || cleanFrom.includes(n) || n.includes(cleanFrom);
  });

  const locTo = locations.find((l) => {
    const n = normalizeLocation(l.name);
    return n === cleanTo || cleanTo.includes(n) || n.includes(cleanTo);
  });

  let routeType = 'PLAIN';
  const fromRegion = (locFrom?.regionType || '').toUpperCase();
  const toRegion = (locTo?.regionType || '').toUpperCase();

  const isHillKeyword = HILL_KEYWORDS.some(k => cleanTo.includes(k) || cleanFrom.includes(k));

  if (toRegion === 'HILL' || fromRegion === 'HILL' || isHillKeyword) {
    routeType = 'HILL';
  } else if (toRegion === 'MIXED' || fromRegion === 'MIXED') {
    routeType = 'MIXED';
  } else if (locTo?.type === 'Hill Station' || locFrom?.type === 'Hill Station') {
    routeType = 'HILL';
  }

  return {
    route: null,
    routeType,
    pricingType: 'per_km',
    fixedPrices: {},
    customDistance: null
  };
};

export const isNightHour = (timeStr, startHour = 23, endHour = 5) => {
  if (!timeStr || typeof timeStr !== 'string') return false;
  const parts = timeStr.split(':');
  if (parts.length === 0) return false;
  const hour = parseInt(parts[0], 10);
  if (isNaN(hour)) return false;

  if (startHour > endHour) {
    return hour >= startHour || hour < endHour;
  }
  return hour >= startHour && hour < endHour;
};

export const calculateFare = ({
  pickup,
  destination,
  vehicleId,
  tripType = 'One Way',
  departureDate = null,
  pickupTime = '09:00',
  hourlyPackage = '8h',
  fromCoords = null,
  toCoords = null,
  distanceKm = null
}) => {
  if (!pickup || !destination) {
    throw new Error('Pickup and Destination locations are required.');
  }

  if (!vehicleId) {
    throw new Error('Vehicle ID is required.');
  }

  const fleet = readJson('fleet') || [];
  const vehicle = fleet.find((v) => v.id === vehicleId || v.id === vehicleId.toLowerCase());

  if (!vehicle) {
    throw new Error(`Vehicle with ID "${vehicleId}" not found.`);
  }

  if (vehicle.active === false) {
    throw new Error(`Vehicle "${vehicle.name}" is currently inactive / unavailable.`);
  }

  const pricingSettings = readJson('pricingSettings') || {};

  const routeDetails = resolveRouteDetails(pickup, destination);
  const routeType = routeDetails.routeType;

  let actualDistance = routeDetails.customDistance || (Number(distanceKm) > 0 ? Number(distanceKm) : calculateDistance(pickup, destination, fromCoords, toCoords));
  if (actualDistance <= 0) actualDistance = 50;

  const isHourly = tripType === 'Hourly Rental';
  const isRoundTrip = tripType === 'Round Trip';
  const isAirport = tripType === 'Airport';

  let billableKm = actualDistance;
  let ratePerKm = 0;
  let baseFare = 0;
  let pricingType = 'per_km';
  let pricingRuleApplied = 'Authoritative Database Pricing';
  let appliedSlab = null;

  const minBookingKm = vehicle.minBookingKm !== undefined ? Number(vehicle.minBookingKm) : (vehicle.slabs?.[0]?.minKm || 20);
  const outstationMinKm = vehicle.minimumKm !== undefined ? Number(vehicle.minimumKm) : 250;
  const extraKmRate = vehicle.extraKmRate !== undefined ? Number(vehicle.extraKmRate) : (vehicle.plainRatePerKm || 11);
  const driverAllowance = vehicle.driverAllowance !== undefined ? Number(vehicle.driverAllowance) : (pricingSettings.driverAllowance ?? 300);

  // 1. Hourly Rental Package
  if (isHourly) {
    // Only Dzire, Ertiga, and Innova Crysta are allowed for Hourly Rental
    const allowedHourly = ['dzire', 'ertiga', 'innova'];
    if (!allowedHourly.includes(vehicle.id)) {
      throw new Error(`${vehicle.name} is not available for hourly rental.`);
    }

    pricingType = 'hourly_package';
    const hourlyConfig = readJson('hourlyRentalPricing') || {};
    const defaultCarConfig = hourlyConfig.defaultRates?.[vehicle.id] || {};

    let pkgPrice = 0;
    let includedKm = 80;
    let pkgLabel = '8 Hours / 80 KM';

    if (hourlyPackage === '4h' || hourlyPackage === '4h40k') {
      pkgPrice = defaultCarConfig.rates?.['4h40k'] || vehicle.packages?.fourHours?.price || vehicle.localPackages?.fourHours || 1100;
      includedKm = 40;
      pkgLabel = '4 Hours / 40 KM';
    } else if (hourlyPackage === '10h' || hourlyPackage === '10h100k') {
      pkgPrice = defaultCarConfig.rates?.['10h100k'] || 2800;
      includedKm = 100;
      pkgLabel = '10 Hours / 100 KM';
    } else {
      // 8h default
      pkgPrice = defaultCarConfig.rates?.['8h80k'] || vehicle.packages?.eightHours?.price || vehicle.localPackages?.eightHours || vehicle.hourlyRate || 2300;
      includedKm = 80;
      pkgLabel = '8 Hours / 80 KM';
    }

    baseFare = Number(pkgPrice) || 1500;
    billableKm = includedKm;
    ratePerKm = defaultCarConfig.extraKmRate || extraKmRate;
    pricingRuleApplied = `${pkgLabel} Package (₹${baseFare})`;
  }
  // 2. Specific Predefined Route Fixed Tariff (One Way / Airport / Round Trip)
  else if (
    routeDetails.pricingType === 'fixed' &&
    routeDetails.fixedPrices &&
    Number(routeDetails.fixedPrices[vehicle.id]) > 0
  ) {
    const oneWayFixedFare = Number(routeDetails.fixedPrices[vehicle.id]);
    if (isRoundTrip) {
      pricingType = 'round_trip';
      const effectiveDist = actualDistance * 2;
      const plainRate = Number(vehicle.roundTripRate) || Number(vehicle.plainRatePerKm) || 12;
      const hillRate = Number(vehicle.roundTripHillRate) || (Number(vehicle.hillRatePerKm) ? Number(vehicle.hillRatePerKm) - 1 : plainRate + 2);
      ratePerKm = (routeType === 'HILL' || routeType === 'MIXED') ? hillRate : plainRate;
      billableKm = Math.max(effectiveDist, 250);
      baseFare = Math.round(billableKm * ratePerKm);
      pricingRuleApplied = `Round-Trip Tariff (₹${ratePerKm}/km • ${billableKm} KM Return Distance)`;
    } else {
      pricingType = 'fixed_route';
      baseFare = oneWayFixedFare;
      billableKm = actualDistance;
      ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
      pricingRuleApplied = `Fixed Route Tariff (${routeDetails.route?.pickup || pickup} → ${routeDetails.route?.destination || destination})`;
    }
  }
  else {
    // Strictly ONLY predefined fixed routes are priced. No arbitrary auto per-km calculations.
    throw new Error(`Fixed rate is not predefined for "${pickup}" → "${destination}". Please inquire via WhatsApp.`);
  }

  // Night Charges
  let nightCharges = 0;
  if (isNightHour(pickupTime, pricingSettings.nightChargeStartHour ?? 23, pricingSettings.nightChargeEndHour ?? 5)) {
    nightCharges = pricingSettings.nightChargesAmount ?? 250;
  }

  const additionalCharges = {
    driverAllowance,
    driverAllowancePolicy: 'Included in Total',
    nightCharges,
    toll: pricingSettings.toll ?? 'actual',
    parking: pricingSettings.parking ?? 'actual',
    stateTax: pricingSettings.stateTax ?? 'actual',
    permit: pricingSettings.permit ?? 'actual'
  };

  const estimatedTotal = baseFare + driverAllowance + nightCharges;

  const inclusions = [];
  if (driverAllowance > 0) inclusions.push(`Driver Allowance (₹${driverAllowance})`);
  if (nightCharges > 0) inclusions.push(`Night Surcharge (₹${nightCharges})`);
  inclusions.push('Highway Fuel Included');
  inclusions.push('Toll & Parking Payable at Actuals');

  const pricingSnapshot = {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleCategory: vehicle.category,
    pricingMode: vehicle.pricingMode || 'hybrid',
    pricingType,
    routeType,
    pricingRuleApplied,
    distanceKm: actualDistance,
    minBookingKm,
    minimumKm: outstationMinKm,
    billableKm,
    ratePerKm,
    extraKmRate,
    baseFare,
    driverAllowance,
    nightCharges,
    appliedSlab,
    longDistanceConfig: vehicle.longDistance,
    tollPolicy: additionalCharges.toll,
    parkingPolicy: additionalCharges.parking,
    stateTaxPolicy: additionalCharges.stateTax,
    estimatedTotal,
    calculatedAt: new Date().toISOString()
  };

  return {
    vehicle: vehicle.name,
    vehicleId: vehicle.id,
    category: vehicle.category,
    pricingMode: vehicle.pricingMode || 'hybrid',
    seats: vehicle.seats,
    image: vehicle.image,
    pickup,
    destination,
    tripType,
    routeType,
    pricingType,
    pricingRuleApplied,
    distanceKm: actualDistance,
    minBookingKm,
    minimumKm: outstationMinKm,
    billableKm,
    ratePerKm,
    extraKmRate,
    baseFare,
    driverAllowance,
    nightCharges,
    additionalCharges,
    estimatedTotal,
    inclusions,
    appliedSlab,
    pricingSnapshot
  };
};

export const calculateAllFares = (params) => {
  const fleet = readJson('fleet') || [];
  const activeFleet = fleet.filter((v) => v.active !== false);

  const results = [];
  const errors = [];

  for (const vehicle of activeFleet) {
    try {
      const fare = calculateFare({ ...params, vehicleId: vehicle.id });
      if (fare && fare.baseFare > 0) {
        results.push(fare);
      }
    } catch (err) {
      errors.push({ vehicleId: vehicle.id, error: err.message });
    }
  }

  results.sort((a, b) => a.estimatedTotal - b.estimatedTotal);

  return {
    results,
    count: results.length,
    isPredefinedRoute: results.length > 0,
    message: results.length === 0 ? 'Fixed rate is not predefined for this route. Please inquire via WhatsApp.' : undefined,
    errors
  };
};
