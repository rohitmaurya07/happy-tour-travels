import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const showDarkTransparentNav = isHome && !isScrolled;

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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner for Local SEO & Contact Quick Bar */}
      <div className="bg-slate-950 text-gray-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-yellow-400 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Primary Hub: North India (Serving Punjab, Himachal, Chandigarh & Delhi NCR)
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
      <nav
        className={`transition-all duration-300 ${
          showDarkTransparentNav
            ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4 text-white'
            : 'bg-white text-slate-900 shadow-md py-3 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Company Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/assets/images/logo.jpg"
              alt="Happy Tour & Travels Jalandhar Logo"
              className="h-12 w-auto rounded-lg group-hover:scale-105 transition-transform"
            />
            <div>
              <span
                className={`text-xl font-nexa tracking-tight font-heading block leading-none ${
                  showDarkTransparentNav ? 'text-white' : 'text-slate-900'
                }`}
              >
                Happy <span className="text-brand-yellow">Tour & Travels</span>
              </span>
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
                      : showDarkTransparentNav
                      ? 'text-gray-100 hover:text-brand-yellow'
                      : 'text-slate-700 hover:text-brand-yellow'
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
              className={`p-2 rounded-lg focus:outline-none transition-colors ${
                showDarkTransparentNav
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-7 h-7 ${showDarkTransparentNav ? 'text-white' : 'text-slate-900'}`} />
              ) : (
                <Menu className={`w-7 h-7 ${showDarkTransparentNav ? 'text-white' : 'text-slate-900'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden backdrop-blur-xl border-b px-4 pt-4 pb-6 mt-2 space-y-3 transition-all animate-fadeIn ${
              showDarkTransparentNav
                ? 'bg-slate-950/95 text-white border-slate-800'
                : 'bg-white text-slate-900 border-gray-200 shadow-xl'
            }`}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-yellow text-slate-950 font-nexa'
                      : showDarkTransparentNav
                      ? 'text-gray-200 hover:bg-slate-800 hover:text-brand-yellow'
                      : 'text-slate-900 hover:bg-gray-100 hover:text-brand-yellow'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div
              className={`pt-3 border-t flex flex-col space-y-2 ${
                showDarkTransparentNav ? 'border-slate-800' : 'border-gray-200'
              }`}
            >
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

