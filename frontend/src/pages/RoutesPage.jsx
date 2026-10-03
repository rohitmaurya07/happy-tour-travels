import React from 'react';
import PopularRoutesSection from '../components/PopularRoutesSection';
import LocalSeoSection from '../components/LocalSeoSection';
import { MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function RoutesPage() {
  const { siteConfig } = useSiteData();
  const majorRoutes = [
    {
      from: 'Delhi Airport (DEL)',
      to: 'Chandigarh, Shimla, Manali, Kasol & All Himachal',
      dist: '250 - 530 Km',
      time: '4.5 - 9 Hours',
      fare: 'From ₹12/km',
      desc: 'Direct terminal pickup from Delhi IGI Airport to Chandigarh and scenic Himachal hill destinations (Shimla, Manali, Kasol, Dharamshala, Dalhousie).'
    },
    {
      from: 'Delhi Airport (DEL)',
      to: 'Ludhiana, Jalandhar, Amritsar & All Punjab',
      dist: '310 - 450 Km',
      time: '5 - 7 Hours',
      fare: 'From ₹12/km',
      desc: 'Hassle-free 24/7 doorstep pickup from Delhi Airport Terminals 1, 2 & 3 to all cities, towns and villages across Punjab with state taxes & tolls included.'
    },
    {
      from: 'All Punjab',
      to: 'Delhi NCR & IGI Airport (DEL)',
      dist: '250 - 460 Km',
      time: '4 - 7 Hours',
      fare: 'From ₹12/km One Way',
      desc: 'Affordable one-way and round-trip highway taxi service from Jalandhar, Ludhiana, Amritsar, Bathinda, Patiala, Phagwara, Hoshiarpur to Delhi.'
    },
    {
      from: 'Chandigarh Airport (IXC)',
      to: 'All Punjab & Himachal Pradesh',
      dist: '55 - 310 Km',
      time: '1.5 - 6 Hours',
      fare: 'From ₹12/km',
      desc: 'Prompt incoming flight pickup connecting Shaheed Bhagat Singh Airport to Jalandhar, Ludhiana, Amritsar and Himachal hill stations (Shimla, Kasauli, Manali).'
    },
    {
      from: 'All Punjab',
      to: 'Amritsar Airport (ATQ)',
      dist: '80 - 180 Km',
      time: '1.5 - 3.5 Hours',
      fare: 'From ₹12/km',
      desc: 'Guaranteed timely airport drops to Sri Guru Ram Dass Jee International Airport Amritsar for all international flights & domestic departures.'
    },
    {
      from: 'All Punjab',
      to: 'Chandigarh Airport (IXC)',
      dist: '60 - 220 Km',
      time: '1.5 - 4 Hours',
      fare: 'From ₹12/km',
      desc: 'Fast intercity cab service from any corner of Punjab directly to Chandigarh International Airport.'
    }
  ];

  return (
    <div className="pt-10 pb-20 bg-white min-h-screen">
      
      {/* Page Hero Banner */}
      {/* <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            North India Highway & Airport Route Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-nexa font-heading mt-4 text-white">
            Our Taxi Routes & Travel Connections
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-medium">
            Connecting All Punjab, Delhi Airport, Chandigarh Airport, and all Himachal Pradesh destinations with safe, reliable and comfortable cabs.
          </p>
        </div>
      </div> */}

      {/* 9 Category Popular Routes Grid with See More */}
      <PopularRoutesSection />

      {/* Main Local SEO Component */}
      <LocalSeoSection />

      {/* Detailed Routes Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Popular Highway Connections
              </span>
              <h3 className="text-2xl font-nexa text-slate-900 font-heading mt-1">
                Major Taxi Corridors Across North India
              </h3>
            </div>
            <button
              onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I want to check taxi availability for an outstation route.`)}
              className="yellow-gradient-btn px-6 py-3 rounded-full text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Inquire Any Route on WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {majorRoutes.map((route, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold text-base font-heading">
                      <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span>{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span>{route.to}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                    {route.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-gray-500 font-semibold">
                    <span>{route.dist}</span>
                    <span>•</span>
                    <span>{route.time}</span>
                  </div>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md">
                    {route.fare}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
