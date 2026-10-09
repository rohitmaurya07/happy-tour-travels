import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, ArrowRight, 
  Calendar, Clock, Tag, Mountain, 
  AlertCircle, PhoneCall, Sparkles, MapPin, Check
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { calculateAllFaresApi, createBookingApi } from '../services/api';
import { hourlyRentalPricing } from '../data/hourlyRentalPricing';

export default function SearchResults({ searchParams, onModifySearch }) {
  const { fleet, siteConfig } = useSiteData();
  const [calculatedFares, setCalculatedFares] = useState([]);
  const [isLoadingFares, setIsLoadingFares] = useState(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);

  if (!searchParams) return null;

  const { tripType, fromLocation, toLocation, departureDate, pickupTime, distanceKm } = searchParams;
  const isRoundTrip = tripType === 'Round Trip';
  const isHourly = tripType === 'Hourly Rental';

  // Fetch server-authoritative calculations
  useEffect(() => {
    let isMounted = true;
    setIsLoadingFares(true);

    const fetchServerFares = async () => {
      try {
        const response = await calculateAllFaresApi({
          pickup: fromLocation,
          destination: toLocation,
          tripType,
          departureDate,
          pickupTime,
          distanceKm: Number(distanceKm) > 0 ? Number(distanceKm) : undefined
        });

        if (isMounted && response?.results) {
          setCalculatedFares(response.results);
        }
      } catch (err) {
        console.warn('Could not fetch server fares:', err.message);
        if (isMounted) setCalculatedFares([]);
      } finally {
        if (isMounted) setIsLoadingFares(false);
      }
    };

    fetchServerFares();

    return () => {
      isMounted = false;
    };
  }, [fromLocation, toLocation, tripType, departureDate, pickupTime, distanceKm]);

  const formattedDate = departureDate ? new Date(departureDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Today';

  const getFleetDetails = (vehicleId) => {
    return fleet?.find(f => f.id === vehicleId) || {};
  };

  const handleWhatsAppBooking = (fareItem) => {
    const fleetInfo = getFleetDetails(fareItem.vehicleId);

    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book a taxi.

*Booking Details:*
- From: ${fromLocation}
- To: ${toLocation}
- Trip Type: ${tripType}
- Schedule: ${formattedDate} at ${pickupTime}
- Charged Distance: ${fareItem.billableKm || fareItem.distanceKm} KM
- Extra KM Rate: ₹${fareItem.extraKmRate || fareItem.ratePerKm}/km

*Selected Vehicle:*
- Vehicle: ${fareItem.vehicle} (${fareItem.category})
- Capacity: ${fareItem.seats || fleetInfo.seats || '4 Passengers'}, ${fleetInfo.luggage || '2-3 Bags'}

*Price Details (All-Inclusive):*
- Total Fare: ₹${fareItem.estimatedTotal.toLocaleString('en-IN')} (Fuel & Chauffeur & Tolls Included)
- Parking Extra (if used)

Please confirm cab availability.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const handleHourlyWhatsAppBooking = (carKey, carConfig, pkg) => {
    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book an Hourly Rental car.

*Hourly Rental Booking Details:*
- City: ${fromLocation}
- Date: ${formattedDate}
- Time: ${pickupTime}
- Car: ${carConfig.name}
- Package: ${pkg.label}
- Rate: ₹${pkg.rate.toLocaleString('en-IN')} (Fuel & Chauffeur Included)

Please confirm cab availability.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const handleCustomWhatsAppInquiry = () => {
    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to inquire about taxi fare for a custom route.

*Route Details:*
- Pickup (From): ${fromLocation}
- Destination (To): ${isHourly ? 'Hourly Rental' : toLocation}
- Trip Type: ${tripType}
- Schedule: ${formattedDate} at ${pickupTime}

Please share the best discounted custom rate and available vehicle options.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const primaryRouteType = calculatedFares[0]?.routeType || 'PLAIN';

  // Hourly Rental Vehicles (Dzire / similar, Ertiga / similar, Innova Crysta)
  const hourlyCars = [
    {
      id: 'dzire',
      name: 'Dzire / similar',
      subtitle: 'Dzire size / similar car may be provided',
      image: '/assets/images/dzire.jpg',
      seats: '4 Passengers',
      fuel: 'Diesel / Petrol / CNG',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: hourlyRentalPricing.defaultRates?.dzire?.rates?.['4h40k'] || 1100 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: hourlyRentalPricing.defaultRates?.dzire?.rates?.['8h80k'] || 1600 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: hourlyRentalPricing.defaultRates?.dzire?.rates?.['10h100k'] || 2000 }
      ]
    },
    {
      id: 'ertiga',
      name: 'Ertiga / similar',
      subtitle: 'Ertiga or similar comfortable car may be provided',
      image: '/assets/images/ertiga.png',
      seats: '6–7 Seater',
      fuel: 'Diesel / Petrol / CNG',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: hourlyRentalPricing.defaultRates?.ertiga?.rates?.['4h40k'] || 1500 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: hourlyRentalPricing.defaultRates?.ertiga?.rates?.['8h80k'] || 2300 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: hourlyRentalPricing.defaultRates?.ertiga?.rates?.['10h100k'] || 2800 }
      ]
    },
    {
      id: 'innova',
      name: 'Innova Crysta',
      subtitle: '',
      image: '/assets/images/innova.png',
      seats: '7–8 Seater',
      fuel: 'Diesel',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: hourlyRentalPricing.defaultRates?.innova?.rates?.['4h40k'] || 2200 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: hourlyRentalPricing.defaultRates?.innova?.rates?.['8h80k'] || 3200 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: hourlyRentalPricing.defaultRates?.innova?.rates?.['10h100k'] || 3900 }
      ]
    }
  ];

  const popularHourlyCities = [
    'Jalandhar', 'Amritsar', 'Ludhiana', 'Chandigarh', 'Mohali',
    'Shimla', 'Manali', 'Dharamshala', 'Delhi', 'Gurgaon', 'Jaipur'
  ];

  return (
    <div id="search-results" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Route & Search Summary Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-full text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-brand-yellow" />
              <span>{isHourly ? 'City Hourly Car Rental' : 'Predefined Fixed Tariffs'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-nexa font-heading text-white flex flex-wrap items-center gap-2">
              <span>{fromLocation}</span>
              {!isHourly && (
                <>
                  <ArrowRight className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <span>{toLocation}</span>
                </>
              )}
              {isHourly && (
                <span className="text-brand-yellow text-lg font-normal">(Hourly Rental)</span>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-300 mt-3">
              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {tripType}
              </span>

              {!isHourly && (
                <span className={`px-3 py-1 rounded-lg font-bold flex items-center border ${
                  primaryRouteType === 'HILL' 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : primaryRouteType === 'MIXED'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                    : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                }`}>
                  <Mountain className="w-3.5 h-3.5 mr-1.5" />
                  {primaryRouteType} TERRAIN
                </span>
              )}

              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {formattedDate}
              </span>
              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {pickupTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onModifySearch}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 w-full sm:w-auto"
            >
              <span>{isHourly ? 'Change City / Date' : 'Modify Route'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hourly Rental Dedicated View (Dzire / similar, Ertiga / similar, Innova Crysta) */}
      {isHourly ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hourlyCars.map((car) => (
              <div 
                key={car.id}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-yellow-400"
              >
                <div>
                  {/* Car Image Container */}
                  <div className="h-44 bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex items-center justify-center relative">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    />
                  </div>

                  {/* Header & Subtitle */}
                  <div className="p-5 pb-3">
                    <h3 className="text-xl font-black font-nexa text-slate-900">
                      {car.name}
                    </h3>
                    {car.subtitle && (
                      <p className="text-xs text-amber-900 font-semibold mt-0.5">
                        {car.subtitle}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-gray-100">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-yellow-600" />
                        {car.seats}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{car.fuel}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Packages with Individual "Book Now" buttons */}
                <div className="p-5 pt-0 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Select Rental Duration:
                  </span>
                  {car.packages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      className="bg-gray-50 hover:bg-amber-50/70 rounded-2xl p-3 border border-gray-200/80 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {pkg.label}
                        </span>
                        <span className="text-base font-black font-nexa text-slate-950 mt-0.5 block">
                          ₹{pkg.rate.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleHourlyWhatsAppBooking(car.id, car, pkg)}
                        className="py-2 px-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs transition-transform hover:scale-105 shadow-sm flex items-center space-x-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Popular Cities for Hourly Rental */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-yellow-500" />
              <span>Popular Hourly Rental Cities</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularHourlyCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    const q = new URLSearchParams({
                      tripType: 'Hourly Rental',
                      from: city,
                      to: 'Local Rental',
                      date: departureDate,
                      time: pickupTime,
                    }).toString();
                    window.location.href = `/search?${q}`;
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    fromLocation.toLowerCase() === city.toLowerCase()
                      ? 'bg-slate-900 text-yellow-400 shadow-md ring-1 ring-slate-900'
                      : 'bg-gray-100 hover:bg-gray-200 text-slate-800'
                  }`}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Regular One-Way & Round Trip Vehicle Cards */
        isLoadingFares ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-700">Checking predefined route tariffs...</p>
          </div>
        ) : calculatedFares.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-amber-300 shadow-xl max-w-3xl mx-auto my-4 animate-fadeIn">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <PhoneCall className="w-8 h-8 text-slate-950" />
            </div>

            <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Custom Route Inquiry
            </span>

            <h3 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900 mb-2">
              Inquire for Best Custom Rate on WhatsApp
            </h3>

            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              A fixed tariff is not predefined for <strong className="text-slate-950">{fromLocation}</strong> ➔ <strong className="text-slate-950">{toLocation}</strong>. Our team provides instant, lowest custom rates on WhatsApp & Call for any city, village, or town!
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto mb-6 text-xs text-slate-700 text-left space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Route:</span><strong className="text-slate-900">{fromLocation} ➔ {toLocation} ({tripType})</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Schedule:</span><strong className="text-slate-900">{formattedDate} at {pickupTime}</strong></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCustomWhatsAppInquiry}
                className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2.5"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Inquire on WhatsApp</span>
              </button>

              <a
                href={`tel:${siteConfig?.phoneNumber || '+917837175090'}`}
                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Call Us: {siteConfig?.phoneNumber || '+91 78371 75090'}</span>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onModifySearch}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                ← Search a predefined city or airport
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatedFares.map((fare) => {
              const fleetInfo = getFleetDetails(fare.vehicleId);
              const seats = fare.seats || fleetInfo.seats || '4 Passengers';
              const chargedDistLabel = `${fare.billableKm || fare.distanceKm || 0} KM`;
              const extraRate = fare.extraKmRate || fare.ratePerKm || 12;
              const extraKmLabel = `₹${extraRate}/km`;

              return (
                <div 
                  key={fare.vehicleId}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 group hover:border-yellow-400/60"
                >
                  <div>
                    {/* Vehicle Image */}
                    <div className="h-40 w-full flex items-center justify-center mb-3 bg-gray-50 rounded-xl p-3">
                      <img 
                        src={fare.image || fleetInfo.image || '/assets/images/dzire.jpg'} 
                        alt={fare.vehicle}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = '/assets/images/dzire.jpg'; }}
                      />
                    </div>

                    {/* Vehicle Name */}
                    <h3 className="text-xl font-black text-slate-900 font-nexa text-center mb-2">
                      {fare.vehicle}
                    </h3>

                    {/* Capacity */}
                    <div className="flex items-center justify-center text-sm font-semibold text-slate-600 mb-4">
                      <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                      <span>{seats}</span>
                    </div>

                    {/* Info Box: Charged Distance & Extra Charge */}
                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-2 text-xs mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Charged Distance</span>
                        <span className="font-bold text-slate-900">{chargedDistLabel}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Extra Charge (per km)</span>
                        <span className="font-bold text-slate-900">{extraKmLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Fare</span>
                      <div className="text-2xl font-black font-nexa text-slate-950">
                        ₹{fare.estimatedTotal.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppBooking(fare)}
                      className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
}
