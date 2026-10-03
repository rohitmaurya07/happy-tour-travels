import React from 'react';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <div className="pt-6 pb-20 bg-gray-50 min-h-screen">
      
      {/* Page Hero Banner */}
      {/* <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            We Are Here To Assist You 24/7
          </span>
          <h1 className="text-4xl sm:text-5xl font-nexa font-heading mt-4 text-white">
            Contact Happy Tour & Travels Jalandhar
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-medium">
            Reach out via WhatsApp or phone. Our customer desk is available round-the-clock to confirm your taxi booking.
          </p>
        </div>
      </div> */}

      {/* Main Contact & Map Components */}
      <Contact />

    </div>
  );
}
