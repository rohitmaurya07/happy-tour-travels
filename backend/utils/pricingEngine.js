import { readJson } from './storage.js';

const ROAD_FACTOR = 1.28;

const KNOWN_DISTANCES = {
  "jalandhar|amritsar": 82,
  "jalandhar|amritsar airport": 95,
  "jalandhar|sri guru ram dass jee airport (atq)": 95,
  "jalandhar|chandigarh": 148,
  "jalandhar|chandigarh airport": 155,
  "jalandhar|shaheed bhagat singh airport (ixc)": 155,
  "jalandhar|delhi": 375,
  "jalandhar|delhi airport": 385,
  "jalandhar|indira gandhi international airport (del)": 385,
  "jalandhar|gurgaon": 395,
  "jalandhar|gurgaon / gurugram": 395,
  "jalandhar|noida": 410,
  "jalandhar|ludhiana": 61,
  "jalandhar|phagwara": 22,
  "jalandhar|hoshiarpur": 42,
  "jalandhar|pathankot": 112,
  "jalandhar|patiala": 152,
  "jalandhar|bathinda": 165,
  "jalandhar|moga": 70,
  "jalandhar|kapurthala": 22,
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
  "jalandhar|haridwar": 330,
  "jalandhar|rishikesh": 350,
  "jalandhar|dehradun": 310,
  "jalandhar|mussoorie": 340,
  "jalandhar|jaipur": 620,

  "amritsar|delhi": 450,
  "amritsar|delhi airport": 460,
  "amritsar|chandigarh": 230,
  "amritsar|jalandhar": 82,
  "amritsar|ludhiana": 142,
  "amritsar|shimla": 300,
  "amritsar|manali": 395,
  "amritsar|dharamshala": 200,
  "amritsar|dalhousie": 190,
  "amritsar|katra": 260,

  "ludhiana|delhi": 315,
  "ludhiana|delhi airport": 325,
  "ludhiana|chandigarh": 105,
  "ludhiana|amritsar": 142,
  "ludhiana|jalandhar": 61,
  "ludhiana|shimla": 225,
  "ludhiana|manali": 335,
  "ludhiana|dharamshala": 215,

  "chandigarh|shimla": 110,
  "chandigarh|manali": 270,
  "chandigarh|kullu": 230,
  "chandigarh|dharamshala": 240,
  "chandigarh|dalhousie": 310,
  "chandigarh|kasauli": 55,
  "chandigarh|delhi": 250,
  "chandigarh|delhi airport": 260,
  "chandigarh|jalandhar": 148,
  "chandigarh|ludhiana": 105,
  "chandigarh|amritsar": 230
};

const toRad = (deg) => (deg * Math.PI) / 180;

export const normalizeLocation = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.split(',')[0].trim().toLowerCase();
};

