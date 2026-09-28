import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { 
  CheckCircle, ShieldCheck, MapPin, Plane, 
  Clock, PhoneCall, MessageCircle, Star, ArrowRight, Car, Award 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function CityTaxiPage() {
  const { slug } = useParams();
  const { siteConfig, fleet } = useSiteData();

  // Normalize slug to City Name
  const formatCityName = (s) => {
    if (!s) return 'Jalandhar';
    return s
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const cityName = formatCityName(slug);
  const isAirport = slug?.includes('airport');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${cityName} Taxi Service | Best Cab Booking & Airport Transfers - Happy Tour & Travels`;
  }, [cityName]);

  const topRoutes = [
    { destination: 'Delhi Airport (IGI)', dzire: '₹5,460', ertiga: '₹6,000', innova: '₹7,500' },
    { destination: 'Amritsar Airport', dzire: '₹1,900', ertiga: '₹2,400', innova: '₹3,500' },
    { destination: 'Chandigarh Airport', dzire: '₹2,500', ertiga: '₹3,000', innova: '₹4,500' },
    { destination: 'Shimla', dzire: '₹3,600', ertiga: '₹4,320', innova: '₹5,400' },
    { destination: 'Manali', dzire: '₹6,300', ertiga: '₹7,560', innova: '₹9,450' },
    { destination: 'Dharamshala', dzire: '₹3,450', ertiga: '₹4,140', innova: '₹5,175' },
  ];

  const handleInquiry = (route = '') => {
    const msg = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I am looking for taxi service in/from ${cityName}${route ? ` to ${route}` : ''}. Please share rates and car availability.`;
    bookOnWhatsApp(msg, siteConfig?.whatsappNumber);
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 rounded-full text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4 text-brand-yellow" />
            <span>#1 Rated {cityName} Cab Service</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-nexa text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {cityName} Taxi & Outstation Cab Service
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Book verified AC cabs from <strong className="text-yellow-400">{cityName}</strong> for one-way drops, airport transfers to Delhi/Amritsar/Chandigarh, and Himachal hill tour packages at 100% fixed transparent tariffs.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-300">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" /> 24/7 Cab Availability</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" /> Clean Sanitized Cars</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" /> Zero Hidden Charges</span>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <BookingForm initialFromLocation={cityName} />
      </section>

      {/* Popular Route Tariff Matrix for this City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">Fixed Tariff Rate Card</span>
              <h2 className="text-2xl font-black font-nexa text-slate-900 mt-1">
                Popular Taxi Routes from {cityName}
              </h2>
            </div>
            <button
              onClick={() => handleInquiry()}
              className="yellow-gradient-btn px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Inquire via WhatsApp</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
                  <th className="p-3.5 rounded-l-xl">Destination Route</th>
                  <th className="p-3.5">Dzire (Sedan)</th>
                  <th className="p-3.5">Ertiga (6-Seater)</th>
                  <th className="p-3.5">Innova Crysta</th>
                  <th className="p-3.5 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-semibold text-slate-800">
                {topRoutes.map((r, i) => (
                  <tr key={i} className="hover:bg-amber-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-yellow-500 flex-shrink-0" />
                      <span>{cityName} ➔ {r.destination}</span>
                    </td>
                    <td className="p-3.5 text-slate-900 font-bold">{r.dzire}</td>
                    <td className="p-3.5 text-slate-900 font-bold">{r.ertiga}</td>
                    <td className="p-3.5 text-slate-900 font-bold">{r.innova}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleInquiry(r.destination)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black transition-all inline-flex items-center space-x-1 shadow-sm"
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
      </section>

      {/* SEO FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h3 className="text-xl font-black font-nexa text-slate-900 mb-6 text-center">
          Frequently Asked Questions — {cityName} Taxi Service
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-slate-900">How can I book a cab from {cityName}?</h4>
            <p className="text-xs text-gray-600 mt-1.5">You can search available cars above or directly chat with us on WhatsApp at {siteConfig?.phone || '+91 78371 75090'} for instant confirmation.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-slate-900">Are driver allowances and fuel included in the fare?</h4>
            <p className="text-xs text-gray-600 mt-1.5">Yes, all our fixed tariffs include highway fuel and chauffeur services. State toll taxes and parking are payable at actuals.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-slate-900">Do you offer 24x7 airport drop service from {cityName}?</h4>
            <p className="text-xs text-gray-600 mt-1.5">Yes, we provide round-the-clock airport transfers from {cityName} to Delhi IGI Airport, Amritsar Sri Guru Ram Dass Jee Airport, and Chandigarh International Airport.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
