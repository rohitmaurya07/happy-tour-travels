import React from 'react';
import { MessageCircle } from 'lucide-react';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { useSiteData } from '../context/SiteDataContext';
import useMobileKeyboard from '../hooks/useMobileKeyboard';

export default function WhatsAppButton() {
  const { siteConfig } = useSiteData();
  const isKeyboardOpen = useMobileKeyboard();
  const handleClick = () => {
    bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about taxi booking and availability.`, siteConfig.whatsappNumber);
  };

  return (
    <div className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center group transition-all duration-200 ${isKeyboardOpen ? 'translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
      
      {/* Tooltip text bubble on hover (Zero emojis, Lucide icon) */}
      <div className="mr-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:flex items-center space-x-1.5 border border-slate-800">
        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 stroke-none" />
        <span>Book on WhatsApp</span>
      </div>

      {/* Floating Circular Button */}
      <button
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-floating animate-whatsapp hover:scale-110 active:scale-95 transition-all duration-300 relative border-2 border-white"
      >
        <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 fill-white stroke-none" />
        
        {/* Active Notification Badge Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full"></span>
      </button>

    </div>
  );
}