export const calculateDistance = (from, to, fromCoords = null, toCoords = null) => {
  if (!from || !to) return 50;

  const cleanFrom = normalizeLocation(from);
  const cleanTo = normalizeLocation(to);

  const key1 = `${cleanFrom}|${cleanTo}`;
  const key2 = `${cleanTo}|${cleanFrom}`;
  if (KNOWN_DISTANCES[key1]) return KNOWN_DISTANCES[key1];
  if (KNOWN_DISTANCES[key2]) return KNOWN_DISTANCES[key2];

  for (const [k, dist] of Object.entries(KNOWN_DISTANCES)) {
    const [kFrom, kTo] = k.split('|');
    if (
      (cleanFrom.includes(kFrom) || kFrom.includes(cleanFrom)) &&
      (cleanTo.includes(kTo) || kTo.includes(cleanTo))
    ) {
      return dist;
    }
  }

  const locations = readJson('popularLocations') || [];
  const findCoords = (name) => {
    const clean = normalizeLocation(name);
    const match = locations.find((l) => {
      const locName = (l.name || '').toLowerCase();
      return locName === clean || clean.includes(locName) || locName.includes(clean);
    });
    return match && match.lat && match.lon ? { lat: match.lat, lon: match.lon } : null;
  };

  const c1 = fromCoords || findCoords(cleanFrom);
  const c2 = toCoords || findCoords(cleanTo);

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
    return Math.max(roadDist, 30);
  }

  return 120;
};

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

  if (toRegion === 'HILL' || fromRegion === 'HILL') {
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
  toCoords = null
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

  let actualDistance = routeDetails.customDistance || calculateDistance(pickup, destination, fromCoords, toCoords);
  if (actualDistance <= 0) actualDistance = 50;

  const isHourly = tripType === 'Hourly Rental';
  const isRoundTrip = tripType === 'Round Trip';
  const isAirport = tripType === 'Airport';

  let billableKm = 0;
  let ratePerKm = 0;
  let baseFare = 0;
  let pricingType = 'per_km';
  let pricingRuleApplied = 'Per-KM Vehicle Rate';
  let minimumKm = vehicle.minimumKm !== undefined ? Number(vehicle.minimumKm) : 250;
  let extraKmRate = vehicle.extraKmRate !== undefined ? Number(vehicle.extraKmRate) : (vehicle.plainRatePerKm || 10);
  let driverAllowance = vehicle.driverAllowance !== undefined ? Number(vehicle.driverAllowance) : (pricingSettings.driverAllowance || 300);

  // 1. Hourly Rental Package
  if (isHourly) {
    pricingType = 'hourly_package';
    if (hourlyPackage === '4h') {
      billableKm = 40;
      baseFare = vehicle.localPackages?.fourHours || Math.round(40 * (vehicle.plainRatePerKm || 10));
      pricingRuleApplied = '4 Hours / 40 KM Local Package';
    } else {
      billableKm = 80;
      baseFare = vehicle.localPackages?.eightHours || vehicle.hourlyRate || Math.round(80 * (vehicle.plainRatePerKm || 10));
      pricingRuleApplied = '8 Hours / 80 KM Local Package';
    }
    ratePerKm = vehicle.plainRatePerKm || vehicle.oneWayRate || 10;
  }
  // 2. Specific Route Fixed Price (Priority 1)
  else if (
    routeDetails.pricingType === 'fixed' &&
    routeDetails.fixedPrices &&
    routeDetails.fixedPrices[vehicle.id] > 0
  ) {
    pricingType = 'fixed_route';
    baseFare = Number(routeDetails.fixedPrices[vehicle.id]);
    billableKm = actualDistance;
    ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
    pricingRuleApplied = `Fixed Route Tariff (${routeDetails.route?.pickup || pickup} → ${routeDetails.route?.destination || destination})`;
  }
  // 3. Airport Fixed Override Check (Priority 2)
  else if (isAirport && Array.isArray(pricingSettings.airportOverrides)) {
    const cleanDest = normalizeLocation(destination);
    const cleanOrig = normalizeLocation(pickup);
    const airportOverride = pricingSettings.airportOverrides.find((override) => {
      const kw = normalizeLocation(override.routeKeyword || override.name || '');
      return kw && (cleanDest.includes(kw) || cleanOrig.includes(kw));
    });

    if (airportOverride && airportOverride.rates && airportOverride.rates[vehicle.id] > 0) {
      pricingType = 'fixed_airport';
      baseFare = Number(airportOverride.rates[vehicle.id]);
      billableKm = actualDistance;
      ratePerKm = Math.round((baseFare / billableKm) * 100) / 100;
      pricingRuleApplied = `Airport Override (${airportOverride.name})`;
    }
  }

  // 4. Standard Distance / Per-KM Calculation (Priority 3 & 4)
  if (baseFare === 0) {
    let effectiveDist = actualDistance;
    if (isRoundTrip) {
      effectiveDist = actualDistance * 2;
    }

    if (routeType === 'HILL' || routeType === 'MIXED') {
      ratePerKm = vehicle.hillRatePerKm || vehicle.plainRatePerKm || vehicle.oneWayRate || 11;
      pricingRuleApplied = isRoundTrip ? `Hill Area Round-Trip Rate (₹${ratePerKm}/km)` : `Hill Area Rate (₹${ratePerKm}/km)`;
    } else {
      ratePerKm = vehicle.plainRatePerKm || vehicle.oneWayRate || 10;
      pricingRuleApplied = isRoundTrip ? `Plain Area Round-Trip Rate (₹${ratePerKm}/km)` : `Plain Area Rate (₹${ratePerKm}/km)`;
    }

    // Billable KM = max(actual distance, minimum KM)
    const effectiveMinKm = isRoundTrip ? minimumKm * 2 : minimumKm;
    billableKm = Math.max(effectiveDist, effectiveMinKm);
    baseFare = Math.round(billableKm * ratePerKm);
  }

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
    pricingType,
    routeType,
    pricingRuleApplied,
    distanceKm: actualDistance,
    minimumKm,
    billableKm,
    ratePerKm,
    extraKmRate,
    baseFare,
    driverAllowance,
    nightCharges,
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
    seats: vehicle.seats,
    image: vehicle.image,
    pickup,
    destination,
    tripType,
    routeType,
    pricingType,
    pricingRuleApplied,
    distanceKm: actualDistance,
    minimumKm,
    billableKm,
    ratePerKm,
    extraKmRate,
    baseFare,
    driverAllowance,
    nightCharges,
    additionalCharges,
    estimatedTotal,
    inclusions,
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
    pickup: params.pickup,
    destination: params.destination,
    tripType: params.tripType || 'One Way',
    results,
    errors
  };
};
