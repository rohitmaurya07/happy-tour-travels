import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight, Search, AlertCircle } from 'lucide-react';

// Real-time location suggestions via OSM Nominatim
export default function BookingForm({ onSearch }) {
  const [tripType, setTripType] = useState('One Way');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);

  const tripTypes = ['Airport', 'One Way', 'Round Trip', 'Hourly Rental'];

  // Helper to fetch location suggestions from OSM Nominatim
  const fetchLocationSuggestions = async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      // Use the display name for suggestions
      setSuggestions(data.map((item) => item.display_name));
    } catch (e) {
      console.error('Location lookup failed', e);
      setSuggestions([]);
    }
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
      setErrorMsg('Please select a departure date.');
      return;
    }
    if (!pickupTime) {
      setErrorMsg('Please select a pickup time.');
      return;
    }

    setErrorMsg('');

    const searchParams = {
      tripType,
      fromLocation: fromLocation.trim(),
      toLocation: tripType === 'Hourly Rental' ? 'Local Rental' : toLocation.trim(),
      departureDate,
      pickupTime
    };

    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-floating border border-gray-100/80">
      
      {/* Trip Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-5 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-full sm:w-auto mb-1 sm:mb-0">
          Select Trip Type:
        </span>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {tripTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTripType(type);
                setErrorMsg('');
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                tripType === type
                  ? 'bg-brand-yellow text-slate-950 shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Form Fields */}
      <form onSubmit={handleSubmitSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* From Field */}
        <div className="relative bg-gray-50/80 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-yellow" />
            From (Pickup)
          </label>
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => {
              const val = e.target.value;
              setFromLocation(val);
              fetchLocationSuggestions(val, setSuggestionsFrom);
            }}
            placeholder="e.g. Jalandhar"
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400"
            required
            onBlur={() => setTimeout(() => setSuggestionsFrom([]), 150)}
          />
          {suggestionsFrom.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestionsFrom.map((c) => (
                <li
                  key={c}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onMouseDown={() => {
                    setFromLocation(c);
                    setSuggestionsFrom([]);
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* To Field */}
        <div className="relative bg-gray-50/80 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
            To (Destination)
          </label>
          <input
            type="text"
            value={toLocation}
            onChange={(e) => {
              const val = e.target.value;
              setToLocation(val);
              fetchLocationSuggestions(val, setSuggestionsTo);
            }}
            placeholder={tripType === 'Hourly Rental' ? 'Local Rental' : 'e.g. Delhi / Shimla'}
            disabled={tripType === 'Hourly Rental'}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none placeholder-gray-400 disabled:opacity-50"
            required={tripType !== 'Hourly Rental'}
            onBlur={() => setTimeout(() => setSuggestionsTo([]), 150)}
          />
          {suggestionsTo.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestionsTo.map((c) => (
                <li
                  key={c}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onMouseDown={() => {
                    setToLocation(c);
                    setSuggestionsTo([]);
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Departure Date Field */}
        <div className="bg-gray-50/80 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
            Departure Date
          </label>
          <input
            type="date"
            value={departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none"
            required
          />
        </div>

        {/* Pickup Time Field */}
        <div className="bg-gray-50/80 hover:bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-yellow-400/30 transition-all">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Pickup Time
          </label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none"
            required
          />
        </div>

        {/* Search Submit Button */}
        <div className="sm:col-span-2 lg:col-span-4 mt-2">
          <button
            type="submit"
            className="w-full yellow-gradient-btn py-4 rounded-2xl text-slate-950 font-mono text-base sm:text-lg flex items-center justify-center space-x-3 shadow-yellow-glow group hover:scale-[1.01] transition-transform"
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
