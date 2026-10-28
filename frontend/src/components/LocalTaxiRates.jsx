import React, { useState } from 'react';
import { Users, Clock, MessageCircle, PhoneCall, ShieldCheck, MapPin, Check } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { hourlyRentalPricing as fallbackHourlyPricing } from '../data/hourlyRentalPricing';

export default function LocalTaxiRates() {
  const { siteConfig, hourlyRentalPricing: contextHourly } = useSiteData();
  const [selectedCity, setSelectedCity] = useState('Jalandhar');

  const hourlyData = contextHourly?.defaultRates ? contextHourly : fallbackHourlyPricing;
  const ratesDzire = hourlyData.defaultRates?.dzire?.rates || {};
  const ratesErtiga = hourlyData.defaultRates?.ertiga?.rates || {};
  const ratesInnova = hourlyData.defaultRates?.innova?.rates || {};

  const hourlyCars = [
    {
      id: 'dzire',
      name: hourlyData.defaultRates?.dzire?.name || 'Dzire / similar',
      subtitle: hourlyData.defaultRates?.dzire?.subtitle || 'Dzire size / similar car may be provided',
      image: hourlyData.defaultRates?.dzire?.image || '/assets/images/dzire.jpg',
      seats: hourlyData.defaultRates?.dzire?.seats || '4 Passengers',
      fuel: hourlyData.defaultRates?.dzire?.fuel || 'Diesel / Petrol / CNG',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: Number(ratesDzire['4h40k']) || 1100 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: Number(ratesDzire['8h80k']) || 1600 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: Number(ratesDzire['10h100k']) || 2000 }
      ]
    },
    {
      id: 'ertiga',
      name: hourlyData.defaultRates?.ertiga?.name || 'Ertiga / similar',
      subtitle: hourlyData.defaultRates?.ertiga?.subtitle || 'Ertiga or similar comfortable car may be provided',
      image: hourlyData.defaultRates?.ertiga?.image || '/assets/images/ertiga.png',
      seats: hourlyData.defaultRates?.ertiga?.seats || '6–7 Seater',
      fuel: hourlyData.defaultRates?.ertiga?.fuel || 'Diesel / Petrol / CNG',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: Number(ratesErtiga['4h40k']) || 1500 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: Number(ratesErtiga['8h80k']) || 2300 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: Number(ratesErtiga['10h100k']) || 2800 }
      ]
    },
    {
      id: 'innova',
      name: hourlyData.defaultRates?.innova?.name || 'Innova Crysta',
      subtitle: hourlyData.defaultRates?.innova?.subtitle || '',
      image: hourlyData.defaultRates?.innova?.image || '/assets/images/innova.png',
      seats: hourlyData.defaultRates?.innova?.seats || '7–8 Seater',
      fuel: hourlyData.defaultRates?.innova?.fuel || 'Diesel',
      packages: [
        { id: '4h40k', label: '4 Hours / 40 KM', rate: Number(ratesInnova['4h40k']) || 2200 },
        { id: '8h80k', label: '8 Hours / 80 KM', rate: Number(ratesInnova['8h80k']) || 3200 },
        { id: '10h100k', label: '10 Hours / 100 KM', rate: Number(ratesInnova['10h100k']) || 3900 }
      ]
    }
  ];

  const popularCities = (Array.isArray(hourlyData.cities) && hourlyData.cities.length > 0)
    ? hourlyData.cities.filter(c => c.popular && c.active !== false).map(c => c.name)
    : [
        'Jalandhar', 'Amritsar', 'Ludhiana', 'Chandigarh', 'Mohali',
        'Shimla', 'Manali', 'Dharamshala', 'Delhi', 'Gurgaon', 'Jaipur'
      ];

  const handleBookNow = (car, pkg) => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const msg = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to book an Hourly Rental car.

*Hourly Rental Booking Details:*
- City: ${selectedCity}
- Date: ${today}
- Car: ${car.name}
- Package: ${pkg.label}
- Rate: ₹${pkg.rate.toLocaleString('en-IN')} (Fuel & Chauffeur Included)

Please confirm cab availability.`;

    bookOnWhatsApp(msg, siteConfig?.whatsappNumber);
  };

  return (
    <section id="local-taxi-rates" className="py-14 sm:py-20 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30 inline-flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Hourly Car Rental Packages</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            City Hourly Taxi Rental Rates
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 font-medium">
            Affordable 4 Hours, 8 Hours & 10 Hours rental packages with verified chauffeurs and clean AC cabs.
          </p>

          {/* Quick City Switcher */}
          <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 touch-scroll">
            <span className="text-xs font-bold text-gray-400 mr-1 flex-shrink-0 hidden sm:inline">Select City:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 touch-manipulation ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-slate-900 text-yellow-400 shadow-md ring-2 ring-yellow-400/40'
                    : 'bg-gray-100 hover:bg-gray-200 text-slate-800'
                }`}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Car Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {hourlyCars.map((car) => (
            <div 
              key={car.id}
              className="bg-gray-50/90 rounded-3xl overflow-hidden border border-gray-200/90 shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 hover:border-yellow-400"
            >
              <div>
                {/* Image */}
                <div className="h-48 bg-gradient-to-b from-slate-100 to-gray-200 p-4 flex items-center justify-center">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Car Details */}
                <div className="p-6 pb-2">
                  <h3 className="text-2xl font-black font-nexa text-slate-900">
                    {car.name}
                  </h3>
                  {car.subtitle && (
                    <p className="text-xs text-amber-900 font-semibold mt-0.5">
                      {car.subtitle}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-gray-200/80">
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-yellow-600" />
                      {car.seats}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{car.fuel}</span>
                  </div>
                </div>
              </div>

              {/* 3 Packages */}
              <div className="p-6 pt-2 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  City: <strong className="text-slate-950">{selectedCity}</strong>
                </span>

                {car.packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="bg-white hover:bg-amber-50/80 rounded-2xl p-3 border border-gray-200 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {pkg.label}
                      </span>
                      <span className="text-base font-black font-nexa text-slate-950 mt-0.5 block">
                        ₹{pkg.rate.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookNow(car, pkg)}
                      className="py-2 px-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs transition-transform hover:scale-105 shadow-sm flex items-center space-x-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
