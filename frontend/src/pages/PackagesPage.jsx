import React from 'react';
import TourPackages from '../components/TourPackages';
import { Compass, CheckCircle2, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function PackagesPage() {
  const { siteConfig } = useSiteData();
  return (
    <div className="pt-24 pb-20 min-h-screen text-white">
      

      {/* Main Tour Packages Component */}
      <TourPackages />

      {/* Custom Itinerary Request Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-yellow-500 via-brand-yellow to-yellow-400 text-slate-950 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 font-nexa text-xs uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Need a Custom Itinerary?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-nexa font-heading text-slate-950">
              Customize Your Tour Package From Jalandhar
            </h3>
            <p className="text-sm font-semibold text-slate-900/80 mt-2 max-w-2xl">
              Want to modify hotel nights, add extra sightseeing spots, or hire a Tempo Traveller for group travel? We build 100% tailor-made itineraries.
            </p>
          </div>

          <button
            onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to design a custom tour itinerary from Jalandhar.`)}
            className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center space-x-2 shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-yellow-400 text-slate-950 stroke-none" />
            <span>Customize Tour on WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
}
