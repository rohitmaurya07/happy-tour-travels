import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

import CallToActionBanner from './CallToActionBanner';

export default function Footer() {
  const { siteConfig } = useSiteData();

  return (
    <footer className="bg-slate-950 text-gray-400 text-sm border-t border-slate-800 relative overflow-hidden">
      
      {/* Top CTA Banner */}
      <CallToActionBanner />

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
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

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row  items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 {siteConfig.businessName}. All Rights Reserved.</p>

          <p>Designed and developed by <a className='font-manrope font-bold ' href="https://rohitmaurya.space/">Rohit Maurya</a></p>
          
          <div className="flex items-center   space-x-6 ">
            <Link to="/contact" className="hover:text-gray-400">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
