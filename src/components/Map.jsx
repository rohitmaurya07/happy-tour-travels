import React from 'react';
import { MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Map() {
  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-brand-gold flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Our Location in Jalandhar
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {siteConfig.address}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-nexa uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1 rounded-full hidden sm:inline-block">
          Interactive Map
        </span>
      </div>

      {/* Embedded Responsive Google Map */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
        <iframe
          title="Happy Tour & Travels Jalandhar Location Map"
          src={siteConfig.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter contrast-105"
        ></iframe>
      </div>
    </div>
  );
}
