import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Plane, ArrowRightCircle, Repeat, Clock } from 'lucide-react';
import useMobileKeyboard from '../hooks/useMobileKeyboard';

export default function MobileBottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isKeyboardOpen = useMobileKeyboard();
  const [isNavHidden, setIsNavHidden] = useState(false);

  const currentTypeFromUrl = searchParams.get('tripType') || 'One Way';
  const [activeType, setActiveType] = useState(currentTypeFromUrl);

  useEffect(() => {
    const handleCustomTripType = (e) => {
      if (e.detail) {
        setActiveType(e.detail);
      }
    };
    window.addEventListener('selectTripType', handleCustomTripType);
    return () => window.removeEventListener('selectTripType', handleCustomTripType);
  }, []);

  useEffect(() => {
    const param = searchParams.get('tripType');
    if (param) {
      setActiveType(param);
    }
  }, [searchParams]);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top of the page
      if (currentScrollY <= 20) {
        setIsNavHidden(false);
        previousScrollY = currentScrollY;
        return;
      }

      // Hide when user scrolls down the page (finger swipe up / scrollY increases)
      if (currentScrollY > previousScrollY + 6) {
        setIsNavHidden(true);
      } 
      // Show when user scrolls up towards the top (finger swipe down / scrollY decreases)
      else if (currentScrollY < previousScrollY - 6) {
        setIsNavHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tripTabs = [
    {
      id: 'Airport',
      label: 'Airport',
      subtext: 'Flight Drop',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-sm">
          <Plane className="w-4 h-4 transform -rotate-45" />
        </div>
      ),
    },
    {
      id: 'One Way',
      label: 'One Way',
      subtext: 'From ₹12/km',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-sm">
          <ArrowRightCircle className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'Round Trip',
      label: 'Round Trip',
      subtext: 'From ₹11/km',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm">
          <Repeat className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'Hourly Rental',
      label: 'Hourly Rental',
      subtext: '8h / 80km',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-sm">
          <Clock className="w-4 h-4" />
        </div>
      ),
    },
  ];

  const handleTabClick = (type) => {
    setActiveType(type);
    // If on home, scroll to booking form and set type
    if (location.pathname === '/') {
      const formElem = document.getElementById('home');
      if (formElem) {
        formElem.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(new CustomEvent('selectTripType', { detail: type }));
    } else if (location.pathname === '/search') {
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('tripType', type);
      navigate(`/search?${currentParams.toString()}`);
    } else {
      navigate(`/?tripType=${encodeURIComponent(type)}`);
    }
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] transition-transform duration-200 ${isKeyboardOpen || isNavHidden ? 'translate-y-full pointer-events-none' : 'translate-y-0'}`}>
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        {tripTabs.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl active:scale-95 transition-all text-center relative touch-manipulation min-h-[48px] ${
                isActive
                  ? 'bg-amber-50/90 border border-yellow-400/80 shadow-sm ring-1 ring-yellow-400/30'
                  : 'hover:bg-gray-50 text-slate-700'
              }`}
            >
              <div className="relative mb-0.5">
                {tab.icon}
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span
                className={`text-[11px] font-bold leading-tight transition-colors ${
                  isActive ? 'text-slate-950 font-extrabold' : 'text-slate-700'
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`text-[9px] leading-tight font-semibold ${
                  isActive ? 'text-amber-800 font-bold' : 'text-gray-500'
                }`}
              >
                {tab.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
