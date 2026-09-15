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
    console.log('? Admin user initialized: username=admin');
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
  if (!readJson('pricingSettings')) {
    writeJson('pricingSettings', {
      tollIncluded: true,
      stateTaxIncluded: true,
      driverAllowanceIncluded: true,
      fuelIncluded: true,
      nightChargesAmount: 250,
      nightChargeStartHour: 23,
      nightChargeEndHour: 5,
      gstPercent: 0,
      gstIncluded: true,
      termsAndConditions: 'All outstation round-trip and one-way estimates include State Taxes, Highway Toll Taxes, Driver Allowance and Fuel. Toll & parking on local rentals as per actual.',
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

  // 5. Fleet Data
  if (!readJson('fleet')) {
    writeJson('fleet', [
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
        ratesHint: '?12/km One Way ? ?11/km Round Trip',
        oneWayRate: 12,
        roundTripRate: 11,
        localPackages: {
          fourHours: 1000,
          eightHours: 1500
        },
        hourlyRate: 1500,
        airportFixedRate: 2499
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
        ratesHint: '?13/km One Way ? ?12/km Round Trip',
        oneWayRate: 13,
        roundTripRate: 12,
        localPackages: {
          fourHours: 1200,
          eightHours: 2000
        },
        hourlyRate: 2000,
        airportFixedRate: 2999
      },
      {
        id: 'ertiga',
        name: 'Maruti Suzuki Ertiga',
        category: 'Family Car',
        seats: '6?7 Seater',
        luggage: '3-4 Bags',
        ac: 'Front & Rear AC Vents',
        fuel: 'Petrol/CNG',
        image: '/assets/images/ertiga.png',
        altText: 'Maruti Ertiga 6-7 seater family taxi service in North India',
        tag: '?? Family Choice',
        rank: 3,
        badgeEmoji: '??',
        description: 'Spacious 6?7 seater family car perfectly suited for family trips, outstation tours to Himachal Pradesh, and airport group travel.',
        ratesHint: '?15/km One Way ? ?14/km Round Trip',
        oneWayRate: 15,
        roundTripRate: 14,
        localPackages: {
          fourHours: 1500,
          eightHours: 2300
        },
        hourlyRate: 2300,
        airportFixedRate: 3499
      },
      {
        id: 'innova',
        name: 'Toyota Innova Crysta',
        category: 'Premium Family Car',
        seats: '7?8 Seater',
        luggage: '4-5 Bags',
        ac: 'Triple Zone AC',
        fuel: 'Diesel',
        image: '/assets/images/innova.png',
        altText: 'Toyota Innova Crysta 7-8 seater premium cab across North India',
        tag: '?? Premium Family',
        rank: 2,
        badgeEmoji: '??',
        description: 'The gold standard for highway comfort and mountain tours. 7?8 seater with unmatched legroom, plush captain seats, and exceptional ride stability.',
        ratesHint: '?20/km One Way ? ?17.50/km Round Trip',
        oneWayRate: 20,
        roundTripRate: 17.5,
        localPackages: {
          fourHours: 1800,
          eightHours: 3000
        },
        hourlyRate: 3000,
        airportFixedRate: 4999
      },
      {
        id: 'fortuner',
        name: 'Toyota Fortuner Automatic',
        category: 'Premium SUV',
        seats: '6?7 Seater',
        luggage: '4-5 Bags',
        ac: 'Dual Zone Automatic AC',
        fuel: 'Diesel Automatic',
        image: '/assets/images/fortuner.png',
        altText: 'Toyota Fortuner Automatic premium luxury SUV taxi in North India',
        tag: '?? Premium SUV',
        rank: 1,
        badgeEmoji: '??',
        description: 'Commanding 6?7 seater premium SUV with automatic transmission. Luxurious interiors, supreme road presence, and ultimate highway capability.',
        ratesHint: '?28/km One Way ? ?25/km Round Trip',
        oneWayRate: 28,
        roundTripRate: 25,
        localPackages: {
          fourHours: 2000,
          eightHours: 5000
        },
        hourlyRate: 5000,
        airportFixedRate: 6499
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
        ratesHint: '?25/km One Way ? ?24/km Round Trip',
        oneWayRate: 25,
        roundTripRate: 24,
        localPackages: {
          fourHours: 3500,
          eightHours: 5500
        },
        hourlyRate: 5500,
        airportFixedRate: 6999
      }
    ]);
  }

  // 6. Packages Data
  if (!readJson('packages')) {
    writeJson('packages', [
      {
        id: 'delhi-airport-himachal',
        title: 'Delhi Airport to Chandigarh, Shimla, Manali & Kasol',
        category: 'Himachal Tours',
        duration: 'Custom Days / Multi-Day Tour',
        highlights: [
          'Delhi IGI Airport Terminal Pickup',
          'Chandigarh Break / Stay',
          'Shimla & Kufri Views',
          'Manali, Solang Valley & Atal Tunnel',
          'Kasol, Manikaran & Tosh Valley',
          'All Himachal Destinations Covered'
        ],
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        altText: 'Delhi airport to Chandigarh Shimla Manali Kasol all Himachal taxi service',
        description: 'Direct pickup from Delhi IGI Airport to Chandigarh and scenic Himachal hill stations. Expert mountain chauffeurs with clean AC sedans, Innova Crysta, and Tempo Travellers.',
        badge: 'Top Bestseller'
      },
      {
        id: 'delhi-airport-punjab-direct',
        title: 'Delhi Airport to Ludhiana, Jalandhar, Amritsar & All Punjab',
        category: 'Airport Transfer',
        duration: 'Direct Doorstep Drop',
        highlights: [
          'Delhi Airport (T1, T2, T3) 24/7 Pickup',
          'Drop to Ludhiana, Jalandhar, Amritsar',
          'Phagwara, Hoshiarpur, Bathinda, Moga',
          'All Punjab Cities & Villages Covered',
          'Highway Tolls & State Taxes Included'
        ],
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        altText: 'Delhi airport to Ludhiana Jalandhar Amritsar all Punjab taxi service',
        description: 'Hassle-free direct taxi service from Delhi Airport to any city, town, or village in Punjab. Safe night travel, luggage assistance, and punctual flight tracking.',
        badge: 'Direct Express'
      },
      {
        id: 'chandigarh-airport-punjab-himachal',
        title: 'Chandigarh Airport to All Punjab & Himachal',
        category: 'Airport Transfer',
        duration: 'Instant Airport Transfer',
        highlights: [
          'Chandigarh Airport (IXC) Doorstep Pickup',
          'To All Punjab (Jalandhar, Ludhiana, Amritsar)',
          'To Himachal (Shimla, Manali, Dharamshala, Solan)',
          'Kasauli, Kullu, Mandi & Bilaspur',
          'Clean AC Fleet Ready at Terminal'
        ],
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        altText: 'Chandigarh Airport to all Punjab and Himachal taxi service',
        description: 'Connect seamlessly from your flight at Chandigarh Airport to any destination across Punjab or hill stations in Himachal Pradesh with verified drivers.',
        badge: 'Fast Connection'
      },
      {
        id: 'all-punjab-to-delhi',
        title: 'All Punjab to Delhi (One Way & Round Trip)',
        category: 'One Way Taxi',
        duration: 'Daily Highway Express',
        highlights: [
          'Door Pickup from Any Location in Punjab',
          'Drop Anywhere in Delhi NCR / Airport / Stations',
          'Pay Only One-Way (No Return Charge)',
          'Dzire, Verna, Ertiga, Innova Crysta & Tempo',
          'Smooth NH44 Highway Ride'
        ],
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        altText: 'All Punjab to Delhi taxi one way and round trip',
        description: 'Affordable one-way and round-trip intercity taxi service from Jalandhar, Ludhiana, Amritsar, Patiala, Bathinda, and all of Punjab directly to Delhi.',
        badge: 'Budget Friendly'
      },
      {
        id: 'all-punjab-to-airports',
        title: 'All Punjab to Amritsar & Chandigarh Airports',
        category: 'Airport Transfer',
        duration: '24/7 Airport Drops',
        highlights: [
          'To Sri Guru Ram Dass Jee Airport (ATQ)',
          'To Shaheed Bhagat Singh Airport (IXC)',
          'Punctual Flight-Time Pickups',
          'Luggage Space for Overseas Travellers',
          'Zero Delay Guarantee'
        ],
        image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
        altText: 'All Punjab to Amritsar airport and Chandigarh airport taxi',
        description: 'Reliable, round-the-clock taxi service from any corner of Punjab to Amritsar and Chandigarh International Airports for domestic and NRI international departures.',
        badge: 'NRI Choice'
      },
      {
        id: 'dharamshala-dalhousie-escape',
        title: 'Dharamshala, Dalhousie & Khajjiar Tour',
        category: 'Himachal Tours',
        duration: '4 Nights / 5 Days',
        highlights: [
          'McLeod Ganj & Dalai Lama Temple',
          'Dalhousie & Mini Switzerland (Khajjiar)',
          'Bhagsunag Falls & St. John Church',
          'Pickups from All Punjab & Delhi/Chandigarh'
        ],
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
        altText: 'Dharamshala and Dalhousie outstation tour taxi package',
        description: 'Serene hill holiday package covering Little Lhasa and Khajjiar. Customized itineraries with hill driving specialists and well-maintained cabs.',
        badge: 'Scenic Escape'
      }
    ]);
  }

  // 7. Services Data
  if (!readJson('services')) {
    writeJson('services', [
      {
        id: 'airport-transfers',
        title: 'Airport Transfer Services',
        tagline: 'Punjab ? Delhi ? Chandigarh',
        description: 'Specialized 24/7 airport pickup and drop services connecting all regions. Flight tracking, terminal doorstep pickup, and fixed upfront fares.',
        iconName: 'Plane',
        popularRoutes: [
          'All Punjab ? Delhi IGI Airport (DEL)',
          'All Punjab ? Amritsar Airport (ATQ)',
          'All Punjab ? Chandigarh Airport (IXC)',
          'Delhi Airport ? Ludhiana, Jalandhar & Amritsar',
          'Chandigarh Airport ? All Punjab & Himachal'
        ],
        badge: '24/7 Airport Cab',
        defaultMessage: 'Hello Happy Tour & Travels, I want to book an Airport Transfer taxi. Please share fare and cab availability.'
      },
      {
        id: 'delhi-airport-himachal',
        title: 'Delhi Airport to Himachal Tours',
        tagline: 'Scenic Hill Transfers',
        description: 'Direct pickup from Delhi IGI Airport Terminal 1, 2 & 3 to all Himachal hill stations with expert mountain drivers and comfortable AC sedans/SUVs.',
        iconName: 'Compass',
        popularRoutes: [
          'Delhi Airport ? Chandigarh',
          'Delhi Airport ? Shimla & Kufri',
          'Delhi Airport ? Manali & Solang',
          'Delhi Airport ? Kasol & Tosh',
          'Delhi Airport ? All Himachal Destinations'
        ],
        badge: 'Hill Station Special',
        defaultMessage: 'Hello Happy Tour & Travels, I want to book a taxi from Delhi Airport to Himachal Pradesh (Shimla / Manali / Kasol). Please share tariff.'
      },
      {
        id: 'chandigarh-airport-gateway',
        title: 'Chandigarh Airport to Punjab & Himachal',
        tagline: 'Instant Airport Connections',
        description: 'Punctual pickup from Shaheed Bhagat Singh International Airport (IXC) Chandigarh to every city in Punjab and hill stations across Himachal Pradesh.',
        iconName: 'Navigation',
        popularRoutes: [
          'Chandigarh Airport ? Jalandhar & Ludhiana',
          'Chandigarh Airport ? Amritsar & Bathinda',
          'Chandigarh Airport ? Shimla & Kasauli',
          'Chandigarh Airport ? Manali & Dharamshala',
          'Chandigarh Airport ? All Punjab & Himachal'
        ],
        badge: 'Fast Pickup',
        defaultMessage: 'Hello Happy Tour & Travels, I need a taxi from Chandigarh Airport to Punjab / Himachal. Please share available cabs.'
      },
      {
        id: 'punjab-to-delhi-intercity',
        title: 'All Punjab to Delhi One-Way & Round Trip',
        tagline: 'Doorstep Pickup Across Punjab',
        description: 'Comfortable highway cab service on NH44 connecting every district of Punjab (Jalandhar, Ludhiana, Amritsar, Bathinda, Patiala, Phagwara, Hoshiarpur) to Delhi NCR.',
        iconName: 'Car',
        popularRoutes: [
          'All Punjab ? Delhi NCR',
          'Delhi Airport ? Ludhiana, Jalandhar, Amritsar',
          'Jalandhar ? Delhi One Way / Round Trip',
          'Amritsar ? Delhi One Way / Round Trip',
          'Ludhiana ? Delhi One Way / Round Trip'
        ],
        badge: 'Most Popular',
        defaultMessage: 'Hello Happy Tour & Travels, I would like to book a taxi from Punjab to Delhi / Delhi Airport. Please share rates.'
      }
    ]);
  }

  // 8. Popular Routes Data
  if (!readJson('popularRoutes')) {
    writeJson('popularRoutes', [
      {
        id: 'jalandhar-routes',
        emoji: '??',
        title: 'Jalandhar ? Popular Routes',
        origin: 'Jalandhar',
        tag: 'Most Active Hub',
        routes: [
          { from: 'Jalandhar', to: 'Delhi Airport', type: 'Airport' },
          { from: 'Jalandhar', to: 'Delhi', type: 'One Way' },
          { from: 'Jalandhar', to: 'Chandigarh', type: 'One Way' },
          { from: 'Jalandhar', to: 'Chandigarh Airport', type: 'Airport' },
          { from: 'Jalandhar', to: 'Amritsar', type: 'One Way' },
          { from: 'Jalandhar', to: 'Amritsar Airport', type: 'Airport' },
          { from: 'Jalandhar', to: 'Ludhiana', type: 'One Way' },
          { from: 'Jalandhar', to: 'Shimla', type: 'One Way' },
          { from: 'Jalandhar', to: 'Manali', type: 'One Way' },
          { from: 'Jalandhar', to: 'Kullu', type: 'One Way' },
          { from: 'Jalandhar', to: 'Dharamshala', type: 'One Way' },
          { from: 'Jalandhar', to: 'Dalhousie', type: 'One Way' },
          { from: 'Jalandhar', to: 'Pathankot', type: 'One Way' },
          { from: 'Jalandhar', to: 'Jammu', type: 'One Way' },
          { from: 'Jalandhar', to: 'Katra', type: 'One Way' },
          { from: 'Jalandhar', to: 'Hoshiarpur', type: 'One Way' },
          { from: 'Jalandhar', to: 'Patiala', type: 'One Way' },
          { from: 'Jalandhar', to: 'Mohali', type: 'One Way' },
          { from: 'Jalandhar', to: 'Zirakpur', type: 'One Way' },
          { from: 'Jalandhar', to: 'Dehradun', type: 'One Way' }
        ]
      },
      {
        id: 'amritsar-routes',
        emoji: '??',
        title: 'Amritsar ? Popular Routes',
        origin: 'Amritsar',
        tag: 'Heritage & Airport Hub',
        routes: [
          { from: 'Amritsar', to: 'Delhi Airport', type: 'Airport' },
          { from: 'Amritsar', to: 'Delhi', type: 'One Way' },
          { from: 'Amritsar', to: 'Chandigarh', type: 'One Way' },
          { from: 'Amritsar', to: 'Chandigarh Airport', type: 'Airport' },
          { from: 'Amritsar', to: 'Jalandhar', type: 'One Way' },
          { from: 'Amritsar', to: 'Ludhiana', type: 'One Way' },
          { from: 'Amritsar', to: 'Amritsar Airport', type: 'Airport' },
          { from: 'Amritsar', to: 'Shimla', type: 'One Way' },
          { from: 'Amritsar', to: 'Manali', type: 'One Way' },
          { from: 'Amritsar', to: 'Kullu', type: 'One Way' },
          { from: 'Amritsar', to: 'Dharamshala', type: 'One Way' },
          { from: 'Amritsar', to: 'Dalhousie', type: 'One Way' },
          { from: 'Amritsar', to: 'Pathankot', type: 'One Way' },
          { from: 'Amritsar', to: 'Jammu', type: 'One Way' },
          { from: 'Amritsar', to: 'Katra', type: 'One Way' },
          { from: 'Amritsar', to: 'Hoshiarpur', type: 'One Way' },
          { from: 'Amritsar', to: 'Patiala', type: 'One Way' },
          { from: 'Amritsar', to: 'Mohali', type: 'One Way' },
          { from: 'Amritsar', to: 'Dehradun', type: 'One Way' }
        ]
      },
      {
        id: 'ludhiana-routes',
        emoji: '??',
        title: 'Ludhiana ? Popular Routes',
        origin: 'Ludhiana',
        tag: 'Industrial Capital Hub',
        routes: [
          { from: 'Ludhiana', to: 'Delhi Airport', type: 'Airport' },
          { from: 'Ludhiana', to: 'Delhi', type: 'One Way' },
          { from: 'Ludhiana', to: 'Chandigarh', type: 'One Way' },
          { from: 'Ludhiana', to: 'Chandigarh Airport', type: 'Airport' },
          { from: 'Ludhiana', to: 'Amritsar', type: 'One Way' },
          { from: 'Ludhiana', to: 'Amritsar Airport', type: 'Airport' },
          { from: 'Ludhiana', to: 'Jalandhar', type: 'One Way' },
          { from: 'Ludhiana', to: 'Shimla', type: 'One Way' },
          { from: 'Ludhiana', to: 'Manali', type: 'One Way' },
          { from: 'Ludhiana', to: 'Kullu', type: 'One Way' },
          { from: 'Ludhiana', to: 'Dharamshala', type: 'One Way' },
          { from: 'Ludhiana', to: 'Dalhousie', type: 'One Way' },
          { from: 'Ludhiana', to: 'Pathankot', type: 'One Way' },
          { from: 'Ludhiana', to: 'Patiala', type: 'One Way' },
          { from: 'Ludhiana', to: 'Mohali', type: 'One Way' },
          { from: 'Ludhiana', to: 'Zirakpur', type: 'One Way' },
          { from: 'Ludhiana', to: 'Dehradun', type: 'One Way' },
          { from: 'Ludhiana', to: 'Jaipur', type: 'One Way' }
        ]
      },
      {
        id: 'delhi-airport-punjab-routes',
        emoji: '??',
        title: 'Delhi Airport ? Punjab',
        origin: 'Delhi Airport',
        tag: 'Terminal Pickup Express',
        routes: [
          { from: 'Delhi Airport', to: 'Jalandhar', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Amritsar', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Ludhiana', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Chandigarh', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Patiala', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Bathinda', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Hoshiarpur', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Moga', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Kapurthala', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Pathankot', type: 'Airport' }
        ]
      },
      {
        id: 'delhi-airport-himachal-routes',
        emoji: '???',
        title: 'Delhi Airport ? Himachal',
        origin: 'Delhi Airport',
        tag: 'Scenic Hill Tours',
        routes: [
          { from: 'Delhi Airport', to: 'Shimla', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Manali', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Kullu', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Dharamshala', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Dalhousie', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Kasauli', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Solan', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Mandi', type: 'Airport' },
          { from: 'Delhi Airport', to: 'Palampur', type: 'Airport' }
        ]
      },
      {
        id: 'chandigarh-himachal-routes',
        emoji: '???',
        title: 'Chandigarh ? Himachal',
        origin: 'Chandigarh',
        tag: 'Himachal Gateway Express',
        routes: [
          { from: 'Chandigarh', to: 'Shimla', type: 'One Way' },
          { from: 'Chandigarh', to: 'Manali', type: 'One Way' },
          { from: 'Chandigarh', to: 'Kullu', type: 'One Way' },
          { from: 'Chandigarh', to: 'Dharamshala', type: 'One Way' },
          { from: 'Chandigarh', to: 'Dalhousie', type: 'One Way' },
          { from: 'Chandigarh', to: 'Kasauli', type: 'One Way' },
          { from: 'Chandigarh', to: 'Solan', type: 'One Way' },
          { from: 'Chandigarh', to: 'Mandi', type: 'One Way' },
          { from: 'Chandigarh', to: 'Palampur', type: 'One Way' },
          { from: 'Chandigarh', to: 'Chail', type: 'One Way' }
        ]
      }
    ]);
  }

  // 9. Popular Locations Data
  if (!readJson('popularLocations')) {
    writeJson('popularLocations', [
      { name: 'Jalandhar', state: 'Punjab', type: 'City', lat: 31.3260, lon: 75.5762 },
      { name: 'Amritsar', state: 'Punjab', type: 'City & Heritage', lat: 31.6340, lon: 74.8723 },
      { name: 'Amritsar Airport', state: 'Punjab', type: 'Airport', lat: 31.7096, lon: 74.7973 },
      { name: 'Sri Guru Ram Dass Jee Airport (ATQ)', state: 'Punjab', type: 'Airport', lat: 31.7096, lon: 74.7973 },
      { name: 'Ludhiana', state: 'Punjab', type: 'City', lat: 30.9010, lon: 75.8573 },
      { name: 'Chandigarh', state: 'UT', type: 'Capital & Hub', lat: 30.7333, lon: 76.7794 },
      { name: 'Chandigarh Airport', state: 'Chandigarh', type: 'Airport', lat: 30.6735, lon: 76.7885 },
      { name: 'Shaheed Bhagat Singh Airport (IXC)', state: 'Chandigarh', type: 'Airport', lat: 30.6735, lon: 76.7885 },
      { name: 'Mohali', state: 'Punjab', type: 'City', lat: 30.7046, lon: 76.7179 },
      { name: 'Zirakpur', state: 'Punjab', type: 'City', lat: 30.6425, lon: 76.8173 },
      { name: 'Phagwara', state: 'Punjab', type: 'City', lat: 31.2240, lon: 75.7708 },
      { name: 'Hoshiarpur', state: 'Punjab', type: 'City', lat: 31.5273, lon: 75.9149 },
      { name: 'Patiala', state: 'Punjab', type: 'City', lat: 30.3398, lon: 76.3869 },
      { name: 'Bathinda', state: 'Punjab', type: 'City', lat: 30.2110, lon: 74.9455 },
      { name: 'Pathankot', state: 'Punjab', type: 'City & Gateway', lat: 32.2689, lon: 75.6499 },
      { name: 'Kapurthala', state: 'Punjab', type: 'City', lat: 31.3800, lon: 75.3800 },
      { name: 'Nawanshahr (SBS Nagar)', state: 'Punjab', type: 'City', lat: 31.1256, lon: 76.1189 },
      { name: 'Moga', state: 'Punjab', type: 'City', lat: 30.8165, lon: 75.1717 },
      { name: 'Delhi', state: 'Delhi', type: 'Capital', lat: 28.6139, lon: 77.2090 },
      { name: 'Delhi Airport', state: 'Delhi', type: 'Airport', lat: 28.5562, lon: 77.1000 },
      { name: 'Indira Gandhi International Airport (DEL)', state: 'Delhi', type: 'Airport', lat: 28.5562, lon: 77.1000 },
      { name: 'Gurgaon / Gurugram', state: 'Haryana', type: 'NCR Hub', lat: 28.4595, lon: 77.0266 },
      { name: 'Noida', state: 'Uttar Pradesh', type: 'NCR Hub', lat: 28.5355, lon: 77.3910 },
      { name: 'Shimla', state: 'Himachal Pradesh', type: 'Hill Station', lat: 31.1048, lon: 77.1734 },
      { name: 'Manali', state: 'Himachal Pradesh', type: 'Hill Station', lat: 32.2432, lon: 77.1892 },
      { name: 'Kullu', state: 'Himachal Pradesh', type: 'Valley', lat: 31.9579, lon: 77.1095 },
      { name: 'Dharamshala', state: 'Himachal Pradesh', type: 'Hill Station', lat: 32.2190, lon: 76.3234 },
      { name: 'Dalhousie', state: 'Himachal Pradesh', type: 'Hill Station', lat: 32.5387, lon: 75.9710 },
      { name: 'Kasol', state: 'Himachal Pradesh', type: 'Hill Station', lat: 32.0100, lon: 77.3150 },
      { name: 'Jammu', state: 'Jammu & Kashmir', type: 'City', lat: 32.7266, lon: 74.8570 },
      { name: 'Katra', state: 'Jammu & Kashmir', type: 'Pilgrimage', lat: 32.9926, lon: 74.9317 },
      { name: 'Dehradun', state: 'Uttarakhand', type: 'Capital', lat: 30.3165, lon: 78.0322 },
      { name: 'Haridwar', state: 'Uttarakhand', type: 'Pilgrimage', lat: 29.9457, lon: 78.1642 }
    ]);
  }
};
