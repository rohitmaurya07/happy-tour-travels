import React from 'react';
import Hero from '../components/Hero';
import PopularRoutesSection from '../components/PopularRoutesSection';
import Services from '../components/Services';
import TourPackages from '../components/TourPackages';
import Fleet from '../components/Fleet';
import LocalTaxiRates from '../components/LocalTaxiRates';
import WhatsAppInquiryForm from '../components/WhatsAppInquiryForm';
import LocalSeoSection from '../components/LocalSeoSection';
import GoogleReviews from '../components/GoogleReviews';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Global Search Bar */}
      <Hero />
      {/* Popular Routes Section (9 Category Cards with Direct Search Links) */}
      <PopularRoutesSection />

      {/* Services Grid */}
      <Services />

      {/* Tour Packages Showcase */}
      <TourPackages />

      {/* Vehicle Fleet Showcase */}
      <Fleet />

      {/* Local Taxi Hourly Rental Rates (4h/40km & 8h/80km) */}
      <LocalTaxiRates />

      <GoogleReviews/>


      {/* Quick WhatsApp Inquiry Form Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-yellow-400/10 px-3.5 py-1.5 rounded-full border border-yellow-400/30">
              Need a Custom Trip Quote?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-nexa text-white mt-3">
              Direct WhatsApp Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-lg mx-auto">
              Fill in your pickup, drop, date & requirements — opens ready-to-send directly in WhatsApp.
            </p>
          </div>
          <WhatsAppInquiryForm />
        </div>
      </section>


      {/* Local SEO Section */}
      <LocalSeoSection />
    </div>
  );
}
