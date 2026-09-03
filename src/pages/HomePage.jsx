import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchResults from '../components/SearchResults';
import Services from '../components/Services';
import TourPackages from '../components/TourPackages';
import Fleet from '../components/Fleet';
import LocalSeoSection from '../components/LocalSeoSection';
import { getDistanceKm } from '../utils/distance';

export default function HomePage() {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = async (params) => {
    // If trip is hourly rental, distance is not used
    if (params.tripType === 'Hourly Rental') {
      const extendedParams = { ...params, distanceKm: 0 };
      setSearchParams(extendedParams);
      setTimeout(() => {
        const resultsElem = document.getElementById('search-results');
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Helper to get coordinates via OSM Nominatim (first result)
    const fetchCoords = async (query) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
      return null;
    };

    const fromCoords = await fetchCoords(params.fromLocation);
    const toCoords = await fetchCoords(params.toLocation);
    let distanceKm = 0;
    if (fromCoords && toCoords) {
      distanceKm = getDistanceKm(
        params.fromLocation,
        params.toLocation,
        fromCoords,
        toCoords
      );
    }
    const extendedParams = { ...params, distanceKm };
    setSearchParams(extendedParams);
    setTimeout(() => {
      const resultsElem = document.getElementById('search-results');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleResetSearch = () => {
    setSearchParams(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section with Search Bar */}
      <Hero onSearch={handleSearch} />

      {/* Render Search Results dynamically when search is triggered */}
      {searchParams && (
        <SearchResults
          searchParams={searchParams}
          onResetSearch={handleResetSearch}
        />
      )}

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
