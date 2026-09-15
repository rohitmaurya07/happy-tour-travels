import React, { useState } from 'react';
import { Users, Luggage, Wind, Fuel, CheckCircle, ArrowRight, ShieldCheck, Calendar, Clock, Sparkles, CircleCheck, Tag } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function SearchResults({ searchParams, onModifySearch }) {
  const { fleet, pricingSettings, siteConfig } = useSiteData();
  const fleetData = fleet || [];

  if (!searchParams) return null;

  const { tripType, fromLocation, toLocation, departureDate, pickupTime, distanceKm } = searchParams;

  const [hourlyPackage, setHourlyPackage] = useState('8h'); // '4h' (40km) | '8h' (80km)

  const isRoundTrip = tripType === 'Round Trip';
  const isHourly = tripType === 'Hourly Rental';
  const isAirport = tripType === 'Airport';

  // Determine effective billable KMs based on trip type
  let effectiveDistance = 0;
  if (isHourly) {
    effectiveDistance = hourlyPackage === '4h' ? 40 : 80;
  } else if (isRoundTrip) {
    effectiveDistance = Math.round((distanceKm || 50) * 2);
  } else {
    // One Way or Airport
    effectiveDistance = Math.round(distanceKm || 50);
  }

  // Check if this route matches an Airport Override
  const findAirportOverride = () => {
    if (!pricingSettings?.airportOverrides || !Array.isArray(pricingSettings.airportOverrides)) return null;
    const dest = (toLocation || '').toLowerCase();
    const orig = (fromLocation || '').toLowerCase();

    return pricingSettings.airportOverrides.find(override => {
      const kw = (override.routeKeyword || override.name || '').toLowerCase();
      if (!kw) return false;
      return dest.includes(kw) || orig.includes(kw);
    });
  };

  const matchedAirportOverride = findAirportOverride();

  // Calculate pricing strictly based on rates for each vehicle
  const getVehiclePricing = (vehicle) => {
    let ratePerKm = isRoundTrip ? vehicle.roundTripRate : vehicle.oneWayRate;
    let baseFare = 0;
    let postKmRateStr = '';
    let distanceDisplay = '';
    let slabBadge = null;
    let isOverrideApplied = false;
    let inclusionsText = pricingSettings?.termsAndConditions || 'State Taxes, Toll Taxes, Fuel & Driver Allowance Included';

    const slabs = vehicle.slabs || {
      minKm: 20,
      slab20_35: vehicle.oneWayRate * 35,
      slab35_55: vehicle.oneWayRate * 55,
      slab55_75: vehicle.oneWayRate * 75,
      slab75_95: vehicle.oneWayRate * 95,
      slab95Base: vehicle.oneWayRate * 95,
      post95Rate: vehicle.oneWayRate
    };

    if (isHourly) {
      if (hourlyPackage === '4h') {
        baseFare = vehicle.localPackages?.fourHours || Math.round(40 * vehicle.oneWayRate);
        postKmRateStr = `₹${vehicle.oneWayRate}/km post 40 km`;
        distanceDisplay = '40 KMs (4 Hrs Local Package)';
        slabBadge = '4 Hrs / 40 KM Local';
      } else {
        baseFare = vehicle.localPackages?.eightHours || (vehicle.hourlyRate || Math.round(80 * vehicle.oneWayRate));
        postKmRateStr = `₹${vehicle.oneWayRate}/km post 80 km`;
        distanceDisplay = '80 KMs (8 Hrs Local Package)';
        slabBadge = '8 Hrs / 80 KM Local';
      }
      inclusionsText = 'Chauffeur Allowance & Fuel Included. Toll & Parking as actual.';
    } else if (isRoundTrip) {
      // Round Trip based strictly on round-trip per-km rate & total 2-way distance
      baseFare = Math.round(effectiveDistance * vehicle.roundTripRate);
      postKmRateStr = `₹${vehicle.roundTripRate}/km for extra kms`;
      distanceDisplay = `${effectiveDistance} KMs Total (${distanceKm || 0} km × 2 sides)`;
      slabBadge = `Round Trip @ ₹${vehicle.roundTripRate}/km`;
      inclusionsText = 'State Taxes, Toll Taxes, Driver Allowance & Fuel Included';
    } else {
      // Check Airport Override first if destination or origin is an airport
      if (matchedAirportOverride && matchedAirportOverride.rates && matchedAirportOverride.rates[vehicle.id]) {
        baseFare = Number(matchedAirportOverride.rates[vehicle.id]);
        postKmRateStr = `₹${slabs.post95Rate || vehicle.oneWayRate}/km for route detour`;
        distanceDisplay = `${effectiveDistance} KMs (${matchedAirportOverride.name || 'Airport'} Direct Transfer)`;
        slabBadge = 'Special Airport Rate';
        isOverrideApplied = true;
        inclusionsText = 'Airport Toll Taxes, State Taxes, Fuel & Driver Allowance Included';
      } else {
        // Multi-tiered distance slab pricing for One Way and Airport routes
        const d = effectiveDistance;
        const postRate = slabs.post95Rate || vehicle.oneWayRate;

        if (d < 20) {
          baseFare = slabs.slab20_35;
          distanceDisplay = `${d} KMs (Below 20 km Min. Charge)`;
          postKmRateStr = `₹${postRate}/km post slab`;
          slabBadge = 'Below 20 km (Min Rate)';
        } else if (d >= 20 && d < 35) {
          baseFare = slabs.slab20_35;
          distanceDisplay = `${d} KMs (20–35 KM Slab)`;
          postKmRateStr = `₹${postRate}/km post slab`;
          slabBadge = '20–35 KM Slab';
        } else if (d >= 35 && d < 55) {
          baseFare = slabs.slab35_55;
          distanceDisplay = `${d} KMs (35–55 KM Slab)`;
          postKmRateStr = `₹${postRate}/km post slab`;
          slabBadge = '35–55 KM Slab';
        } else if (d >= 55 && d < 75) {
          baseFare = slabs.slab55_75;
          distanceDisplay = `${d} KMs (55–75 KM Slab)`;
          postKmRateStr = `₹${postRate}/km post slab`;
          slabBadge = '55–75 KM Slab';
        } else if (d >= 75 && d < 95) {
          baseFare = slabs.slab75_95;
          distanceDisplay = `${d} KMs (75–95 KM Slab)`;
          postKmRateStr = `₹${postRate}/km post slab`;
          slabBadge = '75–95 KM Slab';
        } else {
          // 95 km and above
          const extraKm = Math.max(0, d - 95);
          baseFare = slabs.slab95Base + (extraKm * postRate);
          distanceDisplay = `${d} KMs (₹${slabs.slab95Base.toLocaleString('en-IN')} base 95km + ${extraKm} km × ₹${postRate}/km)`;
          postKmRateStr = `₹${postRate}/km additional`;
          slabBadge = `Above 95 km (+₹${postRate}/km)`;
        }

        inclusionsText = isAirport 
          ? 'Airport Toll Taxes, State Taxes, Fuel & Driver Allowance Included'
          : 'State Taxes, Toll Taxes, Driver Allowance & Fuel Included';
      }
    }

    return {
      baseFare,
      ratePerKm,
      effectiveDistance,
      postKmRateStr,
      distanceDisplay,
      slabBadge,
      isOverrideApplied,
      inclusionsText,
      formattedFare: `₹${baseFare.toLocaleString('en-IN')}`,
    };
  };

  const formattedDate = departureDate ? new Date(departureDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Today';

  const handleBookVehicle = (vehicle) => {
    const pricing = getVehiclePricing(vehicle);
    const destination = isHourly ? `Local City Rental (${hourlyPackage === '4h' ? '4 Hrs / 40 Kms' : '8 Hrs / 80 Kms'})` : toLocation;

    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I want to book a taxi.

🚖 *Booking Request Details:*
• *Trip Type:* ${tripType} ${isHourly ? `(${hourlyPackage === '4h' ? '4 Hrs / 40 KM' : '8 Hrs / 80 KM'})` : ''}
• *From:* ${fromLocation}
• *To:* ${destination}
• *Schedule:* ${formattedDate} at ${pickupTime}
• *Total Distance / Package:* ${pricing.distanceDisplay}

🚘 *Selected Cab:* ${vehicle.name} (${vehicle.category})
💰 *Estimated Fare:* ${pricing.formattedFare}
⚡ *Tariff Details:* ${pricing.slabBadge ? pricing.slabBadge + ' • ' : ''}${pricing.postKmRateStr}
✅ *Inclusions:* ${pricing.inclusionsText}

Please confirm cab availability and driver assignment.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  return (
    <div id="search-results" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Route & Search Summary Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Available Cabs & Guaranteed Rates</span>
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

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 font-medium mt-2">
              <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-yellow-400 font-bold">
                {tripType}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {pickupTime}
              </span>
              {effectiveDistance > 0 && !isHourly && (
                <span className="bg-emerald-950/80 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-800/80 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Total: {effectiveDistance} KMs
                </span>
              )}
            </div>

            {/* If Hourly Rental: Package Selection Switcher */}
            {isHourly && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-300">Local Package:</span>
                <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setHourlyPackage('4h')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      hourlyPackage === '4h' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    4 Hours / 40 KM
                  </button>
                  <button
                    onClick={() => setHourlyPackage('8h')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      hourlyPackage === '8h' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    8 Hours / 80 KM (Full Day)
                  </button>
                </div>
              </div>
            )}
          </div>

          {onModifySearch && (
            <button
              onClick={onModifySearch}
              className="bg-slate-800 hover:bg-slate-700 text-yellow-400 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-slate-700 whitespace-nowrap shadow-md self-stretch sm:self-auto text-center"
            >
              Modify Search
            </button>
          )}
        </div>
      </div>

      {/* Tax & Toll Guaranteed Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 mb-8 flex items-center space-x-3 text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p className="text-xs sm:text-sm font-bold leading-tight">
          Transparent Guaranteed Fares: All quotes below <span className="text-emerald-700 underline font-extrabold">{isHourly ? 'include Chauffeur Allowance & Fuel' : 'include State Taxes, Highway Toll Taxes & Driver Allowance'}</span>. No hidden surprises!
        </p>
      </div>

      {/* Vehicle Cards List */}
      <div className="space-y-6 lg:space-y-8">
        {fleetData.map((vehicle) => {
          const pricing = getVehiclePricing(vehicle);

          return (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* TOP SECTION: Big Car Image on Left + Main Information & Price on Right */}
              <div className="flex flex-row items-center p-3 sm:p-6 gap-3 sm:gap-6 border-b border-gray-100">
                
                {/* Left: BIG Vehicle Image Box */}
                <div className="w-1/2 sm:w-5/12 md:w-80 lg:w-96 bg-gradient-to-b from-gray-100/90 to-gray-50/70 p-2 sm:p-4 rounded-2xl flex flex-col items-center justify-center relative flex-shrink-0 min-h-[140px] sm:min-h-[190px] md:min-h-[220px]">
                  <span className="absolute top-2 left-2 bg-slate-950 text-yellow-400 font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm z-10">
                    {vehicle.tag}
                  </span>
                  
                  <img
                    src={vehicle.image}
                    alt={vehicle.altText}
                    loading="lazy"
                    className="w-full h-auto max-h-32 sm:max-h-44 md:max-h-52 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md py-1"
                  />

                  <span className="text-[10px] text-gray-500 font-bold mt-1 text-center hidden sm:block">
                    {vehicle.category}
                  </span>
                </div>

                {/* Right: Main Information, Fare & WhatsApp Button */}
                <div className="w-1/2 sm:w-7/12 md:flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-wider block">
                        {vehicle.category}
                      </span>
                      {pricing.slabBadge && (
                        <span className="bg-yellow-100 text-yellow-900 border border-yellow-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Tag className="w-3 h-3 text-yellow-700 mr-1 inline" />
                          <span>{pricing.slabBadge}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold font-heading text-slate-900 leading-tight mt-0.5">
                      {vehicle.name}
                    </h2>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold text-slate-700">
                      <span className="bg-gray-100 px-2 sm:px-2.5 py-1 rounded-lg flex items-center">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-yellow-600 flex-shrink-0" />
                        {vehicle.seats}
                      </span>
                      <span className="bg-gray-100 px-2 sm:px-2.5 py-1 rounded-lg flex items-center">
                        <Luggage className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-yellow-600 flex-shrink-0" />
                        {vehicle.luggage}
                      </span>
                      <span className="bg-gray-100 px-2 sm:px-2.5 py-1 rounded-lg hidden sm:flex items-center">
                        <Wind className="w-3.5 h-3.5 mr-1 text-blue-500 flex-shrink-0" />
                        {vehicle.ac}
                      </span>
                      <span className="bg-gray-100 px-2 sm:px-2.5 py-1 rounded-lg hidden sm:flex items-center">
                        <Fuel className="w-3.5 h-3.5 mr-1 text-amber-500 flex-shrink-0" />
                        {vehicle.fuel}
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="mt-3 sm:mt-4">
                      <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 font-heading leading-tight">
                        {pricing.formattedFare}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-semibold block">
                        Estimated Total Price ({pricing.distanceDisplay})
                      </span>
                    </div>
                  </div>

                  {/* Primary WhatsApp Action */}
                  <div className="mt-3 sm:mt-4">
                    <button
                      onClick={() => handleBookVehicle(vehicle)}
                      className="w-full sm:w-auto yellow-gradient-btn px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <span>🟢 Book Now</span>
                      <CircleCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: Extra Information (Full Width) */}
              <div className="bg-gray-50/80 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs">
                
                {/* Distance & Extra KMS Rate */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-700">
                  <div className="font-medium">
                    <strong className="text-slate-900">Tariff Structure:</strong> {pricing.distanceDisplay}
                  </div>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="font-medium">
                    <strong className="text-slate-900">Post Limit Rate:</strong>{' '}
                    <span className="text-amber-700 font-bold">{pricing.postKmRateStr}</span>
                  </div>
                </div>

                {/* Inclusions Badge */}
                <div className="text-[11px] sm:text-xs font-bold text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{pricing.inclusionsText}</span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
