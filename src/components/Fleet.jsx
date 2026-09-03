import React from 'react';
import { Users, Luggage, Wind, Fuel, MessageCircle, Shield } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { fleetData } from '../data/fleet';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Fleet() {
  const handleVehicleBooking = (vehicle) => {
    const message = `Hello, I am interested in booking a ${vehicle.name}.

Vehicle: ${vehicle.name} (${vehicle.category})
Seating Capacity: ${vehicle.seats}

Please share availability, pricing and details.`;
    bookOnWhatsApp(message);
  };

  return (
    <section id="fleet" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            Clean, Comfortable & Well-Maintained Cabs
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            Our Premium Fleet
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">
            Choose from economic sedans, luxury executive cars, spacious family MUVs, and tempo travellers for all your outstation trips from Jalandhar.
          </p>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleetData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2"
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
                  <span className="absolute top-4 left-4 bg-slate-900 text-yellow-400 font-nexa text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
                    {vehicle.tag}
                  </span>

                  <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs px-3 py-1 rounded-full border border-gray-200">
                    {vehicle.ratesHint}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {vehicle.category}
                  </span>

                  <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">
                    {vehicle.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                    {vehicle.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs font-semibold text-slate-700 mb-6">
                    <div className="flex items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Users className="w-4 h-4 mr-2 text-brand-gold flex-shrink-0" />
                      <span>{vehicle.seats}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Luggage className="w-4 h-4 mr-2 text-brand-gold flex-shrink-0" />
                      <span>{vehicle.luggage}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Wind className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>{vehicle.ac}</span>
                    </div>

                    <div className="flex items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Fuel className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                      <span>{vehicle.fuel}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Book Vehicle CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => handleVehicleBooking(vehicle)}
                  className="w-full yellow-gradient-btn py-3.5 rounded-2xl text-slate-950 font-nexa text-sm flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Book This Vehicle</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Safety & Hygiene Guarantee Banner */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-400/20 text-brand-gold flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">
                All Vehicles Are Clean, Insured & Commercial Registered
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                Yellow plate commercial tourist taxis with experienced, polite, English/Hindi/Punjabi speaking hill-expert drivers.
              </p>
            </div>
          </div>
          <button
            onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about customized fleet options for a trip.`)}
            className="yellow-gradient-btn px-6 py-3 rounded-full text-slate-950 font-bold text-sm flex items-center space-x-2 whitespace-nowrap shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
            <span>Inquire Fleet Pricing</span>
          </button>
        </div>

      </div>
    </section>
  );
}
