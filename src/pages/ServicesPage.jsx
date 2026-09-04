import React from 'react';
import Services from '../components/Services';
import LocalTaxiRates from '../components/LocalTaxiRates';
import { Plane, Navigation, Car, Compass, Clock, ShieldCheck, CheckCircle, MessageCircle } from 'lucide-react';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { siteConfig } from '../config/siteConfig';

export default function ServicesPage() {
  const serviceRates = [
    { type: 'One Way Taxi (Jalandhar → Delhi)', vehicle: 'Sedan (Dzire)', rate: '₹3,500 Approx (Fixed One-Way)', time: '5.5 Hours' },
    { type: 'One Way Taxi (Jalandhar → Chandigarh)', vehicle: 'Sedan (Dzire)', rate: '₹2,200 Approx (Fixed One-Way)', time: '2.5 Hours' },
    { type: 'One Way Taxi (Jalandhar → Amritsar)', vehicle: 'Sedan (Dzire)', rate: '₹1,600 Approx (Fixed One-Way)', time: '1.5 Hours' },
    { type: 'Airport Drop (Amritsar ATQ Airport)', vehicle: 'Sedan / MUV', rate: '₹1,800 - ₹2,500', time: '1.5 Hours' },
    { type: 'Airport Drop (Chandigarh IXC Airport)', vehicle: 'Sedan / MUV', rate: '₹2,400 - ₹3,200', time: '2.5 Hours' },
    { type: 'Airport Drop (Delhi IGI Airport)', vehicle: 'Sedan / MUV / SUV', rate: '₹4,500 - ₹6,500', time: '5.5 Hours' },
    { type: 'Himachal Tour (Shimla/Manali)', vehicle: 'Innova / Ertiga', rate: '₹18 - ₹20 / Km (Daily Min 250 Km)', time: 'Multi-Day Tour' }
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      
      {/* Main Services Grid Component */}
      <Services />

      {/* Local Taxi Rental Hourly Rates */}
      <LocalTaxiRates />

      {/* Transparent Rate Card Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-brand-yellow" />
                <span>Transparent Fare Guide</span>
              </div>
              <h3 className="text-2xl font-nexa text-slate-900 font-heading mt-1">
                Popular Service Tariffs & Estimate Matrix
              </h3>
            </div>
            <button
              onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to get a customized fare estimate for my trip.`)}
              className="yellow-gradient-btn px-6 py-3 rounded-full text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Get Custom Quote on WhatsApp</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
                  <th className="p-4 rounded-l-xl">Service / Route</th>
                  <th className="p-4">Recommended Vehicle</th>
                  <th className="p-4">Estimated Rate / Fare</th>
                  <th className="p-4">Est. Travel Time</th>
                  <th className="p-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-semibold text-slate-800">
                {serviceRates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-yellow-400/5 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.type}</td>
                    <td className="p-4 text-gray-600">{item.vehicle}</td>
                    <td className="p-4 text-brand-gold font-bold">{item.rate}</td>
                    <td className="p-4 text-gray-500">{item.time}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I want to book: ${item.type}. Please share details.`)}
                        className="bg-slate-900 hover:bg-slate-800 text-yellow-400 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-yellow-400 stroke-none" />
                        <span>Book</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
