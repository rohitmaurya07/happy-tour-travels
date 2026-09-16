import React, { useState, useEffect } from 'react';
import { 
  Users, Luggage, Wind, Fuel, CheckCircle, ArrowRight, ShieldCheck, 
  Calendar, Clock, Sparkles, CircleCheck, Tag, Mountain, Navigation, 
  HelpCircle, Receipt, AlertCircle, PhoneCall
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
          hourlyPackage
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
            const rate = isHill ? (v.hillRatePerKm || 11) : (v.plainRatePerKm || 10);
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

  const handleWhatsAppBooking = (fareItem) => {
    const destination = isHourly ? `Local City Rental (${hourlyPackage === '4h' ? '4 Hrs / 40 Kms' : '8 Hrs / 80 Kms'})` : toLocation;

    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book a taxi.

🚖 *Booking Details:*
• *From:* ${fromLocation}
• *To:* ${destination}
• *Trip Type:* ${tripType}
• *Route Type:* ${fareItem.routeType || 'PLAIN'} Area
• *Schedule:* ${formattedDate} at ${pickupTime}
• *Actual Distance:* ${fareItem.distanceKm} KM
• *Billable Distance:* ${fareItem.billableKm} KM (Min: ${fareItem.minimumKm} KM)

🚘 *Selected Vehicle:* ${fareItem.vehicle} (${fareItem.category})
💰 *Rate per KM:* ₹${fareItem.ratePerKm}/km
💵 *Base Fare:* ₹${fareItem.baseFare.toLocaleString('en-IN')}
👨‍✈️ *Driver Allowance:* ₹${fareItem.driverAllowance}
🏷️ *Estimated Total:* ₹${fareItem.estimatedTotal.toLocaleString('en-IN')}
ℹ️ *Tolls & Parking:* Payable at actuals

Please confirm cab availability and driver assignment.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const handleInstantBooking = async (fareItem) => {
    setIsSubmittingBooking(true);
    try {
      const booking = await createBookingApi({
        customerName: 'Online Guest',
        pickup: fromLocation,
        destination: toLocation,
        vehicleId: fareItem.vehicleId,
        tripType,
        departureDate,
        pickupTime,
        hourlyPackage: isHourly ? hourlyPackage : undefined
      });
      setBookingSuccessModal(booking);
    } catch (err) {
      alert(`Booking error: ${err.message}`);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const primaryRouteType = calculatedFares[0]?.routeType || 'PLAIN';

  return (
    <div id="search-results" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Route & Search Summary Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Transparent Data-Driven Pricing Engine</span>
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
                <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 font-bold px-3 py-1 rounded-lg">
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
                    hourlyPackage === '4h' ? 'bg-yellow-400 text-slate-950' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  4 Hrs / 40 KM
                </button>
                <button
                  type="button"
                  onClick={() => setHourlyPackage('8h')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    hourlyPackage === '8h' ? 'bg-yellow-400 text-slate-950' : 'text-gray-300 hover:text-white'
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
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            const isMinKmApplied = fare.billableKm > fare.distanceKm;

            return (
              <div 
                key={fare.vehicleId}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header & Vehicle Image */}
                  <div className="p-5 pb-3 bg-gradient-to-b from-gray-50 to-white relative">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-yellow-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                          {fare.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 font-nexa mt-1">
                          {fare.vehicle}
                        </h3>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        fare.routeType === 'HILL'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {fare.routeType} RATE
                      </span>
                    </div>

                    <div className="h-36 w-full flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-white p-2">
                      <img 
                        src={fare.image || '/assets/images/dzire.jpg'} 
                        alt={fare.vehicle}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = '/assets/images/dzire.jpg'; }}
                      />
                    </div>

                    {/* Specs Pills */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {fare.seats || '4 Seater'}
                      </span>
                      <span className="flex items-center">
                        <Fuel className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        AC Cab
                      </span>
                    </div>
                  </div>

                  {/* Fare Breakdown Table Section */}
                  <div className="p-5 pt-3 space-y-2.5 text-xs">
                    
                    {/* Rate per KM & Billable KM */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Applicable Rate:</span>
                        <span className="font-bold text-slate-900">
                          {fare.pricingType === 'fixed_route' ? 'Fixed Route Fare' : `₹${fare.ratePerKm}/km`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Distance:</span>
                        <span className="font-bold text-slate-700">{fare.distanceKm} km</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Billable Distance:</span>
                        <span className="font-bold text-slate-900">
                          {fare.billableKm} km {isMinKmApplied && <span className="text-[10px] text-amber-600 font-normal">(Min. {fare.minimumKm} km)</span>}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Fare Calculation Elements */}
                    <div className="space-y-1 pt-1 px-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Base Fare ({fare.billableKm} km × ₹{fare.ratePerKm})</span>
                        <span className="font-bold text-slate-800">₹{fare.baseFare.toLocaleString('en-IN')}</span>
                      </div>

                      {fare.driverAllowance > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Driver Allowance</span>
                          <span className="font-bold text-slate-800">₹{fare.driverAllowance}</span>
                        </div>
                      )}

                      {fare.nightCharges > 0 && (
                        <div className="flex justify-between text-indigo-600 font-medium">
                          <span>Night Surcharge (23:00–05:00)</span>
                          <span className="font-bold">₹{fare.nightCharges}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-500 text-[11px] pt-1">
                        <span>Toll & State Tax:</span>
                        <span className="font-semibold text-emerald-700">Actual Receipts</span>
                      </div>

                      <div className="flex justify-between text-gray-500 text-[11px]">
                        <span>Parking:</span>
                        <span className="font-semibold text-emerald-700">Actual Receipts</span>
                      </div>
                    </div>

                    {/* Total Estimated Price Highlight */}
                    <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estimated Fare</span>
                        <div className="text-2xl font-black font-nexa text-slate-950">
                          ₹{fare.estimatedTotal.toLocaleString('en-IN')}
                          <span className="text-xs font-medium text-gray-500 ml-1">+ Actuals</span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-bold border border-emerald-200">
                        Fuel Included
                      </span>
                    </div>

                  </div>
                </div>

                {/* Actions: WhatsApp + Instant Booking */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppBooking(fare)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmittingBooking}
                    onClick={() => handleInstantBooking(fare)}
                    className="w-full py-2.5 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>Instant Book</span>
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
