import React from 'react';
import LocalSeoSection from '../components/LocalSeoSection';
import { MapPin, Navigation, Compass, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function RoutesPage() {
  const majorRoutes = [
    { from: 'Jalandhar', to: 'Delhi IGI Airport (DEL)', dist: '375 Km', time: '5.5 Hours', fare: '₹3,500 - ₹5,500', desc: 'Direct NH44 highway cab pickup from Jalandhar Cantt / Model Town to Delhi Airport Terminals 1, 2 & 3.' },
    { from: 'Jalandhar', to: 'Chandigarh (IXC Airport / City)', dist: '150 Km', time: '2.5 Hours', fare: '₹2,200 - ₹3,200', desc: 'Fast one-way taxi for business trips, IT Park, Elante Mall, and Shaheed Bhagat Singh International Airport.' },
    { from: 'Jalandhar', to: 'Amritsar (Golden Temple / ATQ)', dist: '80 Km', time: '1.5 Hours', fare: '₹1,600 - ₹2,500', desc: 'Spiritual tour cab for Golden Temple, Wagah Border retreat ceremony, and Sri Guru Ram Dass Jee Airport.' },
    { from: 'Jalandhar', to: 'Shimla (Himachal Pradesh)', dist: '220 Km', time: '5.5 Hours', fare: '₹3,800 - ₹5,800', desc: 'Scenic mountain highway drive via Solan to Shimla Mall Road, Kufri, and Chail hill stations.' },
    { from: 'Jalandhar', to: 'Manali (Solang Valley)', dist: '330 Km', time: '8.0 Hours', fare: '₹5,500 - ₹8,500', desc: 'Popular hill vacation route via Mandi & Kullu Valley. Solang Valley snow points and Rohtang Pass cabs.' },
    { from: 'Jalandhar', to: 'Dharamshala & McLeod Ganj', dist: '170 Km', time: '4.5 Hours', fare: '₹3,200 - ₹4,800', desc: 'Peaceful mountain escape to Little Lhasa, Dalai Lama Temple, Bhagsunag Falls, and HPCA Cricket Stadium.' },
    { from: 'Jalandhar', to: 'Dalhousie & Khajjiar', dist: '190 Km', time: '5.0 Hours', fare: '₹3,500 - ₹5,200', desc: 'Serene pine forest vacation to Mini Switzerland of India (Khajjiar), Kalatop sanctuary, and Panchpula.' }
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      
      {/* Page Hero Banner */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            North India Highway & Route Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-nexa font-heading mt-4 text-white">
            Taxi Routes & Outstation Destinations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-medium">
            Discover popular outstation taxi routes originating from Jalandhar, Punjab to Delhi NCR, Chandigarh, Amritsar, and Himachal Pradesh hill stations.
          </p>
        </div>
      </div>

      {/* Main Local SEO Component */}
      <LocalSeoSection />

      {/* Detailed Routes Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Distance & Tariff Matrix
              </span>
              <h3 className="text-2xl font-nexa text-slate-900 font-heading mt-1">
                Jalandhar Outstation Route Directory
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
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-base text-slate-900 font-heading flex items-center">
                      <Navigation className="w-4 h-4 text-brand-yellow mr-2" />
                      {route.from} ↔ {route.to}
                    </h4>
                    <span className="text-[11px] font-nexa bg-slate-900 text-yellow-400 px-2.5 py-1 rounded-full">
                      {route.time}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-gray-500 mb-3">
                    <span>Distance: <strong className="text-slate-800">{route.dist}</strong></span>
                    <span>•</span>
                    <span>Estimated Fare: <strong className="text-brand-gold">{route.fare}</strong></span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                    {route.desc}
                  </p>
                </div>

                <button
                  onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to book a taxi for route: ${route.from} to ${route.to}.`)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-yellow-400 stroke-none" />
                  <span>Book Route Cab on WhatsApp</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
