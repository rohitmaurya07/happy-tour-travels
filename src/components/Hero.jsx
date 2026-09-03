import React from 'react';
import { Star } from 'lucide-react';
import BookingForm from './BookingForm';

export default function Hero({ onSearch }) {
  return (
    <section id="home" className="relative min-h-screen pt-24 pb-12 flex flex-col justify-center items-center overflow-hidden bg-slate-950 text-white">
      
      {/* Hero Background Video & Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.65] contrast-110"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark Overlay for optimal text & form readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
      </div>

      {/* Main Hero Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto flex flex-col items-center justify-center">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#FFC72C]/10 border border-[#FFC72C]/30 px-3.5 py-1 rounded-full text-[#FFC72C] text-xs font-semibold mb-4 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span>Best Taxi Service in Jalandhar</span>
        </div>

        {/* Clean Shortened Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-nexa tracking-tight font-heading leading-tight drop-shadow-md">
          Travel Comfortably. <span className="text-brand-yellow">Arrive Confidently.</span>
        </h1>

        {/* Concise Supporting Text */}
        <p className="mt-3 text-sm sm:text-lg text-gray-200 max-w-2xl font-medium drop-shadow-sm">
          Reliable cabs, airport transfers & tour packages from Jalandhar across Punjab, Himachal & Delhi.
        </p>

        {/* Search Form Centered Prominently */}
        <div className="w-full mt-8">
          <BookingForm onSearch={onSearch} />
        </div>

      </div>
      
    </section>
  );
}
