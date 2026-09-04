import React, { useState } from 'react';
import { Users, Wind, ShieldCheck, Clock, Navigation, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function LocalTaxiRates() {
  const [selectedDuration, setSelectedDuration] = useState('all'); // 'all' | '4h' | '8h'

  const localTaxiVehicles = [
    {
      id: "fortuner",
      name: "TOYOTA FORTUNER AUTOMATIC",
      rankBadge: "🥇 1",
      seats: "6–7 Seater",
      features: "AC • Premium SUV",
      type: "Automatic Premium SUV",
      image: "/assets/images/fortuner.png",
      rate4h: "₹2,000",
      rate4hNum: 2000,
      rate8h: "₹5,000",
      rate8hNum: 5000,
      tag: "🥇 Top Luxury SUV",
      desc: "Commanding 6–7 seater automatic SUV for VIP city travel, luxury weddings, business meetings, and local sightseeing in utmost style.",
    },
    {
      id: "innova",
      name: "TOYOTA INNOVA CRYSTA",
      rankBadge: "🥈 2",
      seats: "7–8 Seater",
      features: "AC • Premium Family Car",
      type: "Premium Family MUV",
      image: "/assets/images/innova.png",
      rate4h: "₹1,800",
      rate4hNum: 1800,
      rate8h: "₹3,000",
      rate8hNum: 3000,
      tag: "🥈 Premium Family",
      desc: "Plush 7–8 seater luxury vehicle offering unmatched legroom, supreme comfort, and luggage space for family city visits and local events.",
    },
    {
      id: "ertiga",
      name: "MARUTI SUZUKI ERTIGA",
      rankBadge: "🥉 3",
      seats: "6–7 Seater",
      features: "AC • Family Car",
      type: "Spacious Family MUV",
      image: "/assets/images/ertiga.png",
      rate4h: "₹1,500",
      rate4hNum: 1500,
      rate8h: "₹2,300",
      rate8hNum: 2300,
      tag: "🥉 Family Car",
      desc: "Budget-friendly 6–7 seater family car with dual AC, ideal for local shopping, family hospital visits, and local sightseeing.",
    },
    {
      id: "verna",
      name: "HYUNDAI VERNA",
      rankBadge: "4",
      seats: "4 Seater",
      features: "AC • Comfortable Sedan",
      type: "Executive Sedan",
      image: "/assets/images/verna.png",
      rate4h: "₹1,200",
      rate4hNum: 1200,
      rate8h: "₹2,000",
      rate8hNum: 2000,
      tag: "Executive Sedan",
      desc: "Premium 4-seater executive sedan with automatic climate control, plush ride quality for business meetings, and executive city transfers.",
    },
    {
      id: "dzire",
      name: "MARUTI SUZUKI DZIRE",
      rankBadge: "5",
      seats: "4 Seater",
      features: "AC • Budget Sedan",
      type: "Economy Sedan",
      image: "/assets/images/dzire.jpg",
      rate4h: "₹1,000",
      rate4hNum: 1000,
      rate8h: "₹1,500",
      rate8hNum: 1500,
      tag: "Budget Sedan",
      desc: "Most economical 4-seater city cab with quick pickup, smooth AC comfort, and reliable drivers for short and full-day city commutes.",
    }
  ];

  const handleBookLocalTaxi = (vehicle, duration = '8 Hours / 80 KM') => {
    const fare = duration === '4 Hours / 40 KM' ? vehicle.rate4h : vehicle.rate8h;
    const msg = `Hello ${siteConfig.businessName}, I want to book Local Taxi Rental.

🚖 *Local Taxi Booking Details:*
• *Vehicle:* ${vehicle.name}
• *Seating:* ${vehicle.seats}
• *Package:* ${duration}
• *Tariff Rate:* ${fare}
• *Inclusions:* AC, Fuel & Chauffeur Included

Please confirm cab availability.`;

    bookOnWhatsApp(msg);
  };

  return (
    <section id="local-taxi-rates" className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30 inline-flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Local City Hourly Packages</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            Local Taxi Rental Rates
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium">
            Affordable hourly packages for city commutes, shopping, weddings, business meetings, and local sightseeing.
          </p>

          {/* Duration Filter Switcher */}
          <div className="mt-8 inline-flex p-1.5 bg-gray-100 rounded-full border border-gray-200">
            <button
              onClick={() => setSelectedDuration('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedDuration === 'all'
                  ? 'bg-slate-950 text-yellow-400 shadow-md'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setSelectedDuration('4h')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedDuration === '4h'
                  ? 'bg-slate-950 text-yellow-400 shadow-md'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              4 Hours / 40 KM
            </button>
            <button
              onClick={() => setSelectedDuration('8h')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedDuration === '8h'
                  ? 'bg-slate-950 text-yellow-400 shadow-md'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              8 Hours / 80 KM
            </button>
          </div>
        </div>

        {/* Local Taxi Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localTaxiVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200/90 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                {/* Vehicle Image Container */}
                <div className="relative h-60 bg-gradient-to-b from-slate-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />

                  {/* Rank Badge */}
                  <span className="absolute top-4 left-4 bg-slate-950 text-yellow-400 font-nexa text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md font-bold">
                    {vehicle.rankBadge}. {vehicle.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-nexa text-slate-900 font-heading">
                    {vehicle.name}
                  </h3>

                  {/* Features & Seating Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-slate-700">
                    <span className="bg-white px-3 py-1 rounded-lg border border-gray-200 flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-brand-gold flex-shrink-0" />
                      {vehicle.seats}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-lg border border-gray-200 flex items-center">
                      <Wind className="w-3.5 h-3.5 mr-1 text-blue-500 flex-shrink-0" />
                      {vehicle.features}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-3">
                    {vehicle.desc}
                  </p>

                  {/* Local Taxi Price Boxes */}
                  <div className="mt-5 space-y-2.5">
                    {/* 4 Hours / 40 KM Package */}
                    {(selectedDuration === 'all' || selectedDuration === '4h') && (
                      <div className="bg-white p-3 rounded-2xl border border-gray-200/90 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                            4 Hours / 40 KM
                          </span>
                          <span className="text-lg font-extrabold text-slate-950 font-heading">
                            {vehicle.rate4h}
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookLocalTaxi(vehicle, '4 Hours / 40 KM')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-sm transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                          <span>Book 4 Hrs</span>
                        </button>
                      </div>
                    )}

                    {/* 8 Hours / 80 KM Package */}
                    {(selectedDuration === 'all' || selectedDuration === '8h') && (
                      <div className="bg-white p-3 rounded-2xl border border-gray-200/90 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                            8 Hours / 80 KM (Full Day)
                          </span>
                          <span className="text-lg font-extrabold text-slate-950 font-heading">
                            {vehicle.rate8h}
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookLocalTaxi(vehicle, '8 Hours / 80 KM')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-sm transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                          <span>Book 8 Hrs</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Card Footer Master Book CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => handleBookLocalTaxi(vehicle, '8 Hours / 80 KM')}
                  className="w-full yellow-gradient-btn py-3 rounded-2xl text-slate-950 font-nexa text-xs font-bold flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>🟢 Book Now on WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Guaranteed Local Service Info */}
        <div className="mt-12 bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-brand-gold flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 font-heading">
                Transparent Local Rentals with Zero Extra Hidden Charges
              </h4>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Chauffeur allowance and fuel included in local hourly packages. Toll & parking as actuals.
              </p>
            </div>
          </div>
          <button
            onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about local city taxi rentals.`)}
            className="yellow-gradient-btn px-6 py-3 rounded-full text-slate-950 font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
            <span>Inquire Local Taxi</span>
          </button>
        </div>

      </div>
    </section>
  );
}
