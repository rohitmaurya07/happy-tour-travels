import React from 'react';
import { Plane, Navigation, Car, Compass, ArrowUpRight, MessageCircle, Shield, Clock } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Services() {
  const { services, siteConfig } = useSiteData();
  const servicesData = services || [];
  // Icon mapper
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Plane':
        return <Plane className="w-8 h-8 text-slate-950" />;
      case 'Navigation':
        return <Navigation className="w-8 h-8 text-slate-950" />;
      case 'Car':
        return <Car className="w-8 h-8 text-slate-950" />;
      case 'Compass':
        return <Compass className="w-8 h-8 text-slate-950" />;
      default:
        return <Car className="w-8 h-8 text-slate-950" />;
    }
  };

  const handleServiceClick = (service) => {
    const message = `Hello, I am interested in your ${service.title} service from Jalandhar.
    
Service: ${service.title}
Details: ${service.tagline}

Please provide availability and pricing details.`;
    bookOnWhatsApp(message);
  };

  return (
    <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            Professional Taxi & Tour Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            Our Core Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">
            From seamless airport pickups in Amritsar and Delhi to scenic outstation family tours across Himachal Pradesh — we deliver comfort, safety, and fixed transparent pricing.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Card Badge */}
              <span className="absolute top-4 right-4 text-[10px] uppercase font-nexa tracking-wider bg-slate-900 text-yellow-400 px-3 py-1 rounded-full">
                {service.badge}
              </span>

              <div>
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center mb-6 shadow-yellow-glow group-hover:scale-110 transition-transform">
                  {getIcon(service.iconName)}
                </div>

                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  {service.tagline}
                </span>

                <h3 className="text-2xl font-bold text-slate-900 font-heading mb-3">
                  {service.title}
                </h3>

                {/* <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                  {service.description}
                </p> */}

                {/* Popular Routes */}
                <div className="space-y-1.5 mb-6 pt-4 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Popular Connections:
                  </span>
                  {service.popularRoutes.map((route, idx) => (
                    <div key={idx} className="flex items-center text-xs font-semibold text-slate-700">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-brand-gold flex-shrink-0" />
                      <span>{route}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card WhatsApp CTA */}
              <button
                onClick={() => handleServiceClick(service)}
                className="w-full yellow-gradient-btn py-3 rounded-2xl text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg transition-all mt-4"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                <span>Book on WhatsApp</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
