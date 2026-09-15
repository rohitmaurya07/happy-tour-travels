import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Search, AlertCircle, Plane, Sparkles, X } from 'lucide-react';
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
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // 'from' | 'to' | null

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const tripTypes = ['Airport', 'One Way', 'Round Trip', 'Hourly Rental'];

  // Search locations matching query
  const searchLocations = (query) => {
    const list = popularLocations || [];
    if (!query || !query.trim()) {
      return list.slice(0, 10);
    }
    const cleanQ = query.trim().toLowerCase();
    return list.filter(
      (loc) =>
        loc.name.toLowerCase().includes(cleanQ) ||
        loc.state.toLowerCase().includes(cleanQ) ||
        (loc.type && loc.type.toLowerCase().includes(cleanQ))
    );
  };

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

  // Update suggestions from popularLocations + Nominatim
  const handleLocationInputChange = (val, type) => {
    if (type === 'from') {
      setFromLocation(val);
      setActiveInput('from');
    } else {
      setToLocation(val);
      setActiveInput('to');
    }

    // 1. Instant local matching
    const localMatches = searchLocations(val).slice(0, 6).map((item) => ({
      title: item.name,
      subtitle: `${item.state} • ${item.type || 'City'}`,
      isAirport: item.type === 'Airport',
      lat: item.lat,
      lon: item.lon,
    }));

    if (type === 'from') {
      setSuggestionsFrom(localMatches);
    } else {
      setSuggestionsTo(localMatches);
    }

    // 2. Fetch Nominatim in background if user typed 3+ chars
    if (val.trim().length >= 3) {
      fetchNominatim(val, type, localMatches);
    }
  };

  const fetchNominatim = async (query, type, currentList) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&addressdetails=1&limit=4`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const osmResults = data.map((item) => {
          const parts = item.display_name.split(',');
          const mainTitle = parts[0].trim();
          const subTitle = parts.slice(1, 3).join(',').trim();
          return {
            title: mainTitle,
            subtitle: subTitle || 'India',
            isAirport: mainTitle.toLowerCase().includes('airport'),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          };
        });

        // Merge without duplicates
        const combined = [...currentList];
        osmResults.forEach((osm) => {
          if (!combined.some((c) => c.title.toLowerCase() === osm.title.toLowerCase())) {
            combined.push(osm);
          }
        });

        if (type === 'from') {
          setSuggestionsFrom(combined.slice(0, 8));
        } else {
          setSuggestionsTo(combined.slice(0, 8));
        }
      }
    } catch (e) {
      // Ignore network errors; fallback local list is already visible
    }
  };

  const selectSuggestion = (item, type) => {
    if (type === 'from') {
      setFromLocation(item.title);
      setSuggestionsFrom([]);
    } else {
      setToLocation(item.title);
      setSuggestionsTo([]);
    }
    setActiveInput(null);
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
      // Navigate to dedicated search results page
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

  return (
    <div className={`w-full ${compact ? 'p-4' : 'max-w-5xl mx-auto p-6 sm:p-8'} bg-white/95 backdrop-blur-xl rounded-3xl shadow-floating border border-gray-100/80`}>
      
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
        <div ref={fromRef} className="relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
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
              if (suggestionsFrom.length === 0) {
                handleLocationInputChange(fromLocation, 'from');
              }
            }}
            onChange={(e) => handleLocationInputChange(e.target.value, 'from')}
            placeholder="Enter pickup city / airport..."
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400"
            required
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {activeInput === 'from' && suggestionsFrom.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto animate-fadeIn">
              <div className="p-2 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
                <span>Suggested Pickup Locations</span>
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </div>
              {suggestionsFrom.map((item, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => selectSuggestion(item, 'from')}
                  className="px-4 py-2.5 hover:bg-yellow-50/70 cursor-pointer flex items-center justify-between border-b border-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    {item.isAirport ? (
                      <Plane className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* To (Destination) Field with rich autocomplete */}
        <div ref={toRef} className="relative bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
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
                if (suggestionsTo.length === 0) {
                  handleLocationInputChange(toLocation, 'to');
                }
              }
            }}
            onChange={(e) => handleLocationInputChange(e.target.value, 'to')}
            placeholder={tripType === 'Hourly Rental' ? 'Local Rental' : 'e.g. Delhi, Shimla, Manali...'}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400 disabled:opacity-60"
            required={tripType !== 'Hourly Rental'}
            autoComplete="off"
          />

          {/* Autocomplete Dropdown */}
          {activeInput === 'to' && tripType !== 'Hourly Rental' && suggestionsTo.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto animate-fadeIn">
              <div className="p-2 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
                <span>Suggested Destinations</span>
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </div>
              {suggestionsTo.map((item, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => selectSuggestion(item, 'to')}
                  className="px-4 py-2.5 hover:bg-yellow-50/70 cursor-pointer flex items-center justify-between border-b border-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    {item.isAirport ? (
                      <Plane className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMBINED Departure Date and Pickup Time Field */}
        <div className="bg-gray-50/90 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
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
        <div className="md:col-span-3 mt-2">
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
