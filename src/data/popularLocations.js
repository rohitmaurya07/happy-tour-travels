// Comprehensive database of North India and Pan-India cities, airports, hill stations & pilgrimage destinations
export const popularLocations = [
  // Major Hubs & Punjab
  { name: "Jalandhar", state: "Punjab", type: "City", lat: 31.3260, lon: 75.5762 },
  { name: "Amritsar", state: "Punjab", type: "City & Heritage", lat: 31.6340, lon: 74.8723 },
  { name: "Sri Guru Ram Dass Jee Airport (ATQ)", state: "Punjab", type: "Airport", lat: 31.7096, lon: 74.7973 },
  { name: "Ludhiana", state: "Punjab", type: "City", lat: 30.9010, lon: 75.8573 },
  { name: "Chandigarh", state: "UT", type: "Capital & Hub", lat: 30.7333, lon: 76.7794 },
  { name: "Shaheed Bhagat Singh Airport (IXC)", state: "Chandigarh", type: "Airport", lat: 30.6735, lon: 76.7885 },
  { name: "Mohali", state: "Punjab", type: "City", lat: 30.7046, lon: 76.7179 },
  { name: "Panchkula", state: "Haryana", type: "City", lat: 30.6942, lon: 76.8606 },
  { name: "Phagwara", state: "Punjab", type: "City", lat: 31.2240, lon: 75.7708 },
  { name: "Hoshiarpur", state: "Punjab", type: "City", lat: 31.5273, lon: 75.9149 },
  { name: "Patiala", state: "Punjab", type: "City", lat: 30.3398, lon: 76.3869 },
  { name: "Bathinda", state: "Punjab", type: "City", lat: 30.2110, lon: 74.9455 },
  { name: "Pathankot", state: "Punjab", type: "City & Gateway", lat: 32.2689, lon: 75.6499 },
  { name: "Kapurthala", state: "Punjab", type: "City", lat: 31.3800, lon: 75.3800 },
  { name: "Nawanshahr (SBS Nagar)", state: "Punjab", type: "City", lat: 31.1256, lon: 76.1189 },
  { name: "Ropar (Roopnagar)", state: "Punjab", type: "City", lat: 30.9664, lon: 76.5331 },
  { name: "Moga", state: "Punjab", type: "City", lat: 30.8165, lon: 75.1717 },
  { name: "Firozpur", state: "Punjab", type: "City", lat: 30.9237, lon: 74.6114 },
  { name: "Batala", state: "Punjab", type: "City", lat: 31.8186, lon: 75.2028 },
  { name: "Gurdaspur", state: "Punjab", type: "City", lat: 32.0419, lon: 75.4053 },
  { name: "Khanna", state: "Punjab", type: "City", lat: 30.7071, lon: 76.2167 },
  { name: "Rajpura", state: "Punjab", type: "City", lat: 30.4842, lon: 76.5941 },
  { name: "Abohar", state: "Punjab", type: "City", lat: 30.1453, lon: 74.1994 },
  { name: "Fazilka", state: "Punjab", type: "City", lat: 30.4037, lon: 74.0254 },
  { name: "Sri Anandpur Sahib", state: "Punjab", type: "Pilgrimage", lat: 31.2356, lon: 76.4989 },

  // Delhi NCR & Capital
  { name: "Delhi", state: "Delhi", type: "Capital", lat: 28.6139, lon: 77.2090 },
  { name: "Indira Gandhi International Airport (DEL)", state: "Delhi", type: "Airport", lat: 28.5562, lon: 77.1000 },
  { name: "New Delhi Railway Station (NDLS)", state: "Delhi", type: "Station", lat: 28.6430, lon: 77.2197 },
  { name: "Gurgaon (Gurugram)", state: "Haryana", type: "NCR Hub", lat: 28.4595, lon: 77.0266 },
  { name: "Noida", state: "Uttar Pradesh", type: "NCR Hub", lat: 28.5355, lon: 77.3910 },
  { name: "Greater Noida", state: "Uttar Pradesh", type: "NCR Hub", lat: 28.4744, lon: 77.5040 },
  { name: "Ghaziabad", state: "Uttar Pradesh", type: "NCR Hub", lat: 28.6692, lon: 77.4538 },
  { name: "Faridabad", state: "Haryana", type: "NCR Hub", lat: 28.4089, lon: 77.3178 },

  // Himachal Pradesh Hill Stations
  { name: "Shimla", state: "Himachal Pradesh", type: "Hill Station", lat: 31.1048, lon: 77.1734 },
  { name: "Manali", state: "Himachal Pradesh", type: "Hill Station", lat: 32.2432, lon: 77.1892 },
  { name: "Dharamshala", state: "Himachal Pradesh", type: "Hill Station", lat: 32.2190, lon: 76.3234 },
  { name: "McLeod Ganj", state: "Himachal Pradesh", type: "Hill Station", lat: 32.2426, lon: 76.3213 },
  { name: "Dalhousie", state: "Himachal Pradesh", type: "Hill Station", lat: 32.5387, lon: 75.9710 },
  { name: "Khajjiar", state: "Himachal Pradesh", type: "Hill Station", lat: 32.5510, lon: 76.0601 },
  { name: "Kullu", state: "Himachal Pradesh", type: "Valley", lat: 31.9579, lon: 77.1095 },
  { name: "Kasol", state: "Himachal Pradesh", type: "Hill Station", lat: 32.0100, lon: 77.3150 },
  { name: "Kasauli", state: "Himachal Pradesh", type: "Hill Station", lat: 30.9013, lon: 76.9649 },
  { name: "Kufri", state: "Himachal Pradesh", type: "Hill Station", lat: 31.0979, lon: 77.2678 },
  { name: "Solan", state: "Himachal Pradesh", type: "City", lat: 30.9084, lon: 77.0999 },
  { name: "Mandi", state: "Himachal Pradesh", type: "City", lat: 31.7087, lon: 76.9320 },
  { name: "Bilaspur", state: "Himachal Pradesh", type: "City", lat: 31.3326, lon: 76.7570 },
  { name: "Palampur", state: "Himachal Pradesh", type: "Hill Station", lat: 32.1109, lon: 76.5363 },
  { name: "Chamba", state: "Himachal Pradesh", type: "Hill Station", lat: 32.5534, lon: 76.1258 },
  { name: "Bir Billing", state: "Himachal Pradesh", type: "Adventure", lat: 32.0400, lon: 76.7167 },
  { name: "Jibhi / Tirthan Valley", state: "Himachal Pradesh", type: "Valley", lat: 31.6360, lon: 77.3490 },
  { name: "Spiti Valley (Kaza)", state: "Himachal Pradesh", type: "High Altitude", lat: 32.2276, lon: 78.0710 },
  { name: "Una", state: "Himachal Pradesh", type: "City", lat: 31.4685, lon: 76.2708 },
  { name: "Kangra", state: "Himachal Pradesh", type: "Pilgrimage & City", lat: 32.0998, lon: 76.2691 },
  { name: "Jwalamukhi", state: "Himachal Pradesh", type: "Pilgrimage", lat: 31.8763, lon: 76.3235 },
  { name: "Chintpurni", state: "Himachal Pradesh", type: "Pilgrimage", lat: 31.6441, lon: 76.1264 },
  { name: "Naina Devi", state: "Himachal Pradesh", type: "Pilgrimage", lat: 31.3056, lon: 76.5369 },

  // Jammu & Kashmir & Ladakh
  { name: "Jammu", state: "Jammu & Kashmir", type: "City", lat: 32.7266, lon: 74.8570 },
  { name: "Katra (Vaishno Devi)", state: "Jammu & Kashmir", type: "Pilgrimage", lat: 32.9926, lon: 74.9317 },
  { name: "Srinagar", state: "Jammu & Kashmir", type: "Valley & Tourism", lat: 34.0837, lon: 74.7973 },
  { name: "Gulmarg", state: "Jammu & Kashmir", type: "Hill Station", lat: 34.0484, lon: 74.3805 },
  { name: "Pahalgam", state: "Jammu & Kashmir", type: "Valley", lat: 34.0163, lon: 75.3150 },
  { name: "Leh Ladakh", state: "Ladakh", type: "High Altitude", lat: 34.1526, lon: 77.5771 },

  // Haryana & Rajasthan & Uttarakhand & UP
  { name: "Ambala", state: "Haryana", type: "City", lat: 30.3782, lon: 76.7767 },
  { name: "Kurukshetra", state: "Haryana", type: "Pilgrimage & City", lat: 29.9695, lon: 76.8783 },
  { name: "Karnal", state: "Haryana", type: "City", lat: 29.6857, lon: 76.9905 },
  { name: "Panipat", state: "Haryana", type: "City", lat: 29.3909, lon: 76.9635 },
  { name: "Sonipat", state: "Haryana", type: "City", lat: 28.9931, lon: 77.0151 },
  { name: "Rohtak", state: "Haryana", type: "City", lat: 28.8955, lon: 76.6066 },
  { name: "Hisar", state: "Haryana", type: "City", lat: 29.1492, lon: 75.7217 },
  { name: "Haridwar", state: "Uttarakhand", type: "Pilgrimage", lat: 29.9457, lon: 78.1642 },
  { name: "Rishikesh", state: "Uttarakhand", type: "Yoga & Adventure", lat: 30.0869, lon: 78.2676 },
  { name: "Dehradun", state: "Uttarakhand", type: "Capital", lat: 30.3165, lon: 78.0322 },
  { name: "Mussoorie", state: "Uttarakhand", type: "Hill Station", lat: 30.4598, lon: 78.0644 },
  { name: "Nainital", state: "Uttarakhand", type: "Hill Station", lat: 29.3919, lon: 79.4542 },
  { name: "Jim Corbett", state: "Uttarakhand", type: "National Park", lat: 29.5300, lon: 78.7747 },
  { name: "Jaipur", state: "Rajasthan", type: "Heritage City", lat: 26.9124, lon: 75.7873 },
  { name: "Udaipur", state: "Rajasthan", type: "Heritage City", lat: 24.5854, lon: 73.7125 },
  { name: "Jodhpur", state: "Rajasthan", type: "Heritage City", lat: 26.2389, lon: 73.0243 },
  { name: "Agra (Taj Mahal)", state: "Uttar Pradesh", type: "Heritage", lat: 27.1767, lon: 78.0081 },
  { name: "Mathura / Vrindavan", state: "Uttar Pradesh", type: "Pilgrimage", lat: 27.4924, lon: 77.6737 },
  { name: "Meerut", state: "Uttar Pradesh", type: "City", lat: 28.9845, lon: 77.7064 },
  { name: "Ayodhya", state: "Uttar Pradesh", type: "Pilgrimage", lat: 26.7922, lon: 82.1998 },
  { name: "Varanasi", state: "Uttar Pradesh", type: "Pilgrimage", lat: 25.3176, lon: 82.9739 },
  { name: "Lucknow", state: "Uttar Pradesh", type: "Capital", lat: 26.8467, lon: 80.9462 },
];

/**
 * Filter popular locations by matching text (name or state)
 */
export const searchPopularLocations = (query) => {
  if (!query || !query.trim()) {
    return popularLocations.slice(0, 10);
  }
  const cleanQ = query.trim().toLowerCase();
  return popularLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(cleanQ) ||
      loc.state.toLowerCase().includes(cleanQ) ||
      (loc.type && loc.type.toLowerCase().includes(cleanQ))
  );
};
