import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, Navigation, Car, Mountain, Clock, 
  ArrowRight, MessageCircle, ShieldCheck, CheckCircle2, 
  Sparkles, ChevronRight, PhoneCall 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Services() {
  const { siteConfig } = useSiteData();
  const navigate = useNavigate();

  const coreServices = [
    {
      id: 'airport-transfers',
      title: 'Airport Transfer Services',
      tagline: 'DEL • ATQ • IXC Terminals',
      badge: '24/7 Airport Drops',
      icon: Plane,
      iconBg: 'from-amber-400 to-yellow-500',
      description: 'Punctual airport pickup and drop services for domestic and international flights with live terminal flight tracking.',
      features: [
        'Delhi IGI Airport (T1, T2, T3) Doorstep Drops',
        'Amritsar (ATQ) & Chandigarh (IXC) Transfers',
        'Luggage Assistance & Flight Delay Tracking',
        'Transparent Fixed All-Inclusive Fares'
      ],
      popularConnections: [
        { from: 'Punjab', to: 'Delhi Airport' },
        { from: 'Delhi Airport', to: 'Chandigarh' },
        { from: 'Jalandhar', to: 'Amritsar Airport' }
      ],
      searchType: 'Airport',
      defaultMessage: 'Hello Happy Tour & Travels, I want to book an Airport Transfer taxi. Please share cab options and fare details.'
    },
    {
      id: 'one-way-taxi',
      title: 'One-Way Intercity Cabs',
      tagline: 'Pay Only For One Side',
      badge: 'Save up to 40%',
      icon: Navigation,
      iconBg: 'from-yellow-400 to-amber-500',
      description: 'Affordable one-way intercity taxi on national highways without paying any return fare or unnecessary driver return charges.',
      features: [
        'Doorstep Pickup across All Punjab, Haryana & Delhi',
        'No Return Fare charged on Outstation Trips',
        'All Tolls & State Taxes assistance',
        'Dzire, Ertiga, Innova Crysta & Tempo'
      ],
      popularConnections: [
        { from: 'Jalandhar', to: 'Delhi NCR' },
        { from: 'Amritsar', to: 'Chandigarh' },
        { from: 'Ludhiana', to: 'Delhi Airport' }
      ],
      searchType: 'One Way',
      defaultMessage: 'Hello Happy Tour & Travels, I need a One-Way taxi quote for intercity travel. Please share available cars.'
    },
    {
      id: 'himachal-tours',
      title: 'Himachal & Hill Station Tours',
      tagline: 'Shimla • Manali • Dharamshala',
      badge: 'Expert Hill Drivers',
      icon: Mountain,
      iconBg: 'from-amber-500 to-yellow-400',
      description: 'Scenic customized holiday tour packages across Himachal Pradesh and Jammu & Kashmir with experienced mountain chauffeurs.',
      features: [
        'Custom Multi-Day Family & Group Itineraries',
        'Solang Valley, Rohtang, Atal Tunnel & Kasol',
        'Mountain-Tested Safe Vehicles (Innova & Tempo)',
        'Local Sightseeing & Hotel Point Drops'
      ],
      popularConnections: [
        { from: 'Chandigarh', to: 'Shimla' },
        { from: 'Delhi', to: 'Manali & Solang' },
        { from: 'Punjab', to: 'Dharamshala' }
      ],
      searchType: 'Round Trip',
      defaultMessage: 'Hello Happy Tour & Travels, I would like to inquire about Himachal Hill Tour packages. Please share itinerary and fare.'
    },
    {
      id: 'hourly-rentals',
      title: 'Local Hourly Car Rentals',
      tagline: '4 Hrs • 8 Hrs • 10 Hrs Packages',
      badge: 'Flexible City Travel',
      icon: Clock,
      iconBg: 'from-yellow-500 to-amber-400',
      description: 'Rent a dedicated chauffeur-driven car for shopping, business meetings, wedding functions, or local city errands.',
      features: [
        '4h/40km, 8h/80km & 10h/100km Packages',
        'Dzire, Ertiga and Innova Crysta Available',
        'Unlimited Stops within Booked City Hours',
        'Affordable Extra KM & Extra Hour Rates'
      ],
      popularConnections: [
        { from: 'Jalandhar', to: 'City Rental' },
        { from: 'Amritsar', to: 'Local Package' },
        { from: 'Chandigarh', to: 'Local Rental' }
      ],
      searchType: 'Hourly Rental',
      defaultMessage: 'Hello Happy Tour & Travels, I want to book an Hourly Local Car Rental package. Please share available options.'
    }
  ];

  const handleWhatsAppBooking = (service) => {
    bookOnWhatsApp(service.defaultMessage, siteConfig?.whatsappNumber);
  };

  const handleSearchAction = (service) => {
    // Navigate or trigger trip type selection on home
    const homeForm = document.getElementById('home');
    if (homeForm) {
      homeForm.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('selectTripType', { detail: service.searchType }));
    } else {
      navigate(`/?tripType=${encodeURIComponent(service.searchType)}`);
    }
  };

  return (
    <section id="services" className=" bg-[#F8FAFC] relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
         
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-think font-nexa text-slate-900 tracking-tight leading-tight">
            Our Core <span className="  decoration-yellow-400 decoration-wavy decoration-2">Services</span>
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
            From 24/7 airport terminal drops to one-way highway cabs and scenic mountain holiday tours — experience prompt service, verified chauffeurs, and 100% transparent pricing.
          </p>
        </div>

        {/* 4 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-14">
          {coreServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.iconBg} text-slate-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  
                  <span className="text-[10px] uppercase font-think tracking-wider bg-slate-900 text-yellow-400 px-3 py-1 rounded-full shadow-xs">
                    {service.badge}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                    {service.tagline}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-think font-nexa text-slate-900 mb-2.5 leading-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Feature Highlights List */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Popular Connection Chips */}
                  {/* <div className="mb-6 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-think uppercase tracking-wider text-gray-400 block mb-2">
                      Popular Connections:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.popularConnections.map((conn, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-think bg-white px-2 py-0.5 rounded-md border border-gray-200 text-slate-800 shadow-2xs"
                        >
                          {conn.from} → {conn.to}
                        </span>
                      ))}
                    </div>
                  </div> */}
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleWhatsAppBooking(service)}
                    className="w-full bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-think text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-all group/btn"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Inquire on WhatsApp</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSearchAction(service)}
                    className="w-full bg-[#FBBF24] hover:bg-yellow-500 active:scale-95 text-slate-950 font-think text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1 transition-all"
                  >
                    <span>Check Fares & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Assurance Strip */}
        {/* <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <span className="text-xl sm:text-2xl font-think font-nexa text-[#FBBF24] block">24/7</span>
              <span className="text-xs sm:text-sm font-think text-gray-300">Round-The-Clock Service</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-xl sm:text-2xl font-think font-nexa text-[#FBBF24] block">100% Fixed</span>
              <span className="text-xs sm:text-sm font-thin text-gray-300">Transparent Tariffs</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-xl sm:text-2xl font-think font-nexa text-[#FBBF24] block">Verified</span>
              <span className="text-xs sm:text-sm font-think text-gray-300">Expert Highway Chauffeurs</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-xl sm:text-2xl font-think font-nexa text-[#FBBF24] block">Clean AC</span>
              <span className="text-xs sm:text-sm font-think text-gray-300">Disinfected & Modern Fleet</span>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
}
