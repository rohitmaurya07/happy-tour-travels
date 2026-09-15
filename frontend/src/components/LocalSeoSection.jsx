import React from 'react';
import { MapPin, CheckCircle, Navigation, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function LocalSeoSection() {
  const routesList = [
    { name: "Jalandhar to Delhi Airport & NCR Taxi", desc: "Daily one-way cab service & round trip packages via NH44.", time: "5-6 Hours" },
    { name: "Jalandhar to Chandigarh & Airport Taxi", desc: "Fast pickup service to IT Park, Elante, & IXC International Airport.", time: "2.5 Hours" },
    { name: "Jalandhar to Amritsar & Airport Taxi", desc: "Direct cabs for Golden Temple visits & Amritsar ATQ Airport drops.", time: "1.5 Hours" },
    { name: "Jalandhar to Himachal Pradesh Taxi", desc: "Outstation hill tour packages for Shimla, Manali, Dharamshala & Dalhousie.", time: "Custom Days" }
  ];

  return (
    <section id="local-seo" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
              Trusted Local Taxi Partner
            </span>

            <h2 className="text-3xl sm:text-4xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
              Taxi & Travel Services from Jalandhar
            </h2>

            <p className="mt-4 text-base text-gray-600 leading-relaxed font-medium">
              Based centrally in <strong className="text-slate-900">Jalandhar, Punjab</strong>, {siteConfig.businessName} provides premier outstation taxi booking, city cabs, and airport pickup-drop services across Northern India. Whether you require a fast <strong className="text-slate-900">one way taxi Jalandhar to Delhi</strong>, an airport shuttle to Amritsar, or a multi-day family holiday in <strong className="text-slate-900">Himachal Pradesh</strong>, we ensure safe, clean, and transparently priced taxi services.
            </p>

            {/* Targeted Service Areas Breakdown */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
                  <MapPin className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <h4>Jalandhar Airport Taxi</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Reliable airport pickup and drop to Sri Guru Ram Dass Jee Airport (Amritsar), Chandigarh Airport, and Delhi IGI Airport. Guaranteed timely arrivals with flight status monitoring.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
                  <Navigation className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <h4>Jalandhar to Himachal Taxi</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Experienced hill station drivers for <strong className="text-slate-900">Jalandhar to Shimla taxi</strong>, <strong className="text-slate-900">Jalandhar to Manali taxi</strong>, Dharamshala, McLeod Ganj, and Dalhousie packages.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
                  <CheckCircle className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <h4>Jalandhar to Delhi One-Way</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Affordable one-way intercity cab service between Jalandhar and Delhi NCR. Pay strictly for one direction with no mandatory return fare charges.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
                  <CheckCircle className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <h4>Punjab Regional Cabs</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Doorstep pickups for intercity trips across Amritsar, Ludhiana, Bathinda, Patiala, Phagwara, Hoshiarpur, and Chandigarh.
                </p>
              </div>

            </div>

            <div className="mt-8 flex items-center space-x-4">
              <button
                onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about taxi fares from Jalandhar.`)}
                className="yellow-gradient-btn px-6 py-3.5 rounded-2xl text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                <span>Inquire Fares on WhatsApp</span>
              </button>
              <a
                href={`tel:${siteConfig.phoneNumber}`}
                className="bg-gray-100 hover:bg-gray-200 text-slate-800 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-700" />
                <span>Call Us Direct</span>
              </a>
            </div>

          </div>

          {/* Right Column: Popular Route Highlights Box */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-xl font-bold font-heading mb-6 border-b border-slate-800 pb-4 text-white">
              Popular Outstation Routes from Jalandhar
            </h3>

            <div className="space-y-4">
              {routesList.map((route, idx) => (
                <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 hover:border-yellow-400/40 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-sm text-yellow-300">
                      {route.name}
                    </h5>
                    <span className="text-[10px] font-nexa uppercase bg-yellow-400 text-slate-950 px-2 py-0.5 rounded">
                      {route.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-normal">
                    {route.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-xs text-gray-400 font-medium block">
                Serving Jalandhar Cantt, Model Town, Urban Estate, GT Road & surrounding areas.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
