import React from 'react';
import Fleet from '../components/Fleet';
import LocalTaxiRates from '../components/LocalTaxiRates';
import { ShieldCheck, Award, Sparkles, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function FleetPage() {
  const { siteConfig } = useSiteData();
  return (
    <div className="pt-4 pb-20 bg-gray-50 min-h-screen">
      
      {/* Fleet Component */}
      <Fleet />

      {/* Local Taxi Rental Rates Component */}
      <LocalTaxiRates />

      {/* Fleet Maintenance & Feature Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
              Guaranteed Vehicle Quality
            </span>
            <h3 className="text-3xl font-nexa font-heading text-white mt-2">
              Why Travel With Happy Tour & Travels Fleet?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <ShieldCheck className="w-8 h-8 text-brand-yellow mb-4" />
              <h4 className="text-lg font-bold text-white font-heading mb-2">100% Commercial Permits</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                All vehicles carry valid yellow tourist taxi plates, nationwide permits, comprehensive insurance, and pollution certificates.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <Sparkles className="w-8 h-8 text-brand-yellow mb-4" />
              <h4 className="text-lg font-bold text-white font-heading mb-2">Sanitized & Disinfected</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                Deep cleaned before every single pickup with fresh seat covers, ambient air fresheners, and bottled water for long trips.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <Award className="w-8 h-8 text-brand-yellow mb-4" />
              <h4 className="text-lg font-bold text-white font-heading mb-2">Experienced Hill Drivers</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                Uniformed chauffeurs trained in hill driving across Himachal Pradesh & Uttarakhand with full police verification.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I want to check availability for a specific vehicle model.`)}
              className="yellow-gradient-btn px-8 py-3.5 rounded-full text-slate-950 font-nexa text-sm font-bold inline-flex items-center space-x-2 shadow-yellow-glow"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Inquire Vehicle Availability on WhatsApp</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
