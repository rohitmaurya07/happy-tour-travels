import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronDown, ChevronUp, Sparkles, Plane, Compass, Navigation, Search, CheckCircle2, MessageCircle } from 'lucide-react';
import { popularRouteCategories } from '../data/popularRoutes';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { siteConfig } from '../config/siteConfig';

export default function PopularRoutesSection({ onSelectRoute }) {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Default time/date strings
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultTimeStr = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleRouteClick = (route) => {
    if (onSelectRoute) {
      onSelectRoute(route);
      return;
    }

    const q = new URLSearchParams({
      tripType: route.type || 'One Way',
      from: route.from,
      to: route.to,
      date: todayStr,
      time: defaultTimeStr(),
    }).toString();

    navigate(`/search?${q}`);
  };

  const handleQuickWhatsApp = (e, route) => {
    e.stopPropagation();
    const msg = `Hello ${siteConfig.businessName}, I would like to book a cab for route: *${route.from} → ${route.to}*. Please share available cars and fare details.`;
    bookOnWhatsApp(msg);
  };

  // Filter categories and routes if user searches
  const filteredCategories = popularRouteCategories.map((cat) => {
    if (!searchTerm.trim()) return cat;
    const term = searchTerm.toLowerCase();
    const matchingRoutes = cat.routes.filter(
      (r) =>
        r.from.toLowerCase().includes(term) ||
        r.to.toLowerCase().includes(term) ||
        cat.title.toLowerCase().includes(term)
    );
    return {
      ...cat,
      routes: matchingRoutes,
    };
  }).filter((cat) => cat.routes.length > 0);

  return (
    <section id="popular-routes" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30 inline-flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Taxi Connections Across North India</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-white font-heading mt-4 tracking-tight">
            Popular Taxi Routes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-medium">
            Click on any route below to view instant fares and book your cab with pickup date and time.
          </p>

          {/* Quick Route Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by city (e.g. Manali, Delhi, Shimla...)"
                className="w-full bg-slate-800/90 text-white pl-11 pr-4 py-3 rounded-full border border-slate-700 text-xs font-semibold focus:outline-none focus:border-brand-yellow placeholder-gray-400 shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold px-2 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 9 Category Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories[category.id] || searchTerm.trim().length > 0;
            const displayedRoutes = isExpanded ? category.routes : category.routes.slice(0, 5);
            const remainingCount = category.routes.length - 5;

            return (
              <div
                key={category.id}
                className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-slate-700/80 hover:border-yellow-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-md border border-yellow-400/20">
                        {category.tag}
                      </span>
                      <h3 className="text-lg font-bold font-nexa text-white mt-1.5 flex items-center space-x-1.5">
                        <span className="text-base">{category.emoji}</span>
                        <span>{category.title}</span>
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap">
                      {category.routes.length} Routes
                    </span>
                  </div>

                  {/* Routes List */}
                  <div className="space-y-2">
                    {displayedRoutes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        onClick={() => handleRouteClick(route)}
                        className="w-full text-left bg-slate-900/70 hover:bg-yellow-400/15 border border-slate-700/60 hover:border-yellow-400/60 p-3 rounded-2xl flex items-center justify-between group/item cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-yellow-400 text-xs font-bold group-hover/item:bg-yellow-400 group-hover/item:text-slate-950 transition-colors">
                            {rIdx + 1}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white group-hover/item:text-yellow-300 transition-colors">
                              {route.from}
                            </span>
                            <span className="text-yellow-400 mx-1.5 font-bold">→</span>
                            <span className="text-xs font-bold text-gray-200 group-hover/item:text-white transition-colors">
                              {route.to}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <button
                            title="Quick WhatsApp Inquiry"
                            onClick={(e) => handleQuickWhatsApp(e, route)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-colors opacity-80 hover:opacity-100"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-6 h-6 rounded-full bg-slate-800/80 group-hover/item:bg-yellow-400 group-hover/item:text-slate-950 text-gray-400 flex items-center justify-center transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: See More / Show Less Button */}
                {category.routes.length > 5 && !searchTerm && (
                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-yellow-400 hover:text-slate-950 text-yellow-400 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border border-slate-700 hover:border-yellow-400 shadow-sm"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>See More ({remainingCount} more routes)</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Assistance CTA */}
        <div className="mt-14 bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                Need a Custom City-to-City or Village Route?
              </h4>
              <p className="text-xs text-gray-300 font-medium mt-0.5">
                We operate 24/7 doorstep pickup across every town, airport, and tourist destination in North India.
              </p>
            </div>
          </div>
          <button
            onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I want to inquire about a customized taxi route.`)}
            className="yellow-gradient-btn px-6 py-3 rounded-full text-slate-950 font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow-yellow-glow"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
            <span>Inquire Custom Route on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
}
