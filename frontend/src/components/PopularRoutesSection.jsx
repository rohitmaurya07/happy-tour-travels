import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function PopularRoutesSection({ onSelectRoute }) {
  const { siteConfig } = useSiteData();
  const navigate = useNavigate();
  const [selectedCityFilter, setSelectedCityFilter] = useState('All Cities');

  const cityList = [
    'All Cities',
    'Jalandhar',
    'Delhi',
    'Amritsar',
    'Chandigarh',
    'Ludhiana',
    'Shimla',
    'Manali',
    'Jammu'
  ];

  const popularRoutesByCity = [
    {
      city: 'Jalandhar',
      routes: [
        { from: 'Jalandhar', to: 'Delhi Airport' },
        { from: 'Jalandhar', to: 'Amritsar' },
        { from: 'Jalandhar', to: 'Chandigarh' },
        { from: 'Jalandhar', to: 'Shimla' },
        { from: 'Jalandhar', to: 'Manali' }
      ]
    },
    {
      city: 'Delhi',
      routes: [
        { from: 'Delhi', to: 'Jalandhar' },
        { from: 'Delhi', to: 'Amritsar' },
        { from: 'Delhi', to: 'Chandigarh' },
        { from: 'Delhi', to: 'Shimla' },
        { from: 'Delhi', to: 'Manali' }
      ]
    },
    {
      city: 'Amritsar',
      routes: [
        { from: 'Amritsar', to: 'Jalandhar' },
        { from: 'Amritsar', to: 'Delhi Airport' },
        { from: 'Amritsar', to: 'Chandigarh' },
        { from: 'Amritsar', to: 'Shimla' },
        { from: 'Amritsar', to: 'Manali' }
      ]
    },
    {
      city: 'Chandigarh',
      routes: [
        { from: 'Chandigarh', to: 'Delhi Airport' },
        { from: 'Chandigarh', to: 'Jalandhar' },
        { from: 'Chandigarh', to: 'Amritsar' },
        { from: 'Chandigarh', to: 'Shimla' },
        { from: 'Chandigarh', to: 'Manali' }
      ]
    },
    {
      city: 'Ludhiana',
      routes: [
        { from: 'Ludhiana', to: 'Delhi Airport' },
        { from: 'Ludhiana', to: 'Jalandhar' },
        { from: 'Ludhiana', to: 'Amritsar' },
        { from: 'Ludhiana', to: 'Chandigarh' },
        { from: 'Ludhiana', to: 'Shimla' }
      ]
    },
    {
      city: 'Shimla',
      routes: [
        { from: 'Shimla', to: 'Chandigarh' },
        { from: 'Shimla', to: 'Delhi' },
        { from: 'Shimla', to: 'Jalandhar' },
        { from: 'Shimla', to: 'Manali' },
        { from: 'Shimla', to: 'Amritsar' }
      ]
    },
    {
      city: 'Manali',
      routes: [
        { from: 'Manali', to: 'Delhi' },
        { from: 'Manali', to: 'Chandigarh' },
        { from: 'Manali', to: 'Jalandhar' },
        { from: 'Manali', to: 'Amritsar' },
        { from: 'Manali', to: 'Shimla' }
      ]
    },
    {
      city: 'Jammu',
      routes: [
        { from: 'Jammu', to: 'Delhi' },
        { from: 'Jammu', to: 'Chandigarh' },
        { from: 'Jammu', to: 'Jalandhar' },
        { from: 'Jammu', to: 'Amritsar' },
        { from: 'Jammu', to: 'Shimla' }
      ]
    }
  ];

  // Filter cards based on selected filter pill
  const displayedCityCards = selectedCityFilter === 'All Cities'
    ? popularRoutesByCity
    : popularRoutesByCity.filter(c => c.city.toLowerCase() === selectedCityFilter.toLowerCase());

  const handleBookNow = (from, to) => {
    if (onSelectRoute) {
      onSelectRoute({ from, to, type: 'One Way' });
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const q = new URLSearchParams({
      tripType: 'One Way',
      from: from,
      to: to,
      date: todayStr,
      time: '09:00'
    }).toString();
    navigate(`/search?${q}`);
  };

  const handleViewAllCity = (city) => {
    if (onSelectRoute) {
      onSelectRoute({ from: city, to: '', type: 'One Way' });
      return;
    }

    const homeElem = document.getElementById('home');
    if (homeElem) {
      homeElem.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('selectBookingCity', { detail: city }));
    } else {
      navigate(`/?from=${encodeURIComponent(city)}#home`);
    }
  };

  return (
    <section id="popular-routes" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C1B33] via-[#0F284E] to-[#1E3A8A] text-white p-6 sm:p-10 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          
          {/* Subtle background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl  font-nexa tracking-tight text-white leading-tight">
              Popular <span className="text-[#FBBF24]">Taxi Routes</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-2 font-medium leading-relaxed">
              Explore our most booked taxi routes across major cities in North India. Click on any route to book your cab.
            </p>
          </div>

          {/* Right Fleet Illustration */}
          <div className="relative z-10 flex-shrink-0 flex items-center justify-center space-x-2">
            <img
              src="/assets/images/dzire.jpg"
              alt="Dzire Sedan"
              className="h-14 sm:h-20 w-auto object-contain drop-shadow-2xl rounded-xl bg-white/10 p-1 hidden sm:block"
            />
            <img
              src="/assets/images/innova.png"
              alt="Innova Crysta"
              className="h-16 sm:h-24 w-auto object-contain drop-shadow-2xl rounded-xl bg-white/10 p-1 hidden sm:block"
            />
            <img
              src="/assets/images/tempo.png"
              alt="Tempo Traveller"
              className="h-16 sm:h-24 w-auto object-contain drop-shadow-2xl rounded-xl bg-white/10 p-1 hidden sm:block"
            />
          </div>
        </div>

        {/* City Filter Chips Bar */}
        <div className="relative mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar touch-scroll">
            {cityList.map((city) => {
              const isActive = selectedCityFilter === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCityFilter(city)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-nexa whitespace-nowrap transition-all flex items-center space-x-1 active:scale-95 touch-manipulation ${
                    isActive
                      ? 'bg-[#FBBF24] text-slate-950 shadow-md font-extrabold ring-2 ring-yellow-400/50'
                      : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200 shadow-2xs'
                  }`}
                >
                  <span>{city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* City Route Cards Grid (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayedCityCards.map((card) => (
            <div
              key={card.city}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="bg-[#0B1B3D] text-white px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-nexa">
                  <span className="text-[#FBBF24]">{card.city}</span> - Popular Routes
                </h3>
              </div>

              {/* Routes Rows List */}
              <div className="divide-y divide-gray-100">
                {card.routes.map((r, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 sm:px-5 py-3 flex items-center justify-between gap-2 hover:bg-amber-50/40 transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-nexa text-slate-900 min-w-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 flex-shrink-0" />
                      <span className="truncate">{r.from}</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-yellow-500 transition-colors flex-shrink-0" />
                      <span className="truncate">{r.to}</span>
                    </div>

                    <button
                      onClick={() => handleBookNow(r.from, r.to)}
                      className="bg-[#FBBF24] hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-xs px-3 sm:px-3.5 py-1.5 rounded-lg shadow-xs transition-all whitespace-nowrap flex-shrink-0"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>

              {/* Card Footer Button */}
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => handleViewAllCity(card.city, card.routes[0]?.to)}
                  className="w-full py-2.5 bg-[#E2E8F0]/70 hover:bg-[#CBD5E1] text-[#1E3A8A] font-nexa text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1 transition-colors active:scale-98"
                >
                  <span>See More {card.city} Routes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
