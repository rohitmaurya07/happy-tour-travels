import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Footer() {
  const handleBookClick = () => {
    bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about taxi booking rates.`);
  };

  return (
    <footer className="bg-slate-950 text-gray-400 text-sm border-t border-slate-800 relative overflow-hidden">
      
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-yellow-500 via-brand-yellow to-yellow-400 text-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl sm:text-3xl font-nexa font-heading tracking-tight text-slate-950">
              Ready to Book Your Ride From Jalandhar?
            </h3>
            <p className="text-sm font-semibold text-slate-900/80 mt-1">
              Instant booking confirmation via WhatsApp with clean AC cabs and verified drivers.
            </p>
          </div>
          <button
            onClick={handleBookClick}
            className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center space-x-2 shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-yellow-400 text-slate-950 stroke-none" />
            <span>Book on WhatsApp Now</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Company Profile */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/assets/images/logo.jpg"
                alt="Happy Tour & Travels Jalandhar Logo"
                className="h-14 w-auto rounded-lg"
              />
              <div>
                <span className="text-xl font-nexa tracking-tight font-heading text-white block leading-none">
                  Happy <span className="text-brand-yellow">Tour & Travels</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-yellow-300/90 block mt-0.5">
                  Taxi Service Jalandhar
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm pt-2">
              Premier tour and travels agency operating from Jalandhar, Punjab. Specializing in outstation cabs, one-way taxi, airport transfers to Amritsar/Chandigarh/Delhi, and customized Himachal tour packages.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-gray-300">
              <span className="flex items-center text-yellow-400">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                Jalandhar, Punjab
              </span>
              <span>•</span>
              <span>24/7 Available</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base font-heading mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Our Fleet', path: '/fleet' },
                { name: 'Tour Packages', path: '/packages' },
                { name: 'Routes & Local Info', path: '/routes' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-brand-yellow transition-colors flex items-center">
                    <ChevronRight className="w-3 h-3 mr-1.5 text-brand-yellow" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-white font-bold text-base font-heading mb-4 border-b border-slate-800 pb-2">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                'Airport Transfer',
                'One Way Taxi',
                'Outstation Taxi',
                'Tour Packages',
                'Hourly Rentals',
                'Corporate & Wedding Fleet'
              ].map((item) => (
                <li key={item}>
                  <Link to="/services" className="hover:text-brand-yellow transition-colors flex items-center">
                    <ChevronRight className="w-3 h-3 mr-1.5 text-brand-yellow" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Popular Routes */}
          <div>
            <h4 className="text-white font-bold text-base font-heading mb-4 border-b border-slate-800 pb-2">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {siteConfig.popularDestinations.map((dest) => (
                <li key={dest.name} className="flex items-center justify-between text-gray-300">
                  <span className="hover:text-brand-yellow transition-colors cursor-pointer" onClick={handleBookClick}>
                    Jalandhar ↔ {dest.name}
                  </span>
                  <span className="text-[10px] text-gray-500">{dest.state}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 {siteConfig.businessName}. All Rights Reserved.</p>
          
          <div className="flex items-center space-x-6">
            <Link to="/routes" className="hover:text-gray-400">Local SEO Jalandhar</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gray-400">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
