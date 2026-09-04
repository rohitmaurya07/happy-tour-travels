export const fleetData = [
  {
    id: "dzire",
    name: "Maruti Suzuki Dzire",
    category: "Budget Sedan",
    seats: "4 Passengers",
    luggage: "2-3 Bags",
    ac: "Dual AC",
    fuel: "Petrol/CNG",
    image: "/assets/images/dzire.jpg",
    altText: "Maruti Suzuki Dzire budget sedan taxi service in North India",
    tag: "Budget Sedan",
    rank: 5,
    description: "Comfortable and economic 4-seater sedan ideal for city commutes, airport transfers, and one-way outstation trips.",
    ratesHint: "₹12/km One Way • ₹11/km Round Trip",
    oneWayRate: 12,
    roundTripRate: 11,
    localPackages: {
      fourHours: 1000, // 4 Hours / 40 KM — ₹1,000
      eightHours: 1500, // 8 Hours / 80 KM — ₹1,500
    },
    hourlyRate: 1500, // 8 Hrs / 80 Kms default
    airportFixedRate: 2499,
  },
  {
    id: "verna",
    name: "Hyundai Verna",
    category: "Comfortable Sedan",
    seats: "4 Passengers",
    luggage: "3 Bags",
    ac: "Automatic Climate Control",
    fuel: "Petrol/Diesel",
    image: "/assets/images/verna.png",
    altText: "Hyundai Verna comfortable executive taxi in North India",
    tag: "Comfortable Sedan",
    rank: 4,
    description: "Stylish 4-seater executive sedan offering plush interiors, smooth highway suspension, and superior comfort for business & VIP travel.",
    ratesHint: "₹13/km One Way • ₹12/km Round Trip",
    oneWayRate: 13,
    roundTripRate: 12,
    localPackages: {
      fourHours: 1200, // 4 Hours / 40 KM — ₹1,200
      eightHours: 2000, // 8 Hours / 80 KM — ₹2,000
    },
    hourlyRate: 2000, // 8 Hrs / 80 Kms
    airportFixedRate: 2999,
  },
  {
    id: "ertiga",
    name: "Maruti Suzuki Ertiga",
    category: "Family Car",
    seats: "6–7 Seater",
    luggage: "3-4 Bags",
    ac: "Front & Rear AC Vents",
    fuel: "Petrol/CNG",
    image: "/assets/images/ertiga.png",
    altText: "Maruti Ertiga 6-7 seater family taxi service in North India",
    tag: "🥉 Family Choice",
    rank: 3,
    badgeEmoji: "🥉",
    description: "Spacious 6–7 seater family car perfectly suited for family trips, outstation tours to Himachal Pradesh, and airport group travel.",
    ratesHint: "₹15/km One Way • ₹14/km Round Trip",
    oneWayRate: 15,
    roundTripRate: 14,
    localPackages: {
      fourHours: 1500, // 4 Hours / 40 KM — ₹1,500
      eightHours: 2300, // 8 Hours / 80 KM — ₹2,300
    },
    hourlyRate: 2300, // 8 Hrs / 80 Kms
    airportFixedRate: 3499,
  },
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    category: "Premium Family Car",
    seats: "7–8 Seater",
    luggage: "4-5 Bags",
    ac: "Triple Zone AC",
    fuel: "Diesel",
    image: "/assets/images/innova.png",
    altText: "Toyota Innova Crysta 7-8 seater premium cab across North India",
    tag: "🥈 Premium Family",
    rank: 2,
    badgeEmoji: "🥈",
    description: "The gold standard for highway comfort and mountain tours. 7–8 seater with unmatched legroom, plush captain seats, and exceptional ride stability.",
    ratesHint: "₹20/km One Way • ₹17.50/km Round Trip",
    oneWayRate: 20,
    roundTripRate: 17.5,
    localPackages: {
      fourHours: 1800, // 4 Hours / 40 KM — ₹1,800
      eightHours: 3000, // 8 Hours / 80 KM — ₹3,000
    },
    hourlyRate: 3000, // 8 Hrs / 80 Kms
    airportFixedRate: 4999,
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner Automatic",
    category: "Premium SUV",
    seats: "6–7 Seater",
    luggage: "4-5 Bags",
    ac: "Dual Zone Automatic AC",
    fuel: "Diesel Automatic",
    image: "/assets/images/fortuner.png",
    altText: "Toyota Fortuner Automatic premium luxury SUV taxi in North India",
    tag: "🥇 Premium SUV",
    rank: 1,
    badgeEmoji: "🥇",
    description: "Commanding 6–7 seater premium SUV with automatic transmission. Luxurious interiors, supreme road presence, and ultimate highway capability.",
    ratesHint: "₹28/km One Way • ₹25/km Round Trip",
    oneWayRate: 28,
    roundTripRate: 25,
    localPackages: {
      fourHours: 2000, // 4 Hours / 40 KM — ₹2,000
      eightHours: 5000, // 8 Hours / 80 KM — ₹5,000
    },
    hourlyRate: 5000, // 8 Hrs / 80 Kms
    airportFixedRate: 6499,
  },
  {
    id: "tempo",
    name: "Force Tempo Traveller",
    category: "Luxury Minibus",
    seats: "12 / 16 / 20 Seats",
    luggage: "Ample Luggage Storage",
    ac: "Roof Mounted Heavy AC",
    fuel: "Diesel",
    image: "/assets/images/tempo.png",
    altText: "Tempo Traveller on rent in North India for group tour packages",
    tag: "Group Special",
    rank: 6,
    description: "Spacious vehicle with pushback seats, individual charging points, and music system. Designed for large family reunions & wedding groups.",
    ratesHint: "₹25/km One Way • ₹24/km Round Trip",
    oneWayRate: 25,
    roundTripRate: 24,
    localPackages: {
      fourHours: 3500,
      eightHours: 5500,
    },
    hourlyRate: 5500, // 8 Hrs / 80 Kms
    airportFixedRate: 6999,
  }
];
