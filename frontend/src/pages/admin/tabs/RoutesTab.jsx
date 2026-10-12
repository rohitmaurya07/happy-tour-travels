import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navigation, Plus, Trash2, MapPin, CheckCircle2, AlertCircle, 
  Save, Search, Edit3, X, ArrowRight, Car, Mountain, Plane,
  SlidersHorizontal, Check, RefreshCw, DollarSign, Building2
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { 
  fetchPricingRoutes, addPricingRoute, updatePricingRoute, 
  deletePricingRoute, updatePopularLocations 
} from '../../../services/api';

export default function RoutesTab() {
  const { popularLocations, refreshSiteData } = useSiteData();
  const [activeSubTab, setActiveSubTab] = useState('routes'); // 'routes' | 'locations'

  const [pricingRoutesList, setPricingRoutesList] = useState([]);
  const [locationsList, setLocationsList] = useState([...popularLocations]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'airport' | 'hill' | 'plain'

  // Route Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeFormData, setRouteFormData] = useState({
    pickup: '',
    destination: '',
    distanceKm: '',
    routeType: 'PLAIN',
    pricingType: 'fixed',
    active: true,
    vehiclePrices: {
      dzire: 3000,
      verna: 3300,
      ertiga: 3800,
      innova: 4800,
      fortuner: 7200,
      tempo: 7800
    },
    roundTripPrices: {
      dzire: 0,
      verna: 0,
      ertiga: 0,
      innova: 0,
      fortuner: 0,
      tempo: 0
    }
  });

  // Location Add State
  const [newLocName, setNewLocName] = useState('');
  const [newLocState, setNewLocState] = useState('Punjab');
  const [newLocType, setNewLocType] = useState('City');
  const [newLocRegionType, setNewLocRegionType] = useState('PLAIN');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Load all pricing routes from API
  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPricingRoutes();
      if (Array.isArray(data)) {
        setPricingRoutesList(data);
      }
    } catch (err) {
      console.error('Failed to load routes:', err);
      setStatusMsg({ type: 'error', text: 'Could not load pricing routes.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    setLocationsList([...popularLocations]);
  }, [popularLocations]);

  // Filtered list of routes based on search and category
  const filteredRoutes = useMemo(() => {
    let list = pricingRoutesList;
    const q = searchQuery.trim().toLowerCase();

    if (filterType === 'airport') {
      list = list.filter(r => 
        (r.pickup || '').toLowerCase().includes('airport') || 
        (r.destination || '').toLowerCase().includes('airport') ||
        r.routeType === 'AIRPORT'
      );
    } else if (filterType === 'hill') {
      list = list.filter(r => r.routeType === 'HILL');
    } else if (filterType === 'plain') {
      list = list.filter(r => r.routeType === 'PLAIN');
    }

    if (q) {
      list = list.filter(r => 
        (r.pickup || '').toLowerCase().includes(q) ||
        (r.destination || '').toLowerCase().includes(q) ||
        (r.routeType || '').toLowerCase().includes(q) ||
        String(r.distanceKm || '').includes(q)
      );
    }

    return list;
  }, [pricingRoutesList, searchQuery, filterType]);

  // Open modal for adding a new route
  const handleOpenAddModal = () => {
    setEditingRouteId(null);
    setRouteFormData({
      pickup: '',
      destination: '',
      distanceKm: '',
      routeType: 'PLAIN',
      pricingType: 'fixed',
      active: true,
      vehiclePrices: {
        dzire: 3000,
        verna: 3300,
        ertiga: 3800,
        innova: 4800,
        fortuner: 7200,
        tempo: 7800
      },
      roundTripPrices: {
        dzire: 0,
        verna: 0,
        ertiga: 0,
        innova: 0,
        fortuner: 0,
        tempo: 0
      }
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing route
  const handleOpenEditModal = (route) => {
    setEditingRouteId(route.id);
    setRouteFormData({
      pickup: route.pickup || '',
      destination: route.destination || '',
      distanceKm: route.distanceKm || '',
      routeType: route.routeType || 'PLAIN',
      pricingType: 'fixed',
      active: route.active !== false,
      vehiclePrices: {
        dzire: route.vehiclePrices?.dzire || 0,
        verna: route.vehiclePrices?.verna || Math.round((route.vehiclePrices?.dzire || 0) * 1.1),
        ertiga: route.vehiclePrices?.ertiga || Math.round((route.vehiclePrices?.dzire || 0) * 1.2),
        innova: route.vehiclePrices?.innova || Math.round((route.vehiclePrices?.dzire || 0) * 1.5),
        fortuner: route.vehiclePrices?.fortuner || Math.round((route.vehiclePrices?.innova || 0) * 1.45),
        tempo: route.vehiclePrices?.tempo || Math.round((route.vehiclePrices?.innova || 0) * 1.6)
      },
      roundTripPrices: {
        dzire: route.roundTripPrices?.dzire || 0,
        verna: route.roundTripPrices?.verna || 0,
        ertiga: route.roundTripPrices?.ertiga || 0,
        innova: route.roundTripPrices?.innova || 0,
        fortuner: route.roundTripPrices?.fortuner || 0,
        tempo: route.roundTripPrices?.tempo || 0
      }
    });
    setIsModalOpen(true);
  };

  // Auto-calculate vehicle rates based on Dzire base price
  const handleAutoCalculateRates = (dzireBase) => {
    const base = Number(dzireBase) || 0;
    const vernaBase = Math.round(base * 1.1);
    const ertigaBase = Math.round(base * 1.2);
    const innovaBase = Math.round(base * 1.5);
    const fortunerBase = Math.round(base * 1.5 * 1.45);
    const tempoBase = Math.round(base * 1.5 * 1.6);
    setRouteFormData(prev => ({
      ...prev,
      vehiclePrices: {
        dzire: base,
        verna: vernaBase,
        ertiga: ertigaBase,
        innova: innovaBase,
        fortuner: fortunerBase,
        tempo: tempoBase
      },
      roundTripPrices: {
        dzire: Math.round(base * 1.8),
        verna: Math.round(vernaBase * 1.8),
        ertiga: Math.round(ertigaBase * 1.8),
        innova: Math.round(innovaBase * 1.8),
        fortuner: Math.round(fortunerBase * 1.8),
        tempo: Math.round(tempoBase * 1.8)
      }
    }));
  };

  // Save Route (Add or Update)
  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!routeFormData.pickup.trim() || !routeFormData.destination.trim()) {
      setStatusMsg({ type: 'error', text: 'Pickup and Destination are required.' });
      return;
    }

    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        ...routeFormData,
        distanceKm: routeFormData.distanceKm ? Number(routeFormData.distanceKm) : null
      };

      if (editingRouteId) {
        await updatePricingRoute(editingRouteId, payload);
        setStatusMsg({ type: 'success', text: `Route "${payload.pickup} ➔ ${payload.destination}" updated successfully!` });
      } else {
        await addPricingRoute(payload);
        setStatusMsg({ type: 'success', text: `New Route "${payload.pickup} ➔ ${payload.destination}" created with predefined rates!` });
      }

      setIsModalOpen(false);
      await loadRoutes();
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save route.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Route
  const handleDeleteRoute = async (id, pickup, dest) => {
    if (!window.confirm(`Are you sure you want to delete route "${pickup} ➔ ${dest}"?`)) return;
    try {
      await deletePricingRoute(id);
      setStatusMsg({ type: 'success', text: `Route "${pickup} ➔ ${dest}" deleted.` });
      await loadRoutes();
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete route.' });
    }
  };

  // Toggle Route Active/Inactive
  const handleToggleRouteActive = async (route) => {
    try {
      await updatePricingRoute(route.id, {
        ...route,
        active: !route.active
      });
      await loadRoutes();
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to toggle route status.' });
    }
  };

  // Add Predefined Location
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocState.trim()) return;

    const newLoc = {
      name: newLocName.trim(),
      state: newLocState.trim(),
      type: newLocType || 'City',
      regionType: newLocRegionType || 'PLAIN',
      lat: 31.326,
      lon: 75.576
    };

    const updated = [newLoc, ...locationsList];
    setLocationsList(updated);
    setNewLocName('');

    try {
      await updatePopularLocations(updated);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: `Location "${newLoc.name}" added to predefined list.` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add location.' });
    }
  };

  // Delete Predefined Location
  const handleDeleteLocation = async (name) => {
    if (!window.confirm(`Remove "${name}" from predefined locations?`)) return;
    const updated = locationsList.filter(l => l.name !== name);
    setLocationsList(updated);

    try {
      await updatePopularLocations(updated);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: `Location "${name}" removed.` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete location.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5 text-yellow-600" />
            <span>Predefined Location-to-Location Rates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
            Route Tariffs & City Pricing
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Add location-to-location routes and exact vehicle prices. Only routes defined here will show instant fixed booking prices. Unlisted routes will automatically prompt users to inquire via WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex p-1 bg-gray-100 rounded-2xl border border-gray-200 text-xs">
            <button
              onClick={() => setActiveSubTab('routes')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeSubTab === 'routes' ? 'bg-slate-900 text-yellow-400 shadow' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Predefined Routes ({pricingRoutesList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('locations')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeSubTab === 'locations' ? 'bg-slate-900 text-yellow-400 shadow' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Predefined Locations ({locationsList.length})
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="yellow-gradient-btn px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Route & Price</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between animate-fadeIn ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: '', text: '' })} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUBTAB 1: PREDEFINED LOCATION-TO-LOCATION ROUTES */}
      {activeSubTab === 'routes' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search & Category Filter */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, airport, distance..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: `All (${pricingRoutesList.length})` },
                { id: 'airport', label: '✈️ Airport Routes' },
                { id: 'hill', label: '🏔️ Hill Stations' },
                { id: 'plain', label: '🏙️ Plain Corridors' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === tab.id 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Routes Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-500">Loading predefined route tariffs...</p>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="p-12 text-center">
                <Navigation className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No Predefined Routes Found</h3>
                <p className="text-xs text-gray-400 mt-1">Try a different search query or add a new route tariff.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">From (Pickup)</th>
                      <th className="py-3.5 px-4">To (Destination)</th>
                      <th className="py-3.5 px-3">Distance</th>
                      <th className="py-3.5 px-3">Terrain</th>
                      <th className="py-3.5 px-4 text-center">Dzire Rate</th>
                      <th className="py-3.5 px-4 text-center">Ertiga Rate</th>
                      <th className="py-3.5 px-4 text-center">Innova Rate</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRoutes.map((route) => {
                      const dzirePrice = route.vehiclePrices?.dzire || 0;
                      const ertigaPrice = route.vehiclePrices?.ertiga || 0;
                      const innovaPrice = route.vehiclePrices?.innova || 0;

                      return (
                        <tr key={route.id} className="hover:bg-amber-50/50 transition-colors group">
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {route.pickup}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 flex items-center space-x-1.5">
                            <ArrowRight className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                            <span>{route.destination}</span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                            {route.distanceKm ? `${route.distanceKm} KM` : '—'}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              route.routeType === 'HILL' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : route.routeType === 'AIRPORT'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {route.routeType || 'PLAIN'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                            <div>{dzirePrice > 0 ? `₹${dzirePrice.toLocaleString('en-IN')}` : '—'}</div>
                            {route.roundTripPrices?.dzire > 0 && (
                              <span className="text-[10px] text-amber-700 font-black block">RT ₹{route.roundTripPrices.dzire.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                            <div>{ertigaPrice > 0 ? `₹${ertigaPrice.toLocaleString('en-IN')}` : '—'}</div>
                            {route.roundTripPrices?.ertiga > 0 && (
                              <span className="text-[10px] text-amber-700 font-black block">RT ₹{route.roundTripPrices.ertiga.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                            <div>{innovaPrice > 0 ? `₹${innovaPrice.toLocaleString('en-IN')}` : '—'}</div>
                            {route.roundTripPrices?.innova > 0 && (
                              <span className="text-[10px] text-amber-700 font-black block">RT ₹{route.roundTripPrices.innova.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => handleToggleRouteActive(route)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                route.active !== false 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {route.active !== false ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditModal(route)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-400 hover:text-slate-950 font-bold rounded-lg text-slate-700 transition-colors"
                            >
                              Edit Price
                            </button>
                            <button
                              onClick={() => handleDeleteRoute(route.id, route.pickup, route.destination)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-500 hover:text-white font-bold rounded-lg text-rose-600 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PREDEFINED LOCATIONS DATABASE */}
      {activeSubTab === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Add New Location Card */}
          <div className="lg:col-span-4">
            <form onSubmit={handleAddLocation} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 sticky top-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span>Add Predefined City / Location</span>
              </h2>
              <p className="text-xs text-gray-500">
                Locations listed here are shown in the search autocomplete dropdown for passengers.
              </p>

              <div>
                <label className="block text-gray-600 text-xs font-semibold mb-1">Location / City Name *</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={e => setNewLocName(e.target.value)}
                  placeholder="e.g. Bathinda Airport"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-xs font-semibold mb-1">State / Region *</label>
                <select
                  value={newLocState}
                  onChange={e => setNewLocState(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 text-xs font-semibold mb-1">Category</label>
                  <select
                    value={newLocType}
                    onChange={e => setNewLocType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-xs outline-none"
                  >
                    <option value="City">City</option>
                    <option value="Airport">Airport</option>
                    <option value="Hill Station">Hill Station</option>
                    <option value="Pilgrimage">Pilgrimage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 text-xs font-semibold mb-1">Terrain</label>
                  <select
                    value={newLocRegionType}
                    onChange={e => setNewLocRegionType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-xs outline-none"
                  >
                    <option value="PLAIN">Plain</option>
                    <option value="HILL">Hill</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Predefined Location</span>
              </button>
            </form>
          </div>

          {/* Predefined Locations List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Predefined Locations ({locationsList.length})
              </h2>
              <span className="text-xs text-gray-400 font-medium">Only these cities show in suggestions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[600px] overflow-y-auto pr-1">
              {locationsList.map((loc, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-gray-50 hover:bg-amber-50 border border-gray-200/80 rounded-2xl flex items-center justify-between transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-black text-slate-900 truncate">{loc.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{loc.state} • {loc.type}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteLocation(loc.name)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity"
                    title="Delete location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: ADD / EDIT ROUTE & VEHICLE PRICES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-950 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-left my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{editingRouteId ? 'Edit Predefined Rate' : 'New Predefined Tariff'}</span>
              </div>
              <h2 className="text-2xl font-black font-nexa text-white">
                {editingRouteId ? 'Update Route Pricing' : 'Add Location to Location Route & Prices'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter pickup and destination cities and configure exact fixed pricing for every vehicle.
              </p>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-5">
              
              {/* Route Origin & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Pickup City / Airport (From) *</label>
                  <input
                    type="text"
                    required
                    value={routeFormData.pickup}
                    onChange={e => setRouteFormData({ ...routeFormData, pickup: e.target.value })}
                    placeholder="e.g. Jalandhar"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-xs outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Destination City / Airport (To) *</label>
                  <input
                    type="text"
                    required
                    value={routeFormData.destination}
                    onChange={e => setRouteFormData({ ...routeFormData, destination: e.target.value })}
                    placeholder="e.g. Delhi Airport"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-xs outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Distance and Terrain Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">One-Way Distance (KM / KMs) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={routeFormData.distanceKm}
                    onChange={e => setRouteFormData({ ...routeFormData, distanceKm: e.target.value })}
                    placeholder="e.g. 385"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-xs outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Route Terrain / Classification</label>
                  <select
                    value={routeFormData.routeType}
                    onChange={e => setRouteFormData({ ...routeFormData, routeType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-xs outline-none focus:border-yellow-400"
                  >
                    <option value="PLAIN">PLAIN TERRAIN (National Highways / Plains)</option>
                    <option value="HILL">HILL TERRAIN (Himachal / Uttarakhand Hills)</option>
                    <option value="AIRPORT">AIRPORT CORRIDOR (Delhi / Amritsar / Chandigarh)</option>
                    <option value="MIXED">MIXED TERRAIN</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Prices Grid */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-brand-yellow uppercase tracking-wider block">
                    Fixed Vehicle Rates (₹)
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Exact total fare displayed to passengers
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'dzire', label: 'Maruti Dzire (Sedan)' },
                    { id: 'ertiga', label: 'Maruti Ertiga (SUV)' },
                    { id: 'innova', label: 'Innova Crysta (Luxury)' },
                    { id: 'verna', label: 'Hyundai Verna' },
                    { id: 'fortuner', label: 'Toyota Fortuner' },
                    { id: 'tempo', label: 'Tempo Traveller' },
                  ].map(v => (
                    <div key={v.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                      <span className="block text-[11px] font-bold text-gray-400 mb-1">{v.label}</span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeFormData.vehiclePrices?.[v.id] || 0}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            if (v.id === 'dzire' && (!routeFormData.vehiclePrices?.ertiga || routeFormData.vehiclePrices?.ertiga === 0)) {
                              handleAutoCalculateRates(val);
                            } else {
                              setRouteFormData({
                                ...routeFormData,
                                vehiclePrices: { ...routeFormData.vehiclePrices, [v.id]: val }
                              });
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white font-black text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Round Trip Fixed Vehicle Prices */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                  <div>
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Fixed Round-Trip Rates (₹)
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Optional return fare override. If left 0, per-km vehicle return tariff applies.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'dzire', label: 'Maruti Dzire RT' },
                    { id: 'ertiga', label: 'Maruti Ertiga RT' },
                    { id: 'innova', label: 'Innova Crysta RT' },
                    { id: 'verna', label: 'Hyundai Verna RT' },
                    { id: 'fortuner', label: 'Toyota Fortuner RT' },
                    { id: 'tempo', label: 'Tempo Traveller RT' },
                  ].map(v => (
                    <div key={v.id} className="bg-slate-900/90 p-3 rounded-2xl border border-amber-950/60">
                      <span className="block text-[11px] font-bold text-amber-400 mb-1">{v.label}</span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeFormData.roundTripPrices?.[v.id] || 0}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setRouteFormData({
                              ...routeFormData,
                              roundTripPrices: { ...routeFormData.roundTripPrices, [v.id]: val }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white font-black text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-gray-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="yellow-gradient-btn px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-md"
                >
                  {isSaving ? 'Saving...' : editingRouteId ? 'Update Route Tariff' : 'Save Route & Rates'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
