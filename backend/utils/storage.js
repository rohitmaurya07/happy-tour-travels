import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const getFilePath = (fileName) => path.join(DATA_DIR, fileName.endsWith('.json') ? fileName : `${fileName}.json`);

export const readJson = (fileName, defaultValue = null) => {
  try {
    const filePath = getFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      if (defaultValue !== null) {
        writeJson(fileName, defaultValue);
        return defaultValue;
      }
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultValue;
  }
};

export const writeJson = (fileName, data) => {
  try {
    const filePath = getFilePath(fileName);
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    return false;
  }
};

export const initDb = async () => {
  // 1. Admin User
  const adminUser = readJson('adminUser');
  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('HappyTravels@2026!', salt);
    writeJson('adminUser', {
      username: 'admin',
      passwordHash: hashedPassword,
      name: 'Happy Tour & Travels Admin',
      updatedAt: new Date().toISOString()
    });
    console.log('[OK] Admin user initialized: username=admin');
  }

  // 2. Site Config
  if (!readJson('siteConfig')) {
    writeJson('siteConfig', {
      businessName: 'Happy Tour & Travels',
      slogan: 'Travel Comfortably. Arrive Confidently.',
      subtitle: 'Reliable taxi services, airport transfers, outstation rides, and tour packages from Jalandhar to destinations across Punjab, Himachal, Delhi and beyond.',
      whatsappNumber: '917837175090',
      whatsappNumberFormatted: '+91 78371 75090',
      phoneNumberFormatted: '+91 78371 75090',
      phoneNumber: '+91 78371 75090',
      email: 'info@happytourandtravels.com',
      address: 'Phagwara Road, Jalandhar Cantt, Jalandhar, Punjab 144005, India',
      primaryCity: 'Jalandhar',
      primaryState: 'Punjab',
      serviceAreas: ['Jalandhar', 'Punjab', 'Himachal Pradesh', 'Delhi NCR', 'Chandigarh', 'Amritsar', 'Ludhiana'],
      workingHours: '24/7 Available (365 Days)',
      googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108990.22223789498!2d75.50080644335938!3d31.326014999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5a5747a9eb91%3A0xc7e0842e4758d4a6!2sJalandhar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      updatedAt: new Date().toISOString()
    });
  }

  // 3. Pricing & Charges Settings
  const currentPricing = readJson('pricingSettings');
  if (!currentPricing || currentPricing.driverAllowance === undefined) {
    writeJson('pricingSettings', {
      toll: 'actual',
      parking: 'actual',
      stateTax: 'actual',
      permit: 'actual',
      driverAllowance: 300,
      tollIncluded: false,
      stateTaxIncluded: false,
      driverAllowanceIncluded: true,
      fuelIncluded: true,
      nightChargesAmount: 250,
      nightChargeStartHour: 23,
      nightChargeEndHour: 5,
      gstPercent: 0,
      gstIncluded: true,
      termsAndConditions: 'Base fare includes Highway Fuel and Chauffeur services. Toll taxes, Parking charges, State border taxes & Permits are payable as per actual receipts.',
      airportOverrides: [
        {
          id: 'delhi-airport',
          name: 'Delhi Airport (DEL)',
          routeKeyword: 'Delhi Airport',
          rates: { dzire: 5180, verna: 5580, ertiga: 6000, innova: 7500, fortuner: 10500, tempo: 9500 }
        },
        {
          id: 'amritsar-airport',
          name: 'Amritsar Airport (ATQ)',
          routeKeyword: 'Amritsar Airport',
          rates: { dzire: 1900, verna: 2300, ertiga: 2400, innova: 3500, fortuner: 5500, tempo: 5000 }
        },
        {
          id: 'chandigarh-airport',
          name: 'Chandigarh Airport (IXC)',
          routeKeyword: 'Chandigarh Airport',
          rates: { dzire: 2500, verna: 2900, ertiga: 3000, innova: 4500, fortuner: 7000, tempo: 6000 }
        }
      ],
      updatedAt: new Date().toISOString()
    });
  }

  // 4. Media Settings
  if (!readJson('mediaSettings')) {
    writeJson('mediaSettings', {
      heroVideoUrl: '/assets/herovideo.mp4',
      heroTitle: 'Safe, Reliable and Comfortable Taxi Services.',
      heroHighlightedWord: 'Taxi Services.',
      heroSubtitle: 'Across North India, wherever your journey takes you.',
      trustBadgeText: 'Best Taxi Service in North India',
      logoUrl: '/assets/images/logo.jpg',
      updatedAt: new Date().toISOString()
    });
  }

  // 5. Fleet Data with Plain/Hill Rates, Minimum KM, Driver Allowance & Active status
  // 5. Fleet Data with Full Configurable Pricing (Slabs, Long Distance, Hourly Packages, Airport, Terrain Rates)
  let fleet = readJson('fleet');
  const normalizeFleet = (list) => {
    const defaultPricing = [
      {
        id: 'dzire',
        name: 'Maruti Suzuki Dzire',
        category: 'Budget Sedan',
        seats: '4 Passengers',
        luggage: '2-3 Bags',
        ac: 'Dual AC',
        fuel: 'Petrol/CNG',
        image: '/assets/images/dzire.jpg',
        altText: 'Maruti Suzuki Dzire budget sedan taxi service in North India',
        tag: 'Budget Sedan',
        rank: 5,
        description: 'Comfortable and economic 4-seater sedan ideal for city commutes, airport transfers, and one-way outstation trips.',
        ratesHint: '₹12/km Plain • ₹14/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 900 },
          { minKm: 35, maxKm: 55, price: 1100 },
          { minKm: 55, maxKm: 75, price: 1300 },
          { minKm: 75, maxKm: 95, price: 1500 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 1700,
          additionalKmRate: 12
        },
        oneWayRate: 12,
        roundTripRate: 11,
        packages: {
          fourHours: { price: 1000, includedKm: 40 },
          eightHours: { price: 1500, includedKm: 80 }
        },
        airportBasePrice: 2499,
        plainRatePerKm: 10,
        hillRatePerKm: 11,
        minimumKm: 250,
        extraKmRate: 11,
        driverAllowance: 300,
        active: true
      },
      {
        id: 'verna',
        name: 'Hyundai Verna',
        category: 'Comfortable Sedan',
        seats: '4 Passengers',
        luggage: '3 Bags',
        ac: 'Automatic Climate Control',
        fuel: 'Petrol/Diesel',
        image: '/assets/images/verna.png',
        altText: 'Hyundai Verna comfortable executive taxi in North India',
        tag: 'Comfortable Sedan',
        rank: 4,
        description: 'Stylish 4-seater executive sedan offering plush interiors, smooth highway suspension, and superior comfort for business & VIP travel.',
        ratesHint: '₹14/km Plain • ₹16/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 1300 },
          { minKm: 35, maxKm: 55, price: 1500 },
          { minKm: 55, maxKm: 75, price: 1700 },
          { minKm: 75, maxKm: 95, price: 1900 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 2100,
          additionalKmRate: 14
        },
        oneWayRate: 14,
        roundTripRate: 13,
        packages: {
          fourHours: { price: 1200, includedKm: 40 },
          eightHours: { price: 2000, includedKm: 80 }
        },
        airportBasePrice: 2999,
        plainRatePerKm: 12,
        hillRatePerKm: 14,
        minimumKm: 250,
        extraKmRate: 13,
        driverAllowance: 300,
        active: true
      },
      {
        id: 'ertiga',
        name: 'Maruti Suzuki Ertiga',
        category: 'Family Car',
        seats: '6–7 Seater',
        luggage: '3-4 Bags',
        ac: 'Front & Rear AC Vents',
        fuel: 'Petrol/CNG',
        image: '/assets/images/ertiga.png',
        altText: 'Maruti Ertiga 6-7 seater family taxi service in North India',
        tag: 'Family Choice',
        rank: 3,
        description: 'Spacious 6–7 seater family car perfectly suited for family trips, outstation tours to Himachal Pradesh, and airport group travel.',
        ratesHint: '₹16/km Plain • ₹18/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 1400 },
          { minKm: 35, maxKm: 55, price: 1600 },
          { minKm: 55, maxKm: 75, price: 1800 },
          { minKm: 75, maxKm: 95, price: 2000 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 2200,
          additionalKmRate: 16
        },
        oneWayRate: 16,
        roundTripRate: 15,
        packages: {
          fourHours: { price: 1500, includedKm: 40 },
          eightHours: { price: 2300, includedKm: 80 }
        },
        airportBasePrice: 3499,
        plainRatePerKm: 14,
        hillRatePerKm: 16,
        minimumKm: 250,
        extraKmRate: 15,
        driverAllowance: 300,
        active: true
      },
      {
        id: 'innova',
        name: 'Toyota Innova Crysta',
        category: 'Premium Family Car',
        seats: '7–8 Seater',
        luggage: '4-5 Bags',
        ac: 'Triple Zone AC',
        fuel: 'Diesel',
        image: '/assets/images/innova.png',
        altText: 'Toyota Innova Crysta 7-8 seater premium cab across North India',
        tag: 'Premium Family',
        rank: 2,
        description: 'The gold standard for highway comfort and mountain tours. 7–8 seater with unmatched legroom, plush captain seats, and exceptional ride stability.',
        ratesHint: '₹20/km Plain • ₹22/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 1800 },
          { minKm: 35, maxKm: 55, price: 2200 },
          { minKm: 55, maxKm: 75, price: 2600 },
          { minKm: 75, maxKm: 95, price: 3000 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 3300,
          additionalKmRate: 20
        },
        oneWayRate: 20,
        roundTripRate: 19,
        packages: {
          fourHours: { price: 1800, includedKm: 40 },
          eightHours: { price: 3000, includedKm: 80 }
        },
        airportBasePrice: 4999,
        plainRatePerKm: 18,
        hillRatePerKm: 20,
        minimumKm: 250,
        extraKmRate: 19,
        driverAllowance: 400,
        active: true
      },
      {
        id: 'fortuner',
        name: 'Toyota Fortuner Automatic',
        category: 'Premium SUV',
        seats: '6–7 Seater',
        luggage: '4-5 Bags',
        ac: 'Dual Zone Automatic AC',
        fuel: 'Diesel Automatic',
        image: '/assets/images/fortuner.png',
        altText: 'Toyota Fortuner Automatic premium luxury SUV taxi in North India',
        tag: 'Premium SUV',
        rank: 1,
        description: 'Commanding 6–7 seater premium SUV with automatic transmission. Luxurious interiors, supreme road presence, and ultimate highway capability.',
        ratesHint: '₹30/km Plain • ₹32/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 2400 },
          { minKm: 35, maxKm: 55, price: 3000 },
          { minKm: 55, maxKm: 75, price: 3600 },
          { minKm: 75, maxKm: 95, price: 4200 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 4600,
          additionalKmRate: 30
        },
        oneWayRate: 30,
        roundTripRate: 28,
        packages: {
          fourHours: { price: 2000, includedKm: 40 },
          eightHours: { price: 5000, includedKm: 80 }
        },
        airportBasePrice: 6499,
        plainRatePerKm: 26,
        hillRatePerKm: 30,
        minimumKm: 250,
        extraKmRate: 28,
        driverAllowance: 500,
        active: true
      },
      {
        id: 'tempo',
        name: 'Force Tempo Traveller',
        category: 'Luxury Minibus',
        seats: '12 / 16 / 20 Seats',
        luggage: 'Ample Luggage Storage',
        ac: 'Roof Mounted Heavy AC',
        fuel: 'Diesel',
        image: '/assets/images/tempo.png',
        altText: 'Tempo Traveller on rent in North India for group tour packages',
        tag: 'Group Special',
        rank: 6,
        description: 'Spacious vehicle with pushback seats, individual charging points, and music system. Designed for large family reunions & wedding groups.',
        ratesHint: '₹28/km Plain • ₹30/km Hill • Min 20 KM',
        minBookingKm: 20,
        slabs: [
          { minKm: 20, maxKm: 35, price: 2800 },
          { minKm: 35, maxKm: 55, price: 3500 },
          { minKm: 55, maxKm: 75, price: 4200 },
          { minKm: 75, maxKm: 95, price: 4900 }
        ],
        longDistance: {
          startAfterKm: 95,
          baseFare: 5500,
          additionalKmRate: 28
        },
        oneWayRate: 28,
        roundTripRate: 26,
        packages: {
          fourHours: { price: 3500, includedKm: 40 },
          eightHours: { price: 5500, includedKm: 80 }
        },
        airportBasePrice: 6999,
        plainRatePerKm: 24,
        hillRatePerKm: 28,
        minimumKm: 250,
        extraKmRate: 25,
        driverAllowance: 500,
        active: true
      }
    ];

    if (!list || list.length === 0) return defaultPricing;

    return list.map(item => {
      const def = defaultPricing.find(d => d.id === item.id) || {};
      const slabs = Array.isArray(item.slabs) ? item.slabs : (def.slabs || []);
      const longDistance = item.longDistance || def.longDistance || {
        startAfterKm: 95,
        baseFare: item.plainRatePerKm ? item.plainRatePerKm * 95 : 1700,
        additionalKmRate: item.oneWayRate || item.plainRatePerKm || 12
      };
      const packages = item.packages || {
        fourHours: {
          price: item.localPackages?.fourHours || def.packages?.fourHours?.price || 1000,
          includedKm: 40
        },
        eightHours: {
          price: item.localPackages?.eightHours || item.hourlyRate || def.packages?.eightHours?.price || 1500,
          includedKm: 80
        }
      };

      return {
        ...def,
        ...item,
        minBookingKm: item.minBookingKm !== undefined ? Number(item.minBookingKm) : (def.minBookingKm || 20),
        slabs,
        longDistance: {
          startAfterKm: Number(longDistance.startAfterKm) || 95,
          baseFare: Number(longDistance.baseFare) || 1700,
          additionalKmRate: Number(longDistance.additionalKmRate) || (item.plainRatePerKm || 12)
        },
        oneWayRate: item.oneWayRate !== undefined ? Number(item.oneWayRate) : (def.oneWayRate || 12),
        roundTripRate: item.roundTripRate !== undefined ? Number(item.roundTripRate) : (def.roundTripRate || 11),
        packages,
        airportBasePrice: item.airportBasePrice !== undefined ? Number(item.airportBasePrice) : (item.airportFixedRate || def.airportBasePrice || 2499),
        plainRatePerKm: item.plainRatePerKm !== undefined ? Number(item.plainRatePerKm) : (def.plainRatePerKm || 10),
        hillRatePerKm: item.hillRatePerKm !== undefined ? Number(item.hillRatePerKm) : (def.hillRatePerKm || 11),
        minimumKm: item.minimumKm !== undefined ? Number(item.minimumKm) : (def.minimumKm || 250),
        extraKmRate: item.extraKmRate !== undefined ? Number(item.extraKmRate) : (def.extraKmRate || 11),
        driverAllowance: item.driverAllowance !== undefined ? Number(item.driverAllowance) : (def.driverAllowance || 300),
        active: item.active !== undefined ? Boolean(item.active) : true
      };
    });
  };

  const normalizedFleet = normalizeFleet(fleet);
  if (!fleet || fleet.length === 0 || JSON.stringify(fleet) !== JSON.stringify(normalizedFleet)) {
    writeJson('fleet', normalizedFleet);
  }

  // 6. Pricing Routes Data (Specific Routes, Fixed/Per-Km & Plain/Hill Classifications)
  if (!readJson('pricingRoutes')) {
    writeJson('pricingRoutes', [
      {
        id: 'jalandhar-delhi-airport',
        pickup: 'Jalandhar',
        destination: 'Delhi Airport',
        routeType: 'PLAIN',
        pricingType: 'fixed',
        vehiclePrices: {
          dzire: 3500,
          verna: 4000,
          ertiga: 4500,
          innova: 5500,
          fortuner: 8500,
          tempo: 7500
        },
        distanceKm: 385,
        active: true
      },
      {
        id: 'jalandhar-chandigarh',
        pickup: 'Jalandhar',
        destination: 'Chandigarh',
        routeType: 'PLAIN',
        pricingType: 'fixed',
        vehiclePrices: {
          dzire: 2200,
          verna: 2600,
          ertiga: 2800,
          innova: 3800,
          fortuner: 5800,
          tempo: 5200
        },
        distanceKm: 148,
        active: true
      },
      {
        id: 'jalandhar-shimla',
        pickup: 'Jalandhar',
        destination: 'Shimla',
        routeType: 'HILL',
        pricingType: 'per_km',
        vehiclePrices: {
          dzire: 0,
          verna: 0,
          ertiga: 0,
          innova: 0,
          fortuner: 0,
          tempo: 0
        },
        distanceKm: 220,
        active: true
      },
      {
        id: 'jalandhar-manali',
        pickup: 'Jalandhar',
        destination: 'Manali',
        routeType: 'HILL',
        pricingType: 'per_km',
        vehiclePrices: {
          dzire: 0,
          verna: 0,
          ertiga: 0,
          innova: 0,
          fortuner: 0,
          tempo: 0
        },
        distanceKm: 315,
        active: true
      },
      {
        id: 'jalandhar-dharamshala',
        pickup: 'Jalandhar',
        destination: 'Dharamshala',
        routeType: 'HILL',
        pricingType: 'per_km',
        vehiclePrices: {
          dzire: 0,
          verna: 0,
          ertiga: 0,
          innova: 0,
          fortuner: 0,
          tempo: 0
        },
        distanceKm: 165,
        active: true
      },
      {
        id: 'amritsar-delhi-airport',
        pickup: 'Amritsar',
        destination: 'Delhi Airport',
        routeType: 'PLAIN',
        pricingType: 'fixed',
        vehiclePrices: {
          dzire: 4800,
          verna: 5300,
          ertiga: 5800,
          innova: 7200,
          fortuner: 11000,
          tempo: 9800
        },
        distanceKm: 460,
        active: true
      }
    ]);
  }

  // 7. Popular Locations with regionType classification
  let locations = readJson('popularLocations');
  if (locations && !locations[0]?.regionType) {
    const enrichedLocations = locations.map(loc => {
      let regionType = 'PLAIN';
      const name = (loc.name || '').toLowerCase();
      const state = (loc.state || '').toLowerCase();
      const type = (loc.type || '').toLowerCase();

      if (
        state.includes('himachal') ||
        state.includes('uttarakhand') ||
        type.includes('hill') ||
        name.includes('shimla') ||
        name.includes('manali') ||
        name.includes('dharamshala') ||
        name.includes('dalhousie') ||
        name.includes('kullu') ||
        name.includes('kasol') ||
        name.includes('kasauli') ||
        name.includes('solan') ||
        name.includes('mussoorie') ||
        name.includes('rishikesh') ||
        name.includes('nainital')
      ) {
        regionType = 'HILL';
      } else if (name.includes('katra') || name.includes('jammu')) {
        regionType = 'MIXED';
      }

      return {
        ...loc,
        regionType
      };
    });
    writeJson('popularLocations', enrichedLocations);
  }

  // 8. Bookings collection
  if (!readJson('bookings')) {
    writeJson('bookings', []);
  }
};
