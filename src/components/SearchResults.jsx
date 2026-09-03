import React from 'react';
import { Users, Luggage, Wind, Fuel, MessageCircle, CheckCircle, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import { fleetData } from '../data/fleet';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function SearchResults({ searchParams, onResetSearch }) {
  if (!searchParams) return null;

  const { tripType, fromLocation, toLocation, departureDate, pickupTime, distanceKm } = searchParams;

  // Per‑km rates for each vehicle (in INR)
  const perKmRate = {
    dzire: 12,
    verna: 14,
    ertiga: 15,
    innova: 18,
    tempo: 25,
  };

  // Calculate realistic estimated fares based on vehicle & trip type
  const calculateFare = (vehicleId) => {
    if (tripType === 'Hourly Rental') {
      // Existing hourly rates (hard‑coded)
      switch (vehicleId) {
        case 'dzire':
          return '₹2,100 (8 Hrs / 80 Kms)';
        case 'verna':
          return '₹2,600 (8 Hrs / 80 Kms)';
        case 'ertiga':
          return '₹3,000 (8 Hrs / 80 Kms)';
        case 'innova':
          return '₹4,200 (8 Hrs / 80 Kms)';
        case 'tempo':
          return '₹5,500 (8 Hrs / 80 Kms)';
        default:
          return 'Contact for Custom Tariff';
      }
    }
    if (tripType === 'Airport') {
      switch (vehicleId) {
        case 'dzire':
          return '₹2,499 (Fixed Airport Drop)';
        case 'verna':
          return '₹2,999 (Fixed Airport Drop)';
        case 'ertiga':
          return '₹3,499 (Fixed Airport Drop)';
        case 'innova':
          return '₹4,999 (Fixed Airport Drop)';
        case 'tempo':
          return '₹6,999 (Fixed Airport Drop)';
        default:
          return 'Contact for Custom Tariff';
      }
    }
    // For normal trips, compute per‑km fare
    const rate = perKmRate[vehicleId] || 0;
    const fare = rate * (distanceKm ?? 0);
    return `₹${fare.toLocaleString()} (${distanceKm || 0} km)`;
  };

  const formattedDate = new Date(departureDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleBookVehicle = (vehicle) => {
    const estimatedFare = calculateFare(vehicle.id);
    const destination = tripType === 'Hourly Rental' ? 'Local Rental' : toLocation;

    const message = `Hello, I would like to book a ${vehicle.name} for my trip.

Trip Search Details:
• Trip Type: ${tripType}
• Pickup (From): ${fromLocation}
• Destination (To): ${destination}
• Departure Date: ${formattedDate}
• Pickup Time: ${pickupTime}

Selected Vehicle: ${vehicle.name} (${vehicle.category})
Estimated Fare: ${estimatedFare}

Please confirm vehicle availability and final fare details.`;

    bookOnWhatsApp(message);
  };

  return (
    <div id="search-results" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
      
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-yellow font-extrabold text-xs uppercase tracking-widest mb-2">
            <CheckCircle className="w-4 h-4 text-brand-yellow" />
            <span>Search Results & Available Vehicles</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Matching Cabs from {fromLocation} {tripType !== 'Hourly Rental' && `to ${toLocation}`}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1">
            Trip Type: <strong className="text-brand-yellow">{tripType}</strong> | Date: <strong className="text-white">{formattedDate}</strong> | Time: <strong className="text-white">{pickupTime}</strong>
          </p>
          {(distanceKm ?? 0) > 0 && (
            <p className="text-xs text-gray-300 mt-1">
              Distance: {distanceKm ?? 0} km
            </p>
          )}
        </div>

        <button
          onClick={onResetSearch}
          className="bg-slate-800 hover:bg-slate-700 text-gray-200 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-slate-700 whitespace-nowrap"
        >
          Modify Search
        </button>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fleetData.map((vehicle) => {
          const estimatedFare = calculateFare(vehicle.id);
          return (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2"
            >
              <div>
                {/* Vehicle Image Header */}
                <div className="relative h-64 w-full bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.altText}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-slate-900 text-yellow-400 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
                    {vehicle.tag}
                  </span>

                  {/* Estimated Price Badge */}
                  <div className="absolute bottom-4 right-4 bg-slate-950 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-yellow-400/40 shadow-lg flex items-center space-x-1">
                    <span className="text-yellow-400 font-bold">Est:</span>
                    <span>{estimatedFare}</span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {vehicle.category}
                  </span>

                  <h4 className="text-2xl font-bold text-slate-900 font-heading mb-2">
                    {vehicle.name}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium">
                    {vehicle.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-gray-100 text-xs font-semibold text-slate-700 mb-6">
                    <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-brand-gold flex-shrink-0" />
                      <span>{vehicle.seats}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <Luggage className="w-3.5 h-3.5 mr-1.5 text-brand-gold flex-shrink-0" />
                      <span>{vehicle.luggage}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <Wind className="w-3.5 h-3.5 mr-1.5 text-blue-500 flex-shrink-0" />
                      <span>{vehicle.ac}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <Fuel className="w-3.5 h-3.5 mr-1.5 text-amber-500 flex-shrink-0" />
                      <span>{vehicle.fuel}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Book on WhatsApp CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => handleBookVehicle(vehicle)}
                  className="w-full yellow-gradient-btn py-3.5 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
