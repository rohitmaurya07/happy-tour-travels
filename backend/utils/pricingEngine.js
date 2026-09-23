import { readJson } from './storage.js';

const ROAD_FACTOR = 1.28;

export const KNOWN_DISTANCES = {
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

const toRad = (deg) => (deg * Math.PI) / 180;

export const normalizeLocation = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[(),.\-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
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

export const calculateDistance = (from, to, fromCoords = null, toCoords = null) => {
  if (!from || !to) return 50;

  const cleanFrom = normalizeLocation(from);
  const cleanTo = normalizeLocation(to);

  // 1. Direct exact pair lookup
  const key1 = `${cleanFrom}|${cleanTo}`;
  const key2 = `${cleanTo}|${cleanFrom}`;
  if (KNOWN_DISTANCES[key1]) return KNOWN_DISTANCES[key1];
  if (KNOWN_DISTANCES[key2]) return KNOWN_DISTANCES[key2];

  // 2. High-precision coordinate-based calculation using popularLocations
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

    const roadDist = Math.round(straightDist * ROAD_FACTOR);
    return Math.max(roadDist, 5);
  }

  // 3. Substring matching in known distances as fallback
  for (const [k, dist] of Object.entries(KNOWN_DISTANCES)) {
    const [kFrom, kTo] = k.split('|');
    if (
      (cleanFrom === kFrom || cleanFrom.startsWith(kFrom + ' ') || cleanFrom.endsWith(' ' + kFrom)) &&
      (cleanTo === kTo || cleanTo.startsWith(kTo + ' ') || cleanTo.endsWith(' ' + kTo))
    ) {
      return dist;
    }
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

const HILL_KEYWORDS = [
  'shimla', 'manali', 'dharamshala', 'dalhousie', 'kullu', 'kasol', 'kasauli',
  'solan', 'mandi', 'palampur', 'chail', 'mussoorie', 'rishikesh', 'dehradun',
  'nainital', 'kufri', 'mcleod ganj', 'khajjiar', 'tosh', 'rohtang', 'atal tunnel',
  'spiti', 'kinnaur', 'leh', 'lahaul', 'jibhi', 'tirthan', 'haridwar'
];

export const resolveRouteDetails = (pickup, destination) => {
  const cleanFrom = normalizeLocation(pickup);
  const cleanTo = normalizeLocation(destination);

  const routes = readJson('pricingRoutes') || [];
  const locations = readJson('popularLocations') || [];

  const matchedRoute = routes.find((r) => {
    if (r.active === false) return false;
    const rFrom = normalizeLocation(r.pickup);
    const rTo = normalizeLocation(r.destination);
    return (
      (rFrom === cleanFrom && rTo === cleanTo) ||
      (rFrom === cleanTo && rTo === cleanFrom) ||
      (cleanFrom.includes(rFrom) && cleanTo.includes(rTo))
    );
  });

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

  let actualDistance = Number(distanceKm) > 0 ? Number(distanceKm) : (routeDetails.customDistance || calculateDistance(pickup, destination, fromCoords, toCoords));
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
    pricingType = 'hourly_package';
    const pkg = hourlyPackage === '4h'
      ? (vehicle.packages?.fourHours || { price: vehicle.localPackages?.fourHours || 1000, includedKm: 40 })
      : (vehicle.packages?.eightHours || { price: vehicle.localPackages?.eightHours || vehicle.hourlyRate || 1500, includedKm: 80 });

    const pkgPrice = Number(pkg.price) || 0;
    const includedKm = Number(pkg.includedKm) || (hourlyPackage === '4h' ? 40 : 80);
    const extraKm = Math.max(0, actualDistance - includedKm);
    const extraCharges = extraKm * extraKmRate;

    baseFare = pkgPrice + extraCharges;
    billableKm = includedKm + extraKm;
    ratePerKm = extraKmRate;
    pricingRuleApplied = `${hourlyPackage === '4h' ? '4 Hours / ' + includedKm + ' KM' : '8 Hours / ' + includedKm + ' KM'} Package (₹${pkgPrice}${extraKm > 0 ? ` + ₹${extraCharges} for ${extraKm} extra km` : ''})`;
  }
  // 2. Specific Route Fixed Tariff (Priority 1)
  else if (
    routeDetails.pricingType === 'fixed' &&
    routeDetails.fixedPrices &&
    Number(routeDetails.fixedPrices[vehicle.id]) > 0
  ) {
    pricingType = 'fixed_route';
    baseFare = Number(routeDetails.fixedPrices[vehicle.id]);
    billableKm = actualDistance;
    ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
    pricingRuleApplied = `Fixed Route Tariff (${routeDetails.route?.pickup || pickup} → ${routeDetails.route?.destination || destination})`;
  }
  // 3. Short Local Airport Drop / Transfer (Priority 2 - Local Only <= 35 KM)
  else if (
    (isAirport || normalizeLocation(destination).includes('airport') || normalizeLocation(pickup).includes('airport')) &&
    actualDistance <= 35 &&
    vehicle.airportBasePrice &&
    Number(vehicle.airportBasePrice) > 0
  ) {
    pricingType = 'fixed_airport';
    baseFare = Number(vehicle.airportBasePrice);
    billableKm = actualDistance;
    ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
    pricingRuleApplied = `Local Airport Drop Tariff (₹${vehicle.airportBasePrice})`;
  }

  // 4. Standard Distance / Long Distance / Hill / Round Trip / Local Slab Calculation
  if (baseFare === 0) {
    const pricingMode = vehicle.pricingMode || 'hybrid'; // 'hybrid' | 'per_km' | 'slabs_only'

    if (isRoundTrip) {
      const effectiveDist = actualDistance * 2;
      const effectiveMinKm = outstationMinKm * 2;
      billableKm = Math.max(effectiveDist, effectiveMinKm);
      ratePerKm = Number(vehicle.roundTripRate) || (routeType === 'HILL' ? Number(vehicle.hillRatePerKm) : Number(vehicle.plainRatePerKm)) || 11.7;
      baseFare = Math.round(billableKm * ratePerKm);
      pricingType = 'round_trip';
      pricingRuleApplied = `Round-Trip Tariff (₹${ratePerKm}/km, ${billableKm} billable km)`;
    } else if (routeType === 'HILL' || routeType === 'MIXED') {
      billableKm = Math.max(actualDistance, outstationMinKm);
      ratePerKm = Number(vehicle.hillRatePerKm) || (Number(vehicle.plainRatePerKm) ? Number(vehicle.plainRatePerKm) + 2.5 : 15.5);
      baseFare = Math.round(billableKm * ratePerKm);
      pricingType = 'per_km';
      pricingRuleApplied = `Hill Terrain Rate (₹${ratePerKm}/km, ${billableKm} billable km)`;
    } else if (pricingMode === 'per_km') {
      // Pure Per-KM Pricing Mode
      billableKm = Math.max(actualDistance, minBookingKm);
      ratePerKm = Number(vehicle.oneWayRate) || Number(vehicle.plainRatePerKm) || 13;
      baseFare = Math.round(billableKm * ratePerKm);
      pricingType = 'per_km';
      pricingRuleApplied = `Per-KM Rate (₹${ratePerKm}/km, ${billableKm} billable km)`;
    } else {
      // Hybrid or Slabs-Only Mode
      const longDistance = vehicle.longDistance || {
        startAfterKm: 95,
        baseFare: 1700,
        additionalKmRate: Number(vehicle.oneWayRate) || Number(vehicle.plainRatePerKm) || 12
      };

      const startAfterKm = Number(longDistance.startAfterKm) || 95;
      const ldBaseFare = Number(longDistance.baseFare) || 1700;
      const ldAdditionalKmRate = Number(longDistance.additionalKmRate) || (Number(vehicle.oneWayRate) || Number(vehicle.plainRatePerKm) || 12);

      if (pricingMode !== 'slabs_only' && actualDistance > startAfterKm) {
        // Long distance threshold formula: baseFare + (actualDistance - startAfterKm) * additionalKmRate
        const extraKm = actualDistance - startAfterKm;
        baseFare = Math.round(ldBaseFare + (extraKm * ldAdditionalKmRate));
        billableKm = actualDistance;
        ratePerKm = ldAdditionalKmRate;
        pricingType = 'long_distance';
        pricingRuleApplied = `Long Distance: Base ₹${ldBaseFare} (first ${startAfterKm} km) + ₹${ldAdditionalKmRate}/km for extra ${extraKm} km`;
      } else {
        // Local Slab Matching
        const effectiveKm = Math.max(actualDistance, minBookingKm);
        billableKm = effectiveKm;
        const slabs = Array.isArray(vehicle.slabs) ? vehicle.slabs : [];

        // Find slab matching effectiveKm
        const matchedSlab = slabs.find((s) => {
          const min = Number(s.minKm);
          const max = Number(s.maxKm);
          return effectiveKm >= min && effectiveKm <= max;
        });

        if (matchedSlab && Number(matchedSlab.price) > 0) {
          baseFare = Number(matchedSlab.price);
          appliedSlab = `${matchedSlab.minKm}–${matchedSlab.maxKm} KM`;
          ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
          pricingType = 'local_slab';
          pricingRuleApplied = `Local Slab (${appliedSlab}: ₹${baseFare})`;
        } else if (slabs.length > 0) {
          const sortedSlabs = [...slabs].sort((a, b) => Number(a.minKm) - Number(b.minKm));
          if (effectiveKm < Number(sortedSlabs[0].minKm)) {
            const firstSlab = sortedSlabs[0];
            baseFare = Number(firstSlab.price);
            appliedSlab = `${firstSlab.minKm}–${firstSlab.maxKm} KM (Min Booking)`;
            ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
            pricingType = 'local_slab';
            pricingRuleApplied = `Minimum Local Booking Slab (${firstSlab.minKm}–${firstSlab.maxKm} KM: ₹${baseFare})`;
          } else {
            const lastSlab = sortedSlabs[sortedSlabs.length - 1];
            baseFare = Number(lastSlab.price);
            appliedSlab = `${lastSlab.minKm}–${lastSlab.maxKm} KM`;
            ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
            pricingType = 'local_slab';
            pricingRuleApplied = `Local Slab (${appliedSlab}: ₹${baseFare})`;
          }
        } else {
          // Fallback if no slabs configured: plainRatePerKm * billableKm
          ratePerKm = Number(vehicle.oneWayRate) || Number(vehicle.plainRatePerKm) || 13;
          baseFare = Math.round(billableKm * ratePerKm);
          pricingType = 'per_km';
          pricingRuleApplied = `Standard Plain Rate (₹${ratePerKm}/km)`;
        }
      }
    }
  }

  // 5. Night Charges
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
      results.push(fare);
    } catch (err) {
      errors.push({ vehicleId: vehicle.id, error: err.message });
    }
  }

  results.sort((a, b) => a.estimatedTotal - b.estimatedTotal);

  return {
    results,
    count: results.length,
    errors
  };
};
