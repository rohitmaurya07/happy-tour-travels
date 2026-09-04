import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TourPackages from '../components/TourPackages';
import Fleet from '../components/Fleet';
import LocalSeoSection from '../components/LocalSeoSection';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Global Search Bar */}
      <Hero />

      {/* Services Grid */}
      <Services />

      {/* Tour Packages Showcase */}
      <TourPackages />

      {/* Vehicle Fleet Showcase */}
      <Fleet />

      {/* Local SEO Section */}
      <LocalSeoSection />
    </div>
  );
}
