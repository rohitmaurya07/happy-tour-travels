import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Services from '../components/Services';
import LocalTaxiRates from '../components/LocalTaxiRates';
import { CheckCircle, MessageCircle, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { siteConfig } = useSiteData();
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [modalDate, setModalDate] = useState(todayStr);
  const [modalTime, setModalTime] = useState('09:00');

  const serviceRates = [
    { from: 'Jalandhar', to: 'Delhi Airport', type: 'Airport Drop (Delhi IGI Airport)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹5,460 | Ertiga ₹6,000 | Innova ₹7,500', tripType: 'Airport' },
    { from: 'Jalandhar', to: 'Amritsar Airport', type: 'Airport Drop (Amritsar ATQ Airport)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹1,900 | Ertiga ₹2,400 | Innova ₹3,500', tripType: 'Airport' },
    { from: 'Jalandhar', to: 'Chandigarh Airport', type: 'Airport Drop (Chandigarh IXC Airport)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹2,500 | Ertiga ₹3,000 | Innova ₹4,500', tripType: 'Airport' },
    { from: 'Jalandhar', to: 'Delhi', type: 'One Way Taxi (Jalandhar → Delhi NCR)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹5,460 | Ertiga ₹6,000 | Innova ₹7,500', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Chandigarh', type: 'One Way Taxi (Jalandhar → Chandigarh)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹2,500 | Ertiga ₹3,000 | Innova ₹4,500', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Amritsar', type: 'One Way Taxi (Jalandhar → Amritsar)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹1,900 | Ertiga ₹2,400 | Innova ₹3,500', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Shimla', type: 'Hill Station One Way (Jalandhar → Shimla)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹3,600 | Ertiga ₹4,320 | Innova ₹5,400', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Manali', type: 'Himachal Tour (Jalandhar → Manali)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹6,300 | Ertiga ₹7,560 | Innova ₹9,450', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Haridwar', type: 'Pilgrimage Route (Jalandhar → Haridwar)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹4,500 | Ertiga ₹5,400 | Innova ₹6,750', tripType: 'One Way' },
    { from: 'Jalandhar', to: 'Katra', type: 'Vaishno Devi Route (Jalandhar → Katra)', vehicle: 'Dzire / Ertiga / Innova', rate: 'Dzire ₹4,500 | Ertiga ₹5,400 | Innova ₹6,750', tripType: 'One Way' },
  ];

  const handleOpenBookingModal = (item) => {
    setSelectedRouteForBooking(item);
  };

  const handleConfirmSearch = (e) => {
    e.preventDefault();
    if (!selectedRouteForBooking) return;

    const q = new URLSearchParams({
      tripType: selectedRouteForBooking.tripType || 'One Way',
      from: selectedRouteForBooking.from,
      to: selectedRouteForBooking.to,
      date: modalDate,
      time: modalTime,
    }).toString();

    navigate(`/search?${q}`);
  };

  return (
    <div className="pt-20 pb-20 bg-gray-50 min-h-screen">
      
      {/* Main Services Grid Component */}
      <Services />

      {/* Local Taxi Rental Hourly Rates */}
      <LocalTaxiRates />

      {/* Transparent Rate Card Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-gray-100 pb-5 sm:pb-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-brand-yellow" />
                <span>Predefined Fixed Fare Guide</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-nexa text-slate-900 font-heading mt-1">
                Popular Service Tariffs & Route Matrix
              </h3>
            </div>
            <button
              onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to get a customized fare estimate for my trip.`)}
              className="yellow-gradient-btn px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Get Custom Quote on WhatsApp</span>
            </button>
          </div>

          <div className="overflow-x-auto touch-scroll no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
                  <th className="p-3.5 sm:p-4 rounded-l-xl">Service / Route</th>
                  <th className="p-3.5 sm:p-4">Available Vehicles</th>
                  <th className="p-3.5 sm:p-4">Fixed Rates (Dzire / Ertiga / Innova)</th>
                  <th className="p-3.5 sm:p-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-semibold text-slate-800">
                {serviceRates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-yellow-400/5 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-900">
                      <div>{item.type}</div>
                      <span className="text-[11px] text-gray-500 font-medium">{item.from} ➔ {item.to}</span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-gray-600">{item.vehicle}</td>
                    <td className="p-3.5 sm:p-4 text-slate-950 font-bold">{item.rate}</td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <button
                        onClick={() => handleOpenBookingModal(item)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all inline-flex items-center space-x-1.5 shadow-sm hover:scale-105 active:scale-95 touch-manipulation"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Date & Time Selection Modal before Search Navigation */}
      {selectedRouteForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-gray-100 relative text-left">
            <button
              onClick={() => setSelectedRouteForBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Schedule Your Ride
            </span>

            <h3 className="text-lg sm:text-xl font-black font-nexa text-slate-900 mt-2 mb-1">
              {selectedRouteForBooking.from} ➔ {selectedRouteForBooking.to}
            </h3>
            <p className="text-xs text-gray-500 mb-4 sm:mb-5">
              Select your travel date and pickup time to view all available vehicles and fixed prices.
            </p>

            <form onSubmit={handleConfirmSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                  <span>Departure Date</span>
                </label>
                <input
                  type="date"
                  value={modalDate}
                  min={todayStr}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                  <span>Pickup Time</span>
                </label>
                <input
                  type="time"
                  value={modalTime}
                  onChange={(e) => setModalTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRouteForBooking(null)}
                  className="w-1/3 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 yellow-gradient-btn py-3 rounded-xl text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 min-h-[44px] active:scale-98"
                >
                  <span>View All Vehicles & Fares</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
