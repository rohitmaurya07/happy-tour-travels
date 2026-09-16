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
    console.log('✓ Admin user initialized: username=admin');
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
  let fleet = readJson('fleet');
  if (!fleet || !fleet.some(v => v.plainRatePerKm !== undefined)) {
    const defaultFleet = [
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
        ratesHint: '₹10/km Plain • ₹11/km Hill • Min 250 KM',
        plainRatePerKm: 10,
        hillRatePerKm: 11,
        minimumKm: 250,
        extraKmRate: 11,
        driverAllowance: 300,
        active: true,
        oneWayRate: 10,
        roundTripRate: 10,
        localPackages: {
          fourHours: 1000,
          eightHours: 1500
        },
        hourlyRate: 1500,
        airportFixedRate: 2499,
        slabs: {
          minKm: 20,
          slab20_35: 900,
          slab35_55: 1100,
          slab55_75: 1300,
          slab75_95: 1500,
          slab95Base: 1700,
          post95Rate: 10
        }
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
        ratesHint: '₹12/km Plain • ₹14/km Hill • Min 250 KM',
        plainRatePerKm: 12,
        hillRatePerKm: 14,
        minimumKm: 250,
        extraKmRate: 13,
        driverAllowance: 300,
        active: true,
        oneWayRate: 12,
        roundTripRate: 12,
        localPackages: {
          fourHours: 1200,
          eightHours: 2000
        },
        hourlyRate: 2000,
        airportFixedRate: 2999,
        slabs: {
          minKm: 20,
          slab20_35: 1300,
          slab35_55: 1500,
          slab55_75: 1700,
          slab75_95: 1900,
          slab95Base: 2100,
          post95Rate: 12
        }
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
        tag: '⭐ Family Choice',
        rank: 3,
        badgeEmoji: '⭐',
        description: 'Spacious 6–7 seater family car perfectly suited for family trips, outstation tours to Himachal Pradesh, and airport group travel.',
        ratesHint: '₹14/km Plain • ₹16/km Hill • Min 250 KM',
        plainRatePerKm: 14,
        hillRatePerKm: 16,
        minimumKm: 250,
        extraKmRate: 15,
        driverAllowance: 300,
        active: true,
        oneWayRate: 14,
        roundTripRate: 14,
        localPackages: {
          fourHours: 1500,
          eightHours: 2300
        },
        hourlyRate: 2300,
        airportFixedRate: 3499,
        slabs: {
          minKm: 20,
          slab20_35: 1400,
          slab35_55: 1600,
          slab55_75: 1800,
          slab75_95: 2000,
          slab95Base: 2200,
          post95Rate: 14
        }
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
        tag: '👑 Premium Family',
        rank: 2,
        badgeEmoji: '👑',
        description: 'The gold standard for highway comfort and mountain tours. 7–8 seater with unmatched legroom, plush captain seats, and exceptional ride stability.',
        ratesHint: '₹18/km Plain • ₹20/km Hill • Min 250 KM',
        plainRatePerKm: 18,
        hillRatePerKm: 20,
        minimumKm: 250,
        extraKmRate: 19,
        driverAllowance: 400,
        active: true,
        oneWayRate: 18,
        roundTripRate: 17.5,
        localPackages: {
          fourHours: 1800,
          eightHours: 3000
        },
        hourlyRate: 3000,
        airportFixedRate: 4999,
        slabs: {
          minKm: 20,
          slab20_35: 1800,
          slab35_55: 2200,
          slab55_75: 2600,
          slab75_95: 3000,
          slab95Base: 3300,
          post95Rate: 18
        }
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
        tag: '🔥 Premium SUV',
        rank: 1,
        badgeEmoji: '🔥',
        description: 'Commanding 6–7 seater premium SUV with automatic transmission. Luxurious interiors, supreme road presence, and ultimate highway capability.',
        ratesHint: '₹26/km Plain • ₹30/km Hill • Min 250 KM',
        plainRatePerKm: 26,
        hillRatePerKm: 30,
        minimumKm: 250,
        extraKmRate: 28,
        driverAllowance: 500,
        active: true,
        oneWayRate: 26,
        roundTripRate: 25,
        localPackages: {
          fourHours: 2000,
          eightHours: 5000
        },
        hourlyRate: 5000,
        airportFixedRate: 6499,
        slabs: {
          minKm: 20,
          slab20_35: 2400,
          slab35_55: 3000,
          slab55_75: 3600,
          slab75_95: 4200,
          slab95Base: 4600,
          post95Rate: 26
        }
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
        ratesHint: '₹24/km Plain • ₹28/km Hill • Min 250 KM',
        plainRatePerKm: 24,
        hillRatePerKm: 28,
        minimumKm: 250,
        extraKmRate: 25,
        driverAllowance: 500,
        active: true,
        oneWayRate: 24,
        roundTripRate: 24,
        localPackages: {
          fourHours: 3500,
          eightHours: 5500
        },
        hourlyRate: 5500,
        airportFixedRate: 6999,
        slabs: {
          minKm: 20,
          slab20_35: 2800,
          slab35_55: 3500,
          slab55_75: 4200,
          slab75_95: 4900,
          slab95Base: 5500,
          post95Rate: 24
        }
      }
    ];
    writeJson('fleet', defaultFleet);
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
