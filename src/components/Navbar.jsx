import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, MapPin, MessageCircleIcon, MessageCircleDashed, MessageCirclePlus } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Tour Packages', path: '/packages' },
    { name: 'Routes & Local Info', path: '/routes' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleBookClick = () => {
    bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about taxi availability and booking details.`);
  };

  const isHome = window.location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner for Local SEO & Contact Quick Bar */}
      <div className="bg-slate-950 text-gray-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-yellow-400 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Primary Hub: Jalandhar, Punjab (Serving Punjab, Himachal & Delhi NCR)
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">24/7 Outstation & Airport Taxi Booking</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`tel:${siteConfig.phoneNumber}`} className="hover:text-yellow-400 transition-colors flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-yellow-400" />
              {siteConfig.phoneNumberFormatted}
            </a>
            <span>•</span>
            <button 
              onClick={handleBookClick}
              className="text-yellow-400 hover:underline flex items-center font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              WhatsApp Instant Booking
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        (() => {
          if (!isHome) return 'bg-white text-slate-900 shadow-md py-3 border-b border-gray-100';
          return isScrolled
            ? 'bg-white text-slate-900 shadow-md py-3 border-b border-gray-100'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4 text-white';
        })()
      }`}
      >  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Company Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/assets/images/logo.jpg"
              alt="Happy Tour & Travels Jalandhar Logo"
              className="h-12 w-auto rounded-lg group-hover:scale-105 transition-transform"
            />
            <div>
              <span className={`text-xl font-nexa tracking-tight font-heading block leading-none ${
                !isHome || isScrolled ? 'text-slate-900' : 'text-white'
              }`}>
                Happy <span className="text-brand-yellow">Tour & Travels</span>
              </span>
              {/* <span className={`text-[10px] uppercase tracking-widest font-semibold block mt-0.5 ${
                !isHome || isScrolled ? 'text-gray-500' : 'text-yellow-300/90'
              }`}>
                Taxi Service Jalandhar
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-yellow font-nexa underline underline-offset-8 decoration-2'
                      : !isHome
                      ? 'text-slate-900 hover:text-brand-yellow'
                      : isScrolled
                      ? 'text-slate-700 hover:text-brand-yellow'
                      : 'text-gray-100 hover:text-brand-yellow'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handleBookClick}
              className="yellow-gradient-btn px-5 py-2.5 rounded-full text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <Phone className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Book / Contact Us</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none ${
                isScrolled ? 'text-slate-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-7 h-7 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-7 h-7 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
    <div className={`lg:hidden ${!isHome || isScrolled ? 'bg-white text-slate-900' : 'bg-slate-950/95 text-white'} backdrop-blur-xl border-b border-slate-800 px-4 pt-4 pb-6 mt-2 space-y-3 transition-all animate-fadeIn`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                 className={({ isActive }) =>
                   `block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                     isActive
                       ? 'bg-brand-yellow text-slate-950 font-nexa'
                       : `${!isHome || isScrolled ? 'text-slate-900 hover:bg-gray-100 hover:text-brand-yellow' : 'text-gray-200 hover:bg-slate-800 hover:text-brand-yellow'}`
                   }`
                 }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBookClick();
                }}
                className="w-full yellow-gradient-btn py-3 rounded-xl text-slate-950 font-bold text-base flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950 stroke-none" />
                <span>Book / Contact Us on WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
