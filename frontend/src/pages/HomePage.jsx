import React from 'react';
import Hero from '../components/Hero';
import PopularRoutesSection from '../components/PopularRoutesSection';
import Services from '../components/Services';
import TourPackages from '../components/TourPackages';
import Fleet from '../components/Fleet';
import LocalTaxiRates from '../components/LocalTaxiRates';
import LocalSeoSection from '../components/LocalSeoSection';

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

      {/* Local SEO Section */}
      <LocalSeoSection />
    </div>
  );
}
