import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, ArrowRight, Search, AlertCircle, 
  Plane, Sparkles, X, Crosshair, ShieldCheck, MessageCircle, 
  PhoneCall, Building2, ChevronRight, Repeat, Info
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import { getDistanceKm } from '../utils/distance';

export default function BookingForm({ 
  onSearch, 
  initialTripType = 'One Way', 
  initialFromLocation = '',
  initialToLocation = '',
  initialDepartureDate = '',
  initialPickupTime = '',
  initialValues = null,
  compact = false 
}) {
  const navigate = useNavigate();
  const { popularLocations, siteConfig } = useSiteData();

  // Get current date and time defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultTimeStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 25);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const effectiveTripType = initialValues?.tripType || initialTripType || 'One Way';
  const effectiveFrom = initialValues?.fromLocation || initialValues?.from || initialFromLocation || '';
  const effectiveTo = initialValues?.toLocation || initialValues?.to || initialToLocation || '';
  const effectiveDate = initialValues?.departureDate || initialValues?.date || initialDepartureDate || todayStr;
  const effectiveTime = initialValues?.pickupTime || initialValues?.time || initialPickupTime || defaultTimeStr();

  const [tripType, setTripType] = useState(effectiveTripType);
  const [fromLocation, setFromLocation] = useState(effectiveFrom);
  const [toLocation, setToLocation] = useState(effectiveTo);
  const [departureDate, setDepartureDate] = useState(effectiveDate);
  const [pickupTime, setPickupTime] = useState(effectiveTime);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state if initial props change
  useEffect(() => {
    if (effectiveTripType) setTripType(effectiveTripType);
  }, [effectiveTripType]);

  useEffect(() => {
    if (effectiveFrom) setFromLocation(effectiveFrom);
  }, [effectiveFrom]);

  useEffect(() => {
    if (effectiveTo) setToLocation(effectiveTo);
  }, [effectiveTo]);

  useEffect(() => {
    if (effectiveDate) setDepartureDate(effectiveDate);
  }, [effectiveDate]);

  useEffect(() => {
    if (effectiveTime) setPickupTime(effectiveTime);
  }, [effectiveTime]);

  // Suggestions state
  const [activeInput, setActiveInput] = useState(null); // 'from' | 'to' | null
  const [isLocating, setIsLocating] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const tripTypes = ['Airport', 'One Way', 'Round Trip', 'Hourly Rental'];

  // Route distance estimation for minimum buffer calculation
  const currentRouteDist = useMemo(() => {
    if (tripType === 'Hourly Rental') return 40;
    return getDistanceKm(fromLocation, toLocation) || 0;
  }, [fromLocation, toLocation, tripType]);

  // Dynamic minimum allowed pickup time for today based on route distance
  // 0-100 KM -> min 20 minutes from current time
  // 100-400 KM (>100 KM) -> min 30 minutes from current time
  const advanceBufferMinutes = useMemo(() => {
    return currentRouteDist > 100 ? 30 : 20;
  }, [currentRouteDist]);

  const minPickupTimeToday = useMemo(() => {
    if (departureDate !== todayStr) return '';
    const now = new Date();
    now.setMinutes(now.getMinutes() + advanceBufferMinutes);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }, [departureDate, todayStr, advanceBufferMinutes]);

  // Auto-adjust pickup time if user has an expired/invalid past time for today
  useEffect(() => {
    if (departureDate === todayStr && minPickupTimeToday) {
      if (!pickupTime || pickupTime < minPickupTimeToday) {
        setPickupTime(minPickupTimeToday);
      }
    }
  }, [departureDate, todayStr, minPickupTimeToday]);

  // Helper to determine whether a location is an airport
  const isAirportLocation = (item) => {
    const name = (item.name || item.title || '').toLowerCase();
    const type = (item.type || '').toLowerCase();
    return type.includes('airport') || name.includes('airport');
  };

  // Simple, fast location filter
  const getFilteredSuggestions = (query) => {
    const list = popularLocations || [];
    const cleanQ = (query || '').trim().toLowerCase();

    if (!cleanQ) {
      return list.slice(0, 15).map((item) => ({
        title: item.name,
        subtitle: item.state || 'Punjab',
        isAirport: isAirportLocation(item),
      }));
    }

    const matched = list.filter((loc) => {
      const name = (loc.name || '').toLowerCase();
      const state = (loc.state || '').toLowerCase();
      return name.includes(cleanQ) || state.includes(cleanQ);
    });

    return matched.slice(0, 20).map((item) => ({
      title: item.name,
      subtitle: item.state || 'Punjab',
      isAirport: isAirportLocation(item),
    }));
  };

  const currentQuery = activeInput === 'from' ? fromLocation : activeInput === 'to' ? toLocation : '';

  const currentSuggestions = useMemo(() => {
    if (!activeInput) return [];
    return getFilteredSuggestions(currentQuery);
  }, [activeInput, currentQuery, popularLocations]);

  // Popular routes / shortcuts
  const popularAirportRoutes = [
    { label: 'Jalandhar ↔ Delhi Airport', from: 'Jalandhar', to: 'Delhi Airport' },
    { label: 'Jalandhar ↔ Amritsar Airport', from: 'Jalandhar', to: 'Amritsar Airport' },
    { label: 'Jalandhar ↔ Chandigarh Airport', from: 'Jalandhar', to: 'Chandigarh Airport' },
    { label: 'Ludhiana ↔ Delhi Airport', from: 'Ludhiana', to: 'Delhi Airport' },
    { label: 'Phagwara ↔ Delhi Airport', from: 'Phagwara', to: 'Delhi Airport' },
  ];

  const popularHourlyCities = [
    'Jalandhar', 'Amritsar', 'Ludhiana', 'Chandigarh', 'Mohali',
    'Shimla', 'Manali', 'Dharamshala', 'Delhi', 'Gurgaon', 'Jaipur'
  ];

  // Listen for mobile bottom bar trip type selection
  useEffect(() => {
    const handleCustomTripType = (e) => {
      if (e.detail) {
        handleTripTypeChange(e.detail);
      }
    };
    window.addEventListener('selectTripType', handleCustomTripType);
    return () => window.removeEventListener('selectTripType', handleCustomTripType);
  }, []);

  const handleTripTypeChange = (type) => {
    setTripType(type);
    setErrorMsg('');
    if (type === 'Hourly Rental') {
      setToLocation('Local City Rental (8 Hrs / 80 Kms)');
    } else if (toLocation.includes('Local') || toLocation.includes('Rental')) {
      setToLocation('');
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        fromRef.current && !fromRef.current.contains(e.target) &&
        toRef.current && !toRef.current.contains(e.target)
      ) {
        setActiveInput(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationInputChange = (val, type) => {
    if (type === 'from') {
      setFromLocation(val);
      setActiveInput('from');
    } else {
      setToLocation(val);
      setActiveInput('to');
    }
  };

  const selectSuggestion = (item, type) => {
    if (type === 'from') {
      setFromLocation(item.title);
    } else {
      setToLocation(item.title);
    }
    setActiveInput(null);
  };

  const handleDetectLocation = (type) => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const list = popularLocations || [];
          if (list.length > 0) {
            let closest = list[0];
            let minDist = Infinity;
            list.forEach(loc => {
              if (loc.lat && loc.lon) {
                const dLat = loc.lat - latitude;
                const dLon = loc.lon - longitude;
                const distSq = dLat * dLat + dLon * dLon;
                if (distSq < minDist) {
                  minDist = distSq;
                  closest = loc;
                }
              }
            });
            if (type === 'from') setFromLocation(closest.name);
            else setToLocation(closest.name);
          } else {
            if (type === 'from') setFromLocation('Jalandhar');
          }
        } catch (e) {
          if (type === 'from') setFromLocation('Jalandhar');
        } finally {
          setIsLocating(false);
          setActiveInput(null);
        }
      },
      () => {
        setIsLocating(false);
        if (type === 'from') setFromLocation('Jalandhar');
        setActiveInput(null);
      },
      { timeout: 8000 }
    );
  };

  const isLocationInPredefinedList = (locName) => {
    if (!locName || !locName.trim()) return false;
    const clean = locName.trim().toLowerCase();
    if (clean.includes('rental') || clean.includes('local city rental')) return true;
    return (popularLocations || []).some((item) => {
      const n = (item.name || item.title || '').trim().toLowerCase();
      return n === clean;
    });
  };

  const isFromUnlisted = fromLocation.trim().length > 0 && !isLocationInPredefinedList(fromLocation);
  const isToUnlisted = tripType !== 'Hourly Rental' && toLocation.trim().length > 0 && !isLocationInPredefinedList(toLocation);
  const isUnlisted = isFromUnlisted || isToUnlisted;

  const handleDirectWhatsAppInquiryForLocation = (customCity, inputType) => {
    const from = inputType === 'from' ? customCity : (fromLocation || 'My City');
    const to = inputType === 'to' ? customCity : (toLocation || 'Destination');
    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I want to inquire about taxi fare for unlisted location: ${customCity}.

*Route Details:*
- Pickup (From): ${from}
- Destination (To): ${tripType === 'Hourly Rental' ? 'Local Rental' : to}
- Trip Type: ${tripType}
- Date & Time: ${departureDate} at ${pickupTime}

Please share the best custom fare and available vehicle options.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const handleFormWhatsAppInquiry = (e) => {
    if (e) e.preventDefault();

    if (!fromLocation.trim()) {
      setErrorMsg('Please specify pickup location (From).');
      return;
    }
    if (tripType !== 'Hourly Rental' && !toLocation.trim()) {
      setErrorMsg('Please specify destination (To).');
      return;
    }
    if (!departureDate) {
      setErrorMsg('Please select departure date.');
      return;
    }
    if (!pickupTime) {
      setErrorMsg('Please select pickup time.');
      return;
    }

    // Minimum advance time validation for today's booking
    if (departureDate === todayStr && minPickupTimeToday && pickupTime < minPickupTimeToday) {
      setErrorMsg(`For today's booking (${currentRouteDist > 100 ? '>100 KM' : '0–100 KM'}), minimum advance pickup time is ${advanceBufferMinutes} minutes from now (Earliest selectable: ${minPickupTimeToday}).`);
      return;
    }

    setErrorMsg('');

    const dest = tripType === 'Hourly Rental' ? 'Local City Rental' : toLocation.trim();
    const message = `Hello ${siteConfig?.businessName || 'Happy Tour & Travels'}, I would like to enquire about taxi fare for this route:

*Route Details:*
- Pickup (From): ${fromLocation.trim()} 
- Destination (To): ${dest} 
- Trip Type: ${tripType}
- Schedule Date: ${departureDate}
- Pickup Time: ${pickupTime}

Please share the best custom quote and available vehicle options.`;

    bookOnWhatsApp(message, siteConfig?.whatsappNumber);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    if (isUnlisted) {
      handleFormWhatsAppInquiry(e);
      return;
    }

    if (!fromLocation.trim()) {
      setErrorMsg('Please specify pickup location (From).');
      return;
    }
    if (tripType !== 'Hourly Rental' && !toLocation.trim()) {
      setErrorMsg('Please specify destination (To).');
      return;
    }
    if (!departureDate) {
      setErrorMsg('Please select departure date.');
      return;
    }
    if (!pickupTime) {
      setErrorMsg('Please select pickup time.');
      return;
    }

    // Minimum advance time validation for today's booking
    if (departureDate === todayStr && minPickupTimeToday && pickupTime < minPickupTimeToday) {
      setErrorMsg(`For today's booking (${currentRouteDist > 100 ? '>100 KM' : '0–100 KM'}), minimum advance pickup time is ${advanceBufferMinutes} minutes from now (Earliest selectable: ${minPickupTimeToday}).`);
      return;
    }

    setErrorMsg('');

    const searchParams = {
      tripType,
      fromLocation: fromLocation.trim(),
      toLocation: tripType === 'Hourly Rental' ? 'Local Rental' : toLocation.trim(),
      departureDate,
      pickupTime,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const q = new URLSearchParams({
        tripType: searchParams.tripType,
        from: searchParams.fromLocation,
        to: searchParams.toLocation,
        date: searchParams.departureDate,
        time: searchParams.pickupTime,
      }).toString();
      navigate(`/search?${q}`);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || !query.trim() || !text) return text;
    const q = query.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-yellow-300 text-slate-950 px-0.5 rounded font-black">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  // Simplified Suggestions Dropdown Component
  const renderSuggestionsDropdown = (type) => {
    if (activeInput !== type) return null;

    const isFrom = type === 'from';

    return (
      <div 
        className={`absolute top-full mt-2 w-full sm:w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[200] overflow-hidden animate-fadeIn text-left ${
          isFrom ? 'left-0' : 'left-0 sm:left-auto sm:right-0 md:left-0'
        }`}
      >
        {/* GPS Quick Detect */}
        <div className="p-2 bg-slate-50 border-b border-slate-100">
          <button
            type="button"
            onMouseDown={() => handleDetectLocation(type)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-950 w-full px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-950 transition-colors"
          >
            <Crosshair className={`w-3.5 h-3.5 text-amber-600 flex-shrink-0 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="truncate">{isLocating ? 'Detecting your city...' : '📍 Auto-Detect Current City (GPS)'}</span>
          </button>
        </div>

        {/* Suggestions List */}
        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white">
          {currentSuggestions.length > 0 ? (
            currentSuggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => selectSuggestion(item, type)}
                className="px-3.5 py-2.5 hover:bg-amber-50/80 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900">
                    {item.isAirport ? (
                      <Plane className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-700" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-amber-950 truncate">
                      {highlightMatch(item.title, currentQuery)}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {item.isAirport && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex-shrink-0">
                    Airport
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center bg-amber-50/60">
              <p className="text-xs font-bold text-slate-800">
                {currentQuery ? `"${currentQuery}"No matching locations` : 'No matching locations'}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5 mb-2.5">
               
              </p>
              {currentQuery && (
                <button
                  type="button"
                  onMouseDown={() => handleDirectWhatsAppInquiryForLocation(currentQuery, type)}
                  className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Enquire for &ldquo;{currentQuery}&rdquo; on WhatsApp</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const isAirport = tripType === 'Airport';
  const isHourly = tripType === 'Hourly Rental';

  return (
    <div className={`w-full ${compact ? 'p-4' : 'max-w-5xl mx-auto p-6 sm:p-8'} bg-white/95 backdrop-blur-xl rounded-3xl shadow-floating border border-gray-100/80`}>
      
      {/* Trip Type Selector */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-5 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-full sm:w-auto mb-1 sm:mb-0">
          Select Trip Type:
        </span>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {tripTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTripTypeChange(type)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                tripType === type
                  ? 'bg-brand-yellow text-slate-950 shadow-md scale-105 ring-2 ring-yellow-400/40'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'Airport' && <Plane className="w-3.5 h-3.5" />}
              {type === 'Hourly Rental' && <Clock className="w-3.5 h-3.5" />}
              {type === 'Round Trip' && <Repeat className="w-3.5 h-3.5" />}
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mode-Specific Instruction Notice */}
      <div className="mb-4 px-3.5 py-2.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center space-x-2.5 text-xs text-amber-950 font-medium shadow-xs">
        <span className="text-base flex-shrink-0">🟡</span>
        {isAirport ? (
          <p className="leading-snug">
            <strong className="font-bold text-slate-950">Search में Airport City Name या City Name लिखें</strong> (उदा: Delhi Airport, Amritsar Airport, Chandigarh Airport).
          </p>
        ) : isHourly ? (
          <p className="leading-snug">
            <strong className="font-bold text-slate-950">Enter your city name, select date and time</strong> for local 4 Hrs, 8 Hrs & 10 Hrs packages.
          </p>
        ) : (
          <p className="leading-snug">
            <strong className="font-bold text-slate-950">Search only CITY to CITY/AIRPORT.</strong> For AREA, VILLAGE or SMALL TOWN, please CALL or send a WhatsApp/Email INQUIRY.
          </p>
        )}
      </div>

      {/* Search Form Fields */}
      <form onSubmit={isUnlisted ? handleFormWhatsAppInquiry : handleSubmitSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* City / From Field */}
        <div 
          ref={fromRef} 
          className={`relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all ${
            activeInput === 'from' ? 'z-40 ring-2 ring-brand-yellow border-brand-yellow bg-white' : 'z-20'
          }`}
        >
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-yellow" />
              {isHourly ? 'City Name' : 'From (Pickup)'}
            </span>
            {fromLocation && (
              <button
                type="button"
                onClick={() => {
                  setFromLocation('');
                  setActiveInput('from');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </label>
          <input
            type="text"
            value={fromLocation}
            onFocus={() => setActiveInput('from')}
            onChange={(e) => handleLocationInputChange(e.target.value, 'from')}
            placeholder={isAirport ? 'Enter airport city / city name' : isHourly ? 'Enter city name' : 'Enter City Name Only'}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
            required
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {renderSuggestionsDropdown('from')}
        </div>

        {/* To Field (Destination) - Hidden in Hourly Rental */}
        {!isHourly ? (
          <div 
            ref={toRef} 
            className={`relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all ${
              activeInput === 'to' ? 'z-40 ring-2 ring-brand-yellow border-brand-yellow bg-white' : 'z-10'
            }`}
          >
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                To (Destination)
              </span>
              {toLocation && (
                <button
                  type="button"
                  onClick={() => {
                    setToLocation('');
                    setActiveInput('to');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </label>
            <input
              type="text"
              value={toLocation}
              onFocus={() => setActiveInput('to')}
              onChange={(e) => handleLocationInputChange(e.target.value, 'to')}
              placeholder={isAirport ? 'Enter airport city / city name' : 'Enter City Name / Airport Name Only'}
              className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
              required
              autoComplete="off"
            />

            {/* Autocomplete Dropdown */}
            {renderSuggestionsDropdown('to')}
          </div>
        ) : (
          /* Hourly Package Selector (In place of Destination for Hourly Rental) */
          <div className="relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-purple-600" />
              <span>Rental Type</span>
            </label>
            <div className="text-slate-900 font-bold text-sm mt-1.5 flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-lg text-xs font-black">
                Local City Tour
              </span>
              <span className="text-xs text-gray-500 font-semibold">4h, 8h & 10h packages</span>
            </div>
          </div>
        )}

        {/* Departure Date and Pickup Time Field */}
        <div className="relative z-0 bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
              <span>Date & Time</span>
            </label>
            {departureDate === todayStr && (
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                +{advanceBufferMinutes}m min buffer
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                min={todayStr}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-brand-yellow"
                required
              />
            </div>
            <div className="relative">
              <input
                type="time"
                value={pickupTime}
                min={departureDate === todayStr ? minPickupTimeToday : undefined}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-brand-yellow"
                required
              />
            </div>
          </div>
        </div>

        {/* Popular Route / City Shortcuts */}
        {isAirport && (
          <div className="md:col-span-3 pt-1">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-gray-400 font-bold whitespace-nowrap text-[11px]">Popular Airport Routes:</span>
              {popularAirportRoutes.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFromLocation(r.from);
                    setToLocation(r.to);
                  }}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 px-3 py-1 rounded-full whitespace-nowrap font-bold text-[11px] transition-colors"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isHourly && (
          <div className="md:col-span-3 pt-1">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-gray-400 font-bold whitespace-nowrap text-[11px]">Popular Cities:</span>
              {popularHourlyCities.map((city, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFromLocation(city)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-bold text-[11px] transition-colors ${
                    fromLocation.toLowerCase() === city.toLowerCase()
                      ? 'bg-slate-900 text-yellow-400 shadow-sm'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                  }`}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search / WhatsApp Submit Button */}
        <div className="md:col-span-3 mt-2 relative z-0">
          {isUnlisted ? (
            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-3 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all group"
            >
              <MessageCircle className="w-5 h-5 fill-white flex-shrink-0" />
              <span>Enquire on WhatsApp</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              type="submit"
              className="w-full yellow-gradient-btn py-4 rounded-2xl text-slate-950 font-bold text-base sm:text-lg flex items-center justify-center space-x-3 shadow-yellow-glow group hover:scale-[1.01] transition-transform"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
              <span>{isHourly ? 'View Hourly Cars & Rates' : 'Search Available Cabs'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {isUnlisted && (
            <p className="text-center text-[11px] text-emerald-800 font-semibold mt-2 flex items-center justify-center space-x-1">
              <span> ({isFromUnlisted ? fromLocation : toLocation}) — instant custom quote via WhatsApp!</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
