import React, { useState } from 'react';
import { Clock, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { packagesData } from '../data/packages';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function TourPackages() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Himachal Tours', 'Punjab Tours', 'Airport Transfer', 'One Way Taxi', 'Outstation Rides', 'Car Fleet'];

  const filteredPackages = activeCategory === 'All'
    ? packagesData
    : packagesData.filter(pkg => pkg.category === activeCategory);

  const handleEnquiry = (pkg) => {
    const message = `Hello, I am interested in inquiring about the "${pkg.title}" package from Jalandhar.
    
Category: ${pkg.category}
Duration/Type: ${pkg.duration}
Highlights: ${pkg.highlights.join(', ')}

Please share full itinerary, vehicle options, and custom pricing details.`;
    bookOnWhatsApp(message);
  };

  return (
    <section id="packages" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 rounded-full text-yellow-300 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            <span>Curated Travel Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-white font-heading tracking-tight">
            Tour Packages & Travel Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-medium">
            Explore our most popular outstation tour itineraries starting from Jalandhar to mountain escapes, cultural pilgrimages, and seamless city taxi transfers.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-brand-yellow text-slate-950 shadow-yellow-glow scale-105'
                  : 'bg-slate-800/80 text-gray-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Package Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col justify-between group hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={pkg.image}
                    alt={pkg.altText}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  <span className="absolute top-4 left-4 bg-brand-yellow text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {pkg.badge}
                  </span>

                  <span className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-yellow-300 font-bold text-xs px-3 py-1 rounded-full flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {pkg.duration}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-6">
                  <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider block mb-1">
                    {pkg.category}
                  </span>

                  <h3 className="text-xl font-bold text-white font-heading mb-3 group-hover:text-yellow-300 transition-colors">
                    {pkg.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                    {pkg.description}
                  </p>

                  {/* Highlights Pill List */}
                  <div className="space-y-2 pt-4 border-t border-slate-700/60 mb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Tour Highlights:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.highlights.map((h, i) => (
                        <span key={i} className="inline-flex items-center text-xs font-medium bg-slate-900/80 text-gray-200 px-2.5 py-1 rounded-lg border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-brand-yellow mr-1" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => handleEnquiry(pkg)}
                  className="w-full yellow-gradient-btn py-3.5 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
