import React from 'react';
import { MapPin, Car, UserCheck, ShieldCheck, CircleDollarSign, ArrowRight, MessageCircle, Plane } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function CallToActionBanner({ className = '' }) {
  const { siteConfig } = useSiteData();

  const handleBookClick = () => {
    const msg = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book a ride / taxi. Please share fare and cab availability.`;
    bookOnWhatsApp(msg, siteConfig?.whatsappNumber);
  };

  return (
    <section className={`relative overflow-hidden bg-[#FBBF24] text-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 select-none ${className}`}>
      
      {/* Background Decorative Silhouettes & Scenery */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply flex items-end justify-between overflow-hidden">
        {/* Left mountain/trees silhouette */}
        <svg className="w-72 sm:w-96 h-48 sm:h-64 -ml-12 -mb-4 text-amber-900" viewBox="0 0 300 150" fill="currentColor">
          <path d="M0 150 L0 100 L40 60 L80 110 L120 40 L170 120 L220 70 L280 130 L300 110 L300 150 Z" />
        </svg>

        {/* Right temple/heritage monument silhouette */}
        <svg className="w-72 sm:w-96 h-56 sm:h-72 -mr-10 -mb-2 text-amber-900" viewBox="0 0 300 200" fill="currentColor">
          <path d="M150 20 L160 50 L180 50 L185 80 L200 85 L210 120 L230 130 L260 140 L300 150 L300 200 L100 200 L100 160 L120 140 L135 110 L140 70 Z" />
          <path d="M150 0 L153 20 L147 20 Z" />
        </svg>
      </div>

      {/* Background Road Curve Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-25 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
          <path d="M0 120 C 300 80, 500 10, 1200 60" stroke="#78350F" strokeWidth="24" strokeLinecap="round" />
          <path d="M0 120 C 300 80, 500 10, 1200 60" stroke="#FEF3C7" strokeWidth="2" strokeDasharray="12 12" />
        </svg>
      </div>

      {/* Airplane on top right */}
      <div className="absolute top-6 sm:top-10 right-6 sm:right-16 pointer-events-none opacity-25 text-amber-950">
        <Plane className="w-10 h-10 sm:w-14 sm:h-14 transform -rotate-12 fill-amber-950 stroke-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Main Headline */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-nexa text-[#0A0E1A] tracking-tight leading-tight sm:leading-none">
            Ready to Book Your Ride<br />
            <span className="inline-block relative mt-1 sm:mt-2">
              Across North India?
              {/* White Curve Underline Swoosh */}
              <svg 
                className="w-44 sm:w-72 h-3 sm:h-4 mx-auto -mt-1 sm:mt-0 text-white fill-none" 
                viewBox="0 0 240 16"
              >
                <path 
                  d="M4 12C60 3 180 3 236 12" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Serving States Line */}
        <div className="flex flex-col items-center space-y-1 mb-8 text-xs sm:text-base font-bold text-slate-900">
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1">
            <span className="inline-flex items-center font-black text-slate-950">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 text-slate-950 mr-1" />
              Serving
            </span>
            <span className="text-slate-950/40 font-normal">|</span>
            <span>Delhi</span>
            <span className="text-slate-950/40 font-normal">|</span>
            <span>Punjab</span>
            <span className="text-slate-950/40 font-normal">|</span>
            <span>Haryana</span>
            <span className="text-slate-950/40 font-normal">|</span>
            <span>Himachal Pradesh</span>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <span>Rajasthan</span>
            <span className="text-slate-950/40 font-normal">|</span>
            <span>Jammu & Kashmir</span>
          </div>
        </div>

        {/* 4 Trust Feature Badges */}
        <div className="w-full max-w-3xl bg-amber-400/30 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none rounded-3xl p-3 sm:p-0 mb-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 items-center justify-center">
            
            {/* 1. Clean AC Cabs */}
            <div className="flex items-center justify-center space-x-2.5 sm:border-r border-slate-950/25 sm:pr-4 py-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 text-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Car className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Clean</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">AC Cabs</span>
              </div>
            </div>

            {/* 2. Verified Drivers */}
            <div className="flex items-center justify-center space-x-2.5 sm:border-r border-slate-950/25 sm:px-4 py-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 text-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <UserCheck className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Verified</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Drivers</span>
              </div>
            </div>

            {/* 3. Safe & Reliable */}
            <div className="flex items-center justify-center space-x-2.5 sm:border-r border-slate-950/25 sm:px-4 py-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 text-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Safe &</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Reliable</span>
              </div>
            </div>

            {/* 4. Transparent Fares */}
            <div className="flex items-center justify-center space-x-2.5 sm:pl-4 py-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 text-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <CircleDollarSign className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Transparent</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-950 block">Fares</span>
              </div>
            </div>

          </div>
        </div>

        {/* Subtext */}
        <p className="text-sm sm:text-base font-semibold text-slate-900/90 mb-6">
          Instant booking confirmation via WhatsApp.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleBookClick}
          className="bg-[#0A0E1A] hover:bg-slate-900 active:scale-95 text-white pl-4 pr-6 sm:pl-5 sm:pr-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-[0_12px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all flex items-center space-x-3 group"
        >
          {/* Green WhatsApp Circle */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5 fill-white stroke-none text-white" />
          </div>

          <span className="font-nexa tracking-tight">Book on WhatsApp Now</span>

          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform ml-1" />
        </button>

      </div>
    </section>
  );
}
