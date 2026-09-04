import React from 'react';
import { Users, Luggage, Wind, Fuel, MessageCircle, CheckCircle, Car, ArrowRight, ShieldCheck, Tag, Info, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { fleetData } from '../data/fleet';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function SearchResults({ searchParams, onModifySearch }) {
  if (!searchParams) return null;

  const { tripType, fromLocation, toLocation, departureDate, pickupTime, distanceKm } = searchParams;

  // Calculate billable distance (One way vs Round trip)
  const isRoundTrip = tripType === 'Round Trip';
  const effectiveDistance = isRoundTrip ? Math.max((distanceKm || 0) * 2, 250) : (distanceKm || 0);

  // Helper to calculate estimated fare and post km rate for each vehicle
  const getVehiclePricing = (vehicle) => {
    let baseFare = 0;
    let ratePerKm = 0;
    let postKmRateStr = '';
    let distanceDisplay = '';
    let inclusionsText = 'Includes State Taxes, Toll Taxes, Driver Allowance & Fuel';

    if (tripType === 'Hourly Rental') {
      baseFare = vehicle.hourlyRate || 2100;
      ratePerKm = vehicle.oneWayRate;
      postKmRateStr = `₹${ratePerKm}/km post 80 km`;
      distanceDisplay = '8 Hrs / 80 Kms Package';
      inclusionsText = 'Includes Fuel & Driver Allowance. Toll/Parking as actual.';
    } else if (tripType === 'Airport') {
      baseFare = vehicle.airportFixedRate || 2499;
      ratePerKm = vehicle.oneWayRate;
      postKmRateStr = `₹${ratePerKm}/km post base distance`;
      distanceDisplay = `${distanceKm || 90} km estimated`;
      inclusionsText = 'Includes Airport Parking, Toll Taxes & State Taxes';
    } else if (isRoundTrip) {
      ratePerKm = vehicle.roundTripRate;
      baseFare = Math.round(effectiveDistance * ratePerKm);
      postKmRateStr = `₹${ratePerKm}/km for extra kms`;
      distanceDisplay = `${effectiveDistance} km total (${distanceKm || 0} km × 2 sides)`;
      inclusionsText = 'Includes State Taxes, Toll Taxes, Driver Allowance & Fuel';
    } else {
      // One Way
      ratePerKm = vehicle.oneWayRate;
      baseFare = Math.round(effectiveDistance * ratePerKm);
      postKmRateStr = `₹${ratePerKm}/km for extra kms`;
      distanceDisplay = `${effectiveDistance} km (One Way)`;
      inclusionsText = 'Includes State Taxes, Toll Taxes, Driver Allowance & Fuel';
    }

    return {
      baseFare,
      ratePerKm,
      postKmRateStr,
      distanceDisplay,
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
    const destination = tripType === 'Hourly Rental' ? 'Local City Rental' : toLocation;

    const message = `Hello Happy Tour & Travels, I want to book a taxi.

🚖 *Booking Request Details:*
• *Trip Type:* ${tripType}
• *From:* ${fromLocation}
• *To:* ${destination}
• *Schedule:* ${formattedDate} at ${pickupTime}
• *Total Distance:* ${pricing.distanceDisplay}

🚘 *Selected Cab:* ${vehicle.name} (${vehicle.category})
💰 *Estimated Fare:* ${pricing.formattedFare}
⚡ *Post KM Rate:* ${pricing.postKmRateStr}
✅ *Inclusions:* State Taxes & Toll Taxes Included

Please confirm cab availability and driver assignment.`;

    bookOnWhatsApp(message);
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
              <span>Available Cabs & Instant Fares</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-nexa font-heading text-white flex flex-wrap items-center gap-2">
              <span>{fromLocation}</span>
              {tripType !== 'Hourly Rental' && (
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
              {effectiveDistance > 0 && (
                <span className="bg-emerald-950/80 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-800/80 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Total: {effectiveDistance} KMs
                </span>
              )}
            </div>
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
          Transparent All-Inclusive Fares: All quotes below <span className="text-emerald-700 underline font-extrabold">include State Taxes, Highway Toll Taxes & Driver Allowance</span>. No hidden surprises!
        </p>
      </div>

      {/* Vehicle Cards List / Grid (Mobile: Image on Left, Details & Price on Right) */}
      <div className="space-y-5 lg:space-y-6">
        {fleetData.map((vehicle) => {
          const pricing = getVehiclePricing(vehicle);

          return (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              {/* Flex Container: Mobile is Row (Image Left, Info Right); Desktop is clean horizontal card */}
              <div className="flex flex-row items-stretch">
                
                {/* Left Side: Vehicle Image (Mobile: ~35-40% width; Desktop: ~260px) */}
                <div className="w-2/5 sm:w-1/3 md:w-64 bg-gradient-to-b from-gray-100 to-gray-50 p-2 sm:p-4 flex flex-col items-center justify-center relative border-r border-gray-100 flex-shrink-0">
                  <img
                    src={vehicle.image}
                    alt={vehicle.altText}
                    loading="lazy"
                    className="max-h-24 sm:max-h-36 md:max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                  <span className="mt-1 sm:mt-2 bg-slate-950 text-yellow-400 font-extrabold text-[9px] sm:text-[11px] uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-center">
                    {vehicle.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold mt-1 text-center hidden sm:block">
                    {vehicle.category}
                  </span>
                </div>

                {/* Right Side: Details, Pricing, Inclusions, and WhatsApp CTA */}
                <div className="w-3/5 sm:w-2/3 md:flex-grow p-3.5 sm:p-5 flex flex-col justify-between">
                  
                  {/* Top: Name & Specs */}
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <div>
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold font-heading text-slate-900 leading-tight">
                          {vehicle.name}
                        </h2>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase sm:hidden block">
                          {vehicle.category}
                        </span>
                      </div>

                      {/* Estimated Price Block (Desktop & Mobile) */}
                      <div className="text-right">
                        <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-950 font-heading leading-tight">
                          {pricing.formattedFare}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-semibold block">
                          Estimated Total Fare
                        </span>
                      </div>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mt-2.5 text-[10px] sm:text-xs font-semibold text-slate-700">
                      <span className="bg-gray-100 px-2 py-1 rounded-lg flex items-center">
                        <Users className="w-3 h-3 mr-1 text-yellow-600" />
                        {vehicle.seats}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-lg flex items-center">
                        <Luggage className="w-3 h-3 mr-1 text-yellow-600" />
                        {vehicle.luggage}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-lg hidden sm:flex items-center">
                        <Wind className="w-3 h-3 mr-1 text-blue-500" />
                        {vehicle.ac}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-lg hidden sm:flex items-center">
                        <Fuel className="w-3 h-3 mr-1 text-amber-500" />
                        {vehicle.fuel}
                      </span>
                    </div>

                    {/* Distance & Post KMS Rate Info */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-[11px] sm:text-xs">
                      <div className="text-slate-700 font-medium">
                        <strong className="text-slate-900">Total KMS:</strong> {pricing.distanceDisplay}
                      </div>
                      <div className="text-slate-700 font-medium">
                        <strong className="text-slate-900">Post KM Rate:</strong>{' '}
                        <span className="text-amber-700 font-bold">{pricing.postKmRateStr}</span>
                      </div>
                    </div>

                    {/* Inclusions Badge */}
                    <div className="mt-2 text-[10px] sm:text-xs font-bold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                      <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{pricing.inclusionsText}</span>
                    </div>
                  </div>

                  {/* Bottom: Book on WhatsApp CTA */}
                  <div className="mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="hidden md:block text-[11px] text-gray-500 font-medium">
                      Instant Booking • No Advance Cancellation Fee • Verified Chauffeur
                    </div>
                    <button
                      onClick={() => handleBookVehicle(vehicle)}
                      className="w-full md:w-auto yellow-gradient-btn px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                      <span>Book on WhatsApp</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
