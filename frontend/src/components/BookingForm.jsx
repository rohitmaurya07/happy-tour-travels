import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, ArrowRight, Search, AlertCircle, 
  Plane, Sparkles, X, Train, Mountain, Navigation, Crosshair, 
  Check, Building2, Map, ShieldCheck
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function BookingForm({ onSearch, initialTripType = 'One Way', compact = false }) {
  const navigate = useNavigate();
  const { popularLocations } = useSiteData();

  // Get current date and time defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultTimeStr = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const [tripType, setTripType] = useState(initialTripType);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState(defaultTimeStr());
  const [errorMsg, setErrorMsg] = useState('');

  // Suggestions state
  const [activeInput, setActiveInput] = useState(null); // 'from' | 'to' | null
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'local' | 'airport' | 'hill' | 'major'
  const [osmResults, setOsmResults] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const tripTypes = ['Airport', 'One Way', 'Round Trip', 'Hourly Rental'];

  const categoryTabs = [
    { id: 'all', label: 'All Places' },
    { id: 'local', label: '📍 Local & Punjab' },
    { id: 'airport', label: '✈️ Airports' },
    { id: 'hill', label: '🏔️ Hill Stations' },
    { id: 'major', label: '🏙️ Major Cities' },
  ];

  // Helper to determine badge and icon type for a location
  const getLocationMeta = (item) => {
    const name = (item.name || item.title || '').toLowerCase();
    const state = (item.state || '').toLowerCase();
    const type = (item.type || item.subtitle || '').toLowerCase();

    if (item.isOsm) {
      return { badge: 'Live Map', icon: 'map', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    }
    if (type.includes('airport') || name.includes('airport')) {
      return { badge: 'Airport', icon: 'plane', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    }
    if (type.includes('railway') || type.includes('station') || name.includes('station') || name.includes('isbt')) {
      return { badge: 'Station / ISBT', icon: 'train', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    }
    if (
      type.includes('hill') || 
      state.includes('himachal') || 
      state.includes('uttarakhand') || 
      name.includes('shimla') || 
      name.includes('manali') || 
      name.includes('dharamshala') || 
      name.includes('dalhousie') || 
      name.includes('kasol') || 
      name.includes('mussoorie') || 
      name.includes('nainital')
    ) {
      return { badge: 'Hill Station', icon: 'mountain', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
    }
    if (type.includes('pilgrimage') || name.includes('golden temple') || name.includes('vaishno') || name.includes('katra') || name.includes('haridwar') || name.includes('rishikesh')) {
      return { badge: 'Pilgrimage', icon: 'pin', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    }
    if (
      state.includes('punjab') || 
      name.includes('jalandhar') || 
      name.includes('phagwara') || 
      name.includes('kapurthala') || 
      name.includes('ludhiana') || 
      name.includes('amritsar') || 
      name.includes('adampur') || 
      name.includes('nakodar') || 
      name.includes('hoshiarpur') || 
      name.includes('mohali') || 
      name.includes('zirakpur')
    ) {
      return { badge: 'Local Area / Punjab', icon: 'pin', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    return { badge: 'City / Hub', icon: 'building', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  };

  // Filter local dataset by query and category
  const getFilteredSuggestions = (query, category) => {
    const list = popularLocations || [];
    const cleanQ = (query || '').trim().toLowerCase();

    let filtered = list;

    // Apply category filter if not 'all'
    if (category === 'local') {
      filtered = filtered.filter(l => {
        const s = (l.state || '').toLowerCase();
        const t = (l.type || '').toLowerCase();
        const n = (l.name || '').toLowerCase();
        return s.includes('punjab') || s.includes('chandigarh') || t.includes('local') || n.includes('jalandhar') || n.includes('phagwara') || n.includes('ludhiana') || n.includes('amritsar');
      });
    } else if (category === 'airport') {
      filtered = filtered.filter(l => (l.type || '').toLowerCase().includes('airport') || (l.name || '').toLowerCase().includes('airport'));
    } else if (category === 'hill') {
      filtered = filtered.filter(l => {
        const s = (l.state || '').toLowerCase();
        const t = (l.type || '').toLowerCase();
        const r = (l.regionType || '').toLowerCase();
        return t.includes('hill') || s.includes('himachal') || s.includes('uttarakhand') || r === 'hill';
      });
    } else if (category === 'major') {
      filtered = filtered.filter(l => {
        const t = (l.type || '').toLowerCase();
        return t.includes('city') || t.includes('capital') || t.includes('hub');
      });
    }

    // Apply text search query
    if (cleanQ) {
      filtered = filtered.filter((loc) => {
        const name = (loc.name || '').toLowerCase();
        const state = (loc.state || '').toLowerCase();
        const type = (loc.type || '').toLowerCase();
        return name.includes(cleanQ) || state.includes(cleanQ) || type.includes(cleanQ);
      });
    }

    return filtered.map((item) => ({
      title: item.name,
      subtitle: `${item.state} • ${item.type || 'City'}`,
      lat: item.lat,
      lon: item.lon,
      isAirport: (item.type || '').toLowerCase().includes('airport') || item.name.toLowerCase().includes('airport'),
      state: item.state,
      type: item.type,
      regionType: item.regionType,
      isOsm: false,
    }));
  };

  // Fetch OpenStreetMap Nominatim results
  const fetchNominatim = (query) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!query || query.trim().length < 3) {
      setOsmResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query.trim()
          )}&countrycodes=in&addressdetails=1&limit=6`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((item) => {
            const parts = item.display_name.split(',');
            const mainTitle = parts[0].trim();
            const subTitle = parts.slice(1, 4).join(',').trim();
            return {
              title: mainTitle,
              subtitle: subTitle || 'India',
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              isAirport: mainTitle.toLowerCase().includes('airport'),
              state: parts.length > 2 ? parts[parts.length - 2].trim() : 'India',
              type: 'Live Location',
              isOsm: true,
            };
          });
          setOsmResults(parsed);
        }
      } catch (e) {
        // Fallback silently if offline or throttled
      }
    }, 300);
  };

  // Current query based on active input
  const currentQuery = activeInput === 'from' ? fromLocation : activeInput === 'to' ? toLocation : '';

  // Calculate final combined suggestions list
  const currentSuggestions = useMemo(() => {
    if (!activeInput) return [];
    const localMatches = getFilteredSuggestions(currentQuery, selectedCategory);

    // Merge OSM results without duplicating exact names
    if (osmResults.length > 0 && currentQuery.trim().length >= 3) {
      const combined = [...localMatches];
      osmResults.forEach((osm) => {
        if (!combined.some((c) => c.title.toLowerCase() === osm.title.toLowerCase())) {
          combined.push(osm);
        }
      });
      return combined;
    }

    return localMatches;
  }, [activeInput, currentQuery, selectedCategory, popularLocations, osmResults]);

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

  // Handle trip type change
  const handleTripTypeChange = (type) => {
    setTripType(type);
    setErrorMsg('');
    if (type === 'Hourly Rental') {
      setToLocation('Local City Rental (8 Hrs / 80 Kms)');
    } else if (toLocation === 'Local City Rental (8 Hrs / 80 Kms)') {
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

  // Handle input text changes
  const handleLocationInputChange = (val, type) => {
    if (type === 'from') {
      setFromLocation(val);
      setActiveInput('from');
    } else {
      setToLocation(val);
      setActiveInput('to');
    }
    fetchNominatim(val);
  };

  const selectSuggestion = (item, type) => {
    if (type === 'from') {
      setFromLocation(item.title);
    } else {
      setToLocation(item.title);
    }
    setActiveInput(null);
    setOsmResults([]);
  };

  // Geolocation trigger to pick user's local city
  const handleDetectLocation = (type) => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.suburb ||
              data.address?.county ||
              'Jalandhar';
            if (type === 'from') {
              setFromLocation(city);
            } else {
              setToLocation(city);
            }
            setActiveInput(null);
          }
        } catch (e) {
          if (type === 'from') setFromLocation('Jalandhar');
          setActiveInput(null);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        // Fallback default
        if (type === 'from') setFromLocation('Jalandhar');
        setActiveInput(null);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

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

  // Helper to highlight matching text in search results
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

  // Reusable Suggestions Dropdown Component
  const renderSuggestionsDropdown = (type) => {
    if (activeInput !== type) return null;

    const isFrom = type === 'from';

    return (
      <div 
        className={`absolute top-full  mt-2 w-full sm:w-[380px] md:w-[420px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border-2 border-slate-200/90 z-[200] overflow-hidden animate-fadeIn text-left ${
          isFrom ? 'left-0' : 'left-0 sm:left-auto sm:right-0 md:left-0'
        }`}
      >
        {/* Header with Title and Location Count */}
        <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-yellow flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {type === 'from' ? 'Pickup Locations & Local Hubs' : 'Suggested Destinations'}
            </span>
          </div>
          <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full font-bold">
            {currentSuggestions.length} Places
          </span>
        </div>

        {/* GPS Use Current Location Quick Action */}
        <div className="p-2 bg-amber-50/90 border-b border-amber-200/60 flex items-center justify-between">
          <button
            type="button"
            onMouseDown={() => handleDetectLocation(type)}
            className="flex items-center space-x-2 text-xs font-bold text-amber-950 hover:text-amber-900 transition-colors w-full px-2.5 py-1.5 rounded-xl hover:bg-amber-100 border border-amber-200/70 shadow-sm"
          >
            <Crosshair className={`w-3.5 h-3.5 text-amber-600 flex-shrink-0 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="truncate">{isLocating ? 'Detecting your GPS location...' : '📍 Auto-Detect Current City (GPS)'}</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="p-2 bg-slate-100/90 border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setSelectedCategory(tab.id);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-md ring-1 ring-slate-950'
                  : 'bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Suggestions List */}
        <div className="max-h-52 sm:max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white">
          {currentSuggestions.length > 0 ? (
            currentSuggestions.map((item, idx) => {
              const meta = getLocationMeta(item);
              return (
                <div
                  key={idx}
                  onMouseDown={() => selectSuggestion(item, type)}
                  className="px-3.5 py-2 hover:bg-amber-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${meta.color} shadow-xs`}>
                      {meta.icon === 'plane' ? (
                        <Plane className="w-3.5 h-3.5" />
                      ) : meta.icon === 'train' ? (
                        <Train className="w-3.5 h-3.5" />
                      ) : meta.icon === 'mountain' ? (
                        <Mountain className="w-3.5 h-3.5" />
                      ) : meta.icon === 'map' ? (
                        <Map className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-950 truncate">
                        {highlightMatch(item.title, currentQuery)}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 border ${meta.color} whitespace-nowrap`}>
                    {meta.badge}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400">
              <Search className="w-6 h-6 mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-bold text-slate-700">No matching locations found</p>
              <p className="text-[10px] text-gray-500 mt-1">
                Type 3+ letters to search live map anywhere in India
              </p>
            </div>
          )}
        </div>

        {/* Footer info notice */}
        <div className="p-2 bg-slate-50 text-center border-t border-slate-200">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline flex-shrink-0" />
            <span>Local Punjab Cabs • Pan-India Outstation • 24x7 Support</span>
          </p>
        </div>
      </div>
    );
  };


  return (
    <div className={`w-full ${compact ? 'p-4' : 'max-w-5xl mx-auto p-6 sm:p-8'} bg-white/95  backdrop-blur-xl rounded-3xl shadow-floating border border-gray-100/80`}>
      
      {/* Trip Type Selector (Hidden on mobile where bottom bar is visible) */}
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

      {/* Search Form Fields */}
      <form onSubmit={handleSubmitSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* From (Pickup) Field with rich autocomplete */}
        <div 
          ref={fromRef} 
          className={`relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all ${
            activeInput === 'from' ? 'z-40 ring-2 ring-brand-yellow border-brand-yellow bg-white' : 'z-20'
          }`}
        >
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-yellow" />
              From (Pickup)
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
            onFocus={() => {
              setActiveInput('from');
              setSelectedCategory('all');
            }}
            onChange={(e) => handleLocationInputChange(e.target.value, 'from')}
            placeholder="Search local pickup, city, airport..."
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400"
            required
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {renderSuggestionsDropdown('from')}
        </div>

        {/* To (Destination) Field with rich autocomplete */}
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
            {toLocation && tripType !== 'Hourly Rental' && (
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
            disabled={tripType === 'Hourly Rental'}
            onFocus={() => {
              if (tripType !== 'Hourly Rental') {
                setActiveInput('to');
                setSelectedCategory('all');
              }
            }}
            onChange={(e) => handleLocationInputChange(e.target.value, 'to')}
            placeholder={tripType === 'Hourly Rental' ? 'Local Rental' : 'Search destination, hill station, city...'}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400 disabled:opacity-60"
            required={tripType !== 'Hourly Rental'}
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {tripType !== 'Hourly Rental' && renderSuggestionsDropdown('to')}
        </div>

        {/* COMBINED Departure Date and Pickup Time Field */}
        <div className="relative z-0 bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
            <span>Departure Date & Pickup Time</span>
          </label>
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
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-brand-yellow"
                required
              />
            </div>
          </div>
        </div>

        {/* Search Submit Button */}
        <div className="md:col-span-3 mt-2 relative z-0">
          <button
            type="submit"
            className="w-full yellow-gradient-btn py-4 rounded-2xl text-slate-950 font-bold text-base sm:text-lg flex items-center justify-center space-x-3 shadow-yellow-glow group hover:scale-[1.01] transition-transform"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span>Search Available Cabs</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}


