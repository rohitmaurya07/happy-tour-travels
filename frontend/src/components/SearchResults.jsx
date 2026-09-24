import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, ArrowRight, 
  Calendar, Clock, Tag, Mountain, 
  AlertCircle, PhoneCall
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { calculateAllFaresApi, createBookingApi } from '../services/api';

export default function SearchResults({ searchParams, onModifySearch }) {
  const { fleet, pricingSettings, siteConfig } = useSiteData();
  const [hourlyPackage, setHourlyPackage] = useState('8h'); // '4h' | '8h'
  const [calculatedFares, setCalculatedFares] = useState([]);
  const [isLoadingFares, setIsLoadingFares] = useState(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

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
          hourlyPackage,
          distanceKm: Number(distanceKm) > 0 ? Number(distanceKm) : undefined
        });

        if (isMounted && response?.results) {
          setCalculatedFares(response.results);
        }
      } catch (err) {
        console.warn('Could not fetch server fares, falling back to dynamic fleet preview:', err.message);
        // Fallback local calculations if server unreachable
        if (isMounted && fleet) {
          const fallback = fleet.filter(v => v.active !== false).map(v => {
            const isHill = ['shimla', 'manali', 'dharamshala', 'dalhousie', 'kullu', 'kasol', 'kasauli'].some(h => 
              (toLocation || '').toLowerCase().includes(h)
            );
            const routeType = isHill ? 'HILL' : 'PLAIN';
            const rate = isHill ? (v.hillRatePerKm || 14) : (v.plainRatePerKm || 11);
            const dist = distanceKm || 100;
            const minKm = v.minimumKm || 250;
            const effDist = isRoundTrip ? dist * 2 : dist;
            const billable = Math.max(effDist, isRoundTrip ? minKm * 2 : minKm);
            const baseFare = billable * rate;
            const driverAllowance = v.driverAllowance || 300;
            return {
              vehicle: v.name,
              vehicleId: v.id,
              category: v.category,
              seats: v.seats,
              image: v.image,
              pickup: fromLocation,
              destination: toLocation,
              tripType,
              routeType,
              pricingType: 'per_km',
              pricingRuleApplied: `${routeType} Area Rate (₹${rate}/km)`,
              distanceKm: dist,
              minimumKm: minKm,
              billableKm: billable,
              ratePerKm: rate,
              extraKmRate: v.extraKmRate || rate,
              baseFare,
              driverAllowance,
              nightCharges: 0,
              additionalCharges: {
                driverAllowance,
                toll: 'actual',
                parking: 'actual',
                stateTax: 'actual'
              },
              estimatedTotal: baseFare + driverAllowance,
              inclusions: ['Driver Allowance Included', 'Highway Fuel Included', 'Toll & Parking at actuals']
            };
          });
          setCalculatedFares(fallback);
        }
      } finally {
        if (isMounted) setIsLoadingFares(false);
      }
    };

    fetchServerFares();

    return () => {
      isMounted = false;
    };
  }, [fromLocation, toLocation, tripType, departureDate, pickupTime, hourlyPackage, distanceKm, fleet]);

  const formattedDate = departureDate ? new Date(departureDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Today';

  const getFleetDetails = (vehicleId) => {
    return fleet?.find(f => f.id === vehicleId) || {};
  };

  const getPackageLabel = (fare) => {
    if (isHourly) {
      return hourlyPackage === '4h' ? '4 Hrs / 40 KM' : '8 Hrs / 80 KM';
    }
    if (fare.pricingType === 'local_slab') {
      return 'Local Slab';
    }
    if (fare.pricingType === 'round_trip') {
      return 'Round Trip';
    }
    if (fare.pricingType === 'fixed_route') {
      return 'Fixed Route';
    }
    return tripType || 'One Way';
  };

  const getChargedDistanceLabel = (fare) => {
    if (isHourly) {
      const inc = hourlyPackage === '4h' ? 40 : 80;
      return `${inc} KM Included`;
    }
    if (fare.pricingType === 'local_slab' && fare.appliedSlab) {
      return `${fare.appliedSlab} Slab`;
    }
    if (fare.billableKm > fare.distanceKm) {
      return `${fare.billableKm} KM (Min ${fare.minimumKm} KM)`;
    }
    return `${fare.billableKm} KM Charged`;
  };

  const getExtraKmRateLabel = (fare) => {
    if (isHourly) {
      const inc = hourlyPackage === '4h' ? 40 : 80;
      const rate = fare.extraKmRate || fare.ratePerKm || 12;
      return `₹${rate}/km after ${inc} km`;
    }
    if (fare.pricingType === 'long_distance') {
      const startKm = fare.pricingSnapshot?.longDistanceConfig?.startAfterKm || 95;
      return `₹${fare.ratePerKm}/km after ${startKm} km`;
    }
    if (fare.pricingType === 'local_slab') {
      const rate = fare.extraKmRate || fare.ratePerKm || 12;
      return `₹${rate}/km after 95 km`;
    }
    if (fare.pricingType === 'round_trip') {
      return `₹${fare.ratePerKm}/km`;
    }
    if (fare.pricingType === 'fixed_route') {
      return `₹${fare.extraKmRate || fare.ratePerKm}/km extra`;
    }
    return `₹${fare.ratePerKm}/km`;
  };

  const handleWhatsAppBooking = (fareItem) => {
    const destination = isHourly ? `Local City Rental (${hourlyPackage === '4h' ? '4 Hrs / 40 Kms' : '8 Hrs / 80 Kms'})` : toLocation;
    const fleetInfo = getFleetDetails(fareItem.vehicleId);

    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book a taxi.

*Booking Details:*
- From: ${fromLocation}
- To: ${destination}
- Trip Type: ${tripType}
- Package: ${getPackageLabel(fareItem)}
- Schedule: ${formattedDate} at ${pickupTime}
- Charged Distance: ${getChargedDistanceLabel(fareItem)}
- Extra KM Rate: ${getExtraKmRateLabel(fareItem)}

*Selected Vehicle:*
- Vehicle: ${fareItem.vehicle} (${fareItem.category})
- Capacity: ${fareItem.seats || fleetInfo.seats || '4 Passengers'}, ${fleetInfo.luggage || '2-3 Bags'}

*Price Details (All-Inclusive):*
- Total Fare: ₹${fareItem.estimatedTotal.toLocaleString('en-IN')} (Fuel & Chauffeur Included)
- Tolls & Parking: Payable at actuals

Please confirm cab availability.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const primaryRouteType = calculatedFares[0]?.routeType || 'PLAIN';

  return (
    <div id="search-results" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Route & Search Summary Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-full text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Transparent Pricing Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-nexa font-heading text-white flex flex-wrap items-center gap-2">
              <span>{fromLocation}</span>
              {!isHourly && (
                <>
                  <ArrowRight className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <span>{toLocation}</span>
                </>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-300 mt-3">
              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {tripType}
              </span>

              {/* Route Classification Badge */}
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

              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {formattedDate}
              </span>
              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-yellow" />
                {pickupTime}
              </span>
              
              {!isHourly && (
                <span className="bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-bold px-3 py-1 rounded-lg">
                  Distance: {calculatedFares[0]?.distanceKm || distanceKm || 0} KM
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {isHourly && (
              <div className="bg-slate-900 border border-slate-700 p-1 rounded-xl flex items-center">
                <button
                  type="button"
                  onClick={() => setHourlyPackage('4h')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    hourlyPackage === '4h' ? 'bg-brand-yellow text-slate-950 shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  4 Hrs / 40 KM
                </button>
                <button
                  type="button"
                  onClick={() => setHourlyPackage('8h')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    hourlyPackage === '8h' ? 'bg-brand-yellow text-slate-950 shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  8 Hrs / 80 KM
                </button>
              </div>
            )}

            <button
              onClick={onModifySearch}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Modify Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cabs List Grid */}
      {isLoadingFares ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-700">Calculating authoritative pricing & terrain rates...</p>
        </div>
      ) : calculatedFares.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Cabs Available</h3>
          <p className="text-xs text-gray-500 mt-1">Please try modifying your pickup or destination.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatedFares.map((fare) => {
            const fleetInfo = getFleetDetails(fare.vehicleId);
            const seats = fare.seats || fleetInfo.seats || '4 Passengers';
            const chargedDistLabel = isHourly 
              ? (hourlyPackage === '4h' ? '40 KM Included' : '80 KM Included')
              : `${fare.billableKm || fare.distanceKm || 0} KM`;
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

                  {/* Clean Info Box: Charged Distance & Extra Charge (per kms) */}
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
      )}



      {/* Booking Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black font-nexa text-slate-900">Booking Confirmed!</h3>
            <p className="text-xs text-gray-500 mt-1">Reference: <strong className="text-slate-900">{bookingSuccessModal.id}</strong></p>

            <div className="bg-gray-50 p-4 rounded-2xl text-left my-5 text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Route:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.pickup} → {bookingSuccessModal.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.vehicleName} ({bookingSuccessModal.vehicleCategory})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terrain:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.routeType} Area</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Billable Distance:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.billableKm} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate:</span>
                <span className="font-bold text-slate-900">₹{bookingSuccessModal.ratePerKm}/km</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
                <span className="font-bold text-slate-700">Estimated Total:</span>
                <span className="font-black text-slate-950">₹{bookingSuccessModal.estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mb-6">
              Our dispatch team has received your booking and will assign your chauffeur shortly.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

