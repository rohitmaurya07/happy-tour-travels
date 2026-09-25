import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import BookingForm from '../components/BookingForm';
import { getDistanceKm } from '../utils/distance';
import { ChevronRight, ArrowLeft, SlidersHorizontal, MapPin, Sparkles } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModifyModal, setShowModifyModal] = useState(false);

  const tripType = searchParams.get('tripType') || 'One Way';
  const fromLocation = searchParams.get('from') || 'Jalandhar';
  const toLocation = searchParams.get('to') || 'Delhi';
  const departureDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const pickupTime = searchParams.get('time') || '09:00';

  // Calculate distance
  const [distanceKm, setDistanceKm] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const compute = async () => {
      if (tripType === 'Hourly Rental') {
        setDistanceKm(80);
        return;
      }

      // 1. Direct check in known distances and coordinates database
      const dist = getDistanceKm(fromLocation, toLocation);
      if (dist && dist > 0) {
        setDistanceKm(dist);
        return;
      }

      // 2. Fetch live coordinates from OpenStreetMap if not in local dataset
      const fetchCoords = async (query) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&countrycodes=in&limit=1`
          );
          if (!res.ok) return null;
          const data = await res.json();
          if (data && data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
          }
        } catch (e) {}
        return null;
      };

      try {
        const [fromCoords, toCoords] = await Promise.all([
          fetchCoords(fromLocation),
          fetchCoords(toLocation),
        ]);
        const calculated = getDistanceKm(fromLocation, toLocation, fromCoords, toCoords);
        setDistanceKm(calculated && calculated > 0 ? calculated : 60);
      } catch (err) {
        setDistanceKm(60);
      }
    };

    compute();
  }, [tripType, fromLocation, toLocation]);

  const searchParamsObj = {
    tripType,
    fromLocation,
    toLocation,
    departureDate,
    pickupTime,
    distanceKm,
  };

  const handleModifySubmit = (newParams) => {
    setShowModifyModal(false);
    const q = new URLSearchParams({
      tripType: newParams.tripType,
      from: newParams.fromLocation,
      to: newParams.toLocation,
      date: newParams.departureDate,
      time: newParams.pickupTime,
    }).toString();
    navigate(`/search?${q}`);
  };

  return (
    <div className="pt-24 pb-28 bg-gray-50 min-h-screen">
      
      {/* Breadcrumb & Navigation Top Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-semibold">
            <Link to="/" className="hover:text-yellow-600 transition-colors flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-slate-900 font-bold">Search Cabs</span>
          </div>

          <button
            onClick={() => setShowModifyModal(!showModifyModal)}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-gray-100 hover:bg-yellow-400 hover:text-slate-950 px-3.5 py-1.5 rounded-full transition-all border border-gray-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showModifyModal ? 'Close Form' : 'Change Route / Time'}</span>
          </button>
        </div>
      </div>

      {/* Modify Search Drawer / Box */}
      {showModifyModal && (
        <div id="modify-search-box" className="max-w-5xl mx-auto px-4 sm:px-6 my-6 animate-fadeIn">
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 text-white">
            <h3 className="text-lg font-bold font-nexa text-brand-yellow mb-4 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Update Your Travel Route & Timings
            </h3>
            <BookingForm
              onSearch={handleModifySubmit}
              initialTripType={tripType}
              initialFromLocation={fromLocation}
              initialToLocation={toLocation}
              initialDepartureDate={departureDate}
              initialPickupTime={pickupTime}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Search Results Component */}
      <SearchResults
        searchParams={searchParamsObj}
        onModifySearch={() => {
          setShowModifyModal(true);
          setTimeout(() => {
            document.getElementById('modify-search-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }}
      />

    </div>
  );
}
