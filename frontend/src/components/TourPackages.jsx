import React, { useState } from 'react';
import { 
  Mountain, Car, Users, ShieldCheck, MapPin, Calendar, 
  MessageCircle, Mail, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function TourPackages() {
  const { siteConfig } = useSiteData();

  // Helper for today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // 15 Top Destinations list matching the reference image
  const topDestinations = [
    {
      id: 'shimla',
      name: 'Shimla',
      image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'manali',
      name: 'Manali',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'dharamshala',
      name: 'Dharamshala',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'dalhousie',
      name: 'Dalhousie',
      image: 'https://cdn.educba.com/academy/wp-content/uploads/2023/01/Tourist-Places-in-Dalhousie-1.jpg'
    },
    {
      id: 'kasol',
      name: 'Kasol',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'spiti',
      name: 'Spiti',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'amritsar',
      name: 'Amritsar',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'chandigarh',
      name: 'Chandigarh',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkO9xHJrUzdQcoMKrgTBcZOwXQlZJJcdCPEWta4qfdlj20k-V5NYJfuWc&s=10'
    },
    {
      id: 'srinagar',
      name: 'Srinagar',
      image: 'https://dynamic-media.tacdn.com/media/photo-o/34/27/bb/3c/caption.jpg?w=2400&h=-1&s=1'
    },
    {
      id: 'gulmarg',
      name: 'Gulmarg',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pahalgam',
      name: 'Pahalgam',
      image: 'https://cdn.travelcoffee.in/uploads/d90847bf-d5ad-4ba5-ac78-e5797470c8bb-Timeless_Kashmir_Retreat___Srinagar__Gulmarg___Pahalgam_Experience.webp'
    },
    {
      id: 'sonmarg',
      name: 'Sonmarg',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'patnitop',
      name: 'Patnitop',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'vaishno-devi',
      name: 'Vaishno Devi',
      image: 'https://duniyaghumo360.com/wp-content/uploads/2024/12/mata_vaishno_devi.jpg'
    },
    {
      id: 'wagah-border',
      name: 'Wagah Border',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGdYlxKB2qNSzsDI2D8mLUHhQnCVMzJcRyTv96B-Xf-5G9ydltaeQLP3c&s=10'
    }
  ];

  // Fleet for Custom Tour Form
  const fleetOptions = [
    { id: 'dzire', name: 'Dzire', image: '/assets/images/dzire.jpg' },
    { id: 'verna', name: 'Verna', image: '/assets/images/verna.png' },
    { id: 'ertiga', name: 'Ertiga', image: '/assets/images/ertiga.png' },
    { id: 'innova', name: 'Innova Crysta', image: '/assets/images/innova.png' },
    { id: 'tempo', name: 'Tempo Traveller', image: '/assets/images/tempo.png' }
  ];

  // Custom Tour Form State
  const [tourForm, setTourForm] = useState({
    destination: 'Shimla',
    startDate: todayStr,
    endDate: '',
    days: '3 Days',
    car: 'Innova Crysta'
  });

  const handleDestinationCardInquiry = (destName) => {
    setTourForm(prev => ({ ...prev, destination: destName }));
    const formElem = document.getElementById('custom-tour-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
    const msg = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to inquire about a tour package to *${destName}*. Please share available cars, itinerary and best price quote.`;
    bookOnWhatsApp(msg, siteConfig?.whatsappNumber);
  };

  const handleSendWhatsAppInquiry = (e) => {
    e.preventDefault();
    const msg = `Custom Tour Package Inquiry – ${siteConfig?.businessName || 'Happy Tour & Travels'}

Destination: ${tourForm.destination}
Start Date: ${tourForm.startDate || 'Not specified'}
End Date: ${tourForm.endDate || 'Not specified'}
Duration: ${tourForm.days}
Selected Car: ${tourForm.car}

Please share the best tour package price, hotel options, and cab itinerary.`;

    bookOnWhatsApp(msg, siteConfig?.whatsappNumber);
  };

  const handleSendEmailInquiry = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Tour Package Inquiry for ${tourForm.destination}`);
    const body = encodeURIComponent(`Hello Happy Tour & Travels,

I would like to get a quote for a tour package with the following details:

Destination: ${tourForm.destination}
Start Date: ${tourForm.startDate}
End Date: ${tourForm.endDate || 'N/A'}
Duration: ${tourForm.days}
Preferred Vehicle: ${tourForm.car}

Kindly provide the complete quotation and itinerary.

Thank you.`);

    const email = siteConfig?.email || 'contact@happytourandtravels.in';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="packages" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C1B33] via-[#0F284E] to-[#1E3A8A] text-white p-6 sm:p-10 shadow-2xl mb-12 border border-slate-700">
          
          {/* Subtle glow / backdrop overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Heading & 4 Feature Badges */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nexa tracking-tight text-white leading-tight">
                Tour Packages & <span className="text-[#FBBF24]">Travel Services</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-2 font-medium leading-relaxed max-w-xl">
                Explore North India with our comfortable car services. Choose your destination, select your dates and duration, and get a customized quote for your trip.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24] text-slate-950 flex items-center justify-center mb-1.5 shadow-sm">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight">
                    Wide Range of Destinations
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24] text-slate-950 flex items-center justify-center mb-1.5 shadow-sm">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight">
                    Well Maintained Cabs
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24] text-slate-950 flex items-center justify-center mb-1.5 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight">
                    Perfect for Family & Groups
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24] text-slate-950 flex items-center justify-center mb-1.5 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight">
                    Safe & Reliable Service
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Fleet Visual */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              
            </div>

          </div>
        </div>

        {/* TOP DESTINATIONS SECTION */}
        <div className="mb-14">
          
          {/* Header */}
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
                Top Destinations
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Explore the most popular destinations in Himachal, Punjab and J&K. Select your dates and duration to get a quote.
              </p>
            </div>
          </div>

          {/* 15 Destination Cards Grid (5 columns on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {topDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Destination Image & Name */}
                <div className="relative h-28 sm:h-36 overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  
                  <span className="absolute bottom-2 left-2.5 text-xs sm:text-sm font-black font-nexa text-white tracking-wide drop-shadow-md">
                    {dest.name}
                  </span>
                </div>

                {/* Send Inquiry Button */}
                <div className="p-2 bg-white">
                  <button
                    onClick={() => handleDestinationCardInquiry(dest.name)}
                    className="w-full bg-[#FBBF24] hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-[11px] sm:text-xs py-1.5 px-2 rounded-xl flex items-center justify-center space-x-1 shadow-2xs transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                    <span>Send Inquiry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PLAN YOUR CUSTOM TOUR CARD / FORM */}
        <div 
          id="custom-tour-form"
          className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-yellow-200 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-yellow-100">
            <div className="w-10 h-10 rounded-2xl bg-[#0B1B3D] text-[#FBBF24] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-nexa text-slate-900">
                Plan Your Custom Tour
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Tell us your travel plan and we will share the best car options and price on WhatsApp or Email.
              </p>
            </div>
          </div>

          <form className="space-y-6">
            
            {/* Top 4 Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Destination */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Destination <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={tourForm.destination}
                    onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value })}
                    className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer shadow-xs"
                  >
                    {topDestinations.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    <option value="All Himachal Tour">All Himachal Tour</option>
                    <option value="Kashmir Grand Tour">Kashmir Grand Tour</option>
                    <option value="Punjab Heritage Circuit">Punjab Heritage Circuit</option>
                    <option value="Custom / Multiple Cities">Custom / Multiple Cities</option>
                  </select>
                </div>
              </div>

              {/* 2. Start Date */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={todayStr}
                    value={tourForm.startDate}
                    onChange={(e) => setTourForm({ ...tourForm, startDate: e.target.value })}
                    className="w-full bg-white border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer shadow-xs"
                  />
                </div>
              </div>

              {/* 3. End Date */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={tourForm.startDate || todayStr}
                    value={tourForm.endDate}
                    onChange={(e) => setTourForm({ ...tourForm, endDate: e.target.value })}
                    className="w-full bg-white border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer shadow-xs"
                  />
                </div>
              </div>

              {/* 4. No. of Days */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  No. of Days <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={tourForm.days}
                    onChange={(e) => setTourForm({ ...tourForm, days: e.target.value })}
                    className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer shadow-xs"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="4 Days">4 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="6 Days">6 Days</option>
                    <option value="7 Days">7 Days</option>
                    <option value="8-10 Days">8–10 Days</option>
                    <option value="10+ Days">10+ Days</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Select Car & Action Buttons Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
              
              {/* Left: 5 Car Radio Cards */}
              <div className="lg:col-span-8">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Car <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {fleetOptions.map((car) => {
                    const isSelected = tourForm.car === car.name;
                    return (
                      <button
                        type="button"
                        key={car.id}
                        onClick={() => setTourForm({ ...tourForm, car: car.name })}
                        className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                          isSelected
                            ? 'bg-white border-yellow-400 ring-2 ring-yellow-400/50 shadow-md'
                            : 'bg-white/70 hover:bg-white border-gray-200'
                        }`}
                      >
                        <div className="w-full flex items-center justify-start mb-1">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-yellow-500 bg-yellow-400' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </span>
                        </div>
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-10 sm:h-12 w-auto object-contain my-1"
                        />
                        <span className="text-[11px] sm:text-xs font-black font-nexa text-slate-900 mt-1">
                          {car.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: 2 Action Buttons */}
              <div className="lg:col-span-4 flex flex-col space-y-3">
                {/* WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleSendWhatsAppInquiry}
                  className="w-full bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-black font-nexa py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all flex items-center justify-between group text-xs sm:text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>Send Inquiry on WhatsApp</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Email Button */}
                <button
                  type="button"
                  onClick={handleSendEmailInquiry}
                  className="w-full bg-white hover:bg-gray-50 active:scale-95 text-slate-900 border border-gray-300 font-bold py-3.5 px-5 rounded-2xl shadow-xs transition-all flex items-center justify-between group text-xs sm:text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-slate-700" />
                    <span>Send Inquiry on Email</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
