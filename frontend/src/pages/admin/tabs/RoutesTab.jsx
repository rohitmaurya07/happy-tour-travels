import React, { useState } from 'react';
import { Navigation, Plus, Trash2, MapPin, CheckCircle2, AlertCircle, Save, Plane, ArrowRight } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { updatePopularRoutes, updatePopularLocations } from '../../../services/api';

export default function RoutesTab() {
  const { popularRoutes, popularLocations, refreshSiteData } = useSiteData();
  const [activeSubTab, setActiveSubTab] = useState('routes'); // 'routes' | 'locations'

  const [routesList, setRoutesList] = useState([...popularRoutes]);
  const [locationsList, setLocationsList] = useState([...popularLocations]);

  const [selectedCatId, setSelectedCatId] = useState(popularRoutes[0]?.id || '');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newType, setNewType] = useState('One Way');

  // New Category State
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatOrigin, setNewCatOrigin] = useState('');
  const [newCatTag, setNewCatTag] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('??');

  // New Location State
  const [newLocName, setNewLocName] = useState('');
  const [newLocState, setNewLocState] = useState('Punjab');
  const [newLocType, setNewLocType] = useState('City');
  const [newLocRegionType, setNewLocRegionType] = useState('PLAIN');
  const [newLocLat, setNewLocLat] = useState('');
  const [newLocLon, setNewLocLon] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const currentCategory = routesList.find(c => c.id === selectedCatId) || routesList[0];

  const handleAddRouteToCategory = () => {
    if (!newFrom.trim() || !newTo.trim() || !selectedCatId) return;

    setRoutesList(prev => prev.map(cat => {
      if (cat.id === selectedCatId) {
        return {
          ...cat,
          routes: [...(cat.routes || []), { from: newFrom.trim(), to: newTo.trim(), type: newType }]
        };
      }
      return cat;
    }));

    setNewTo('');
  };

  const handleRemoveRouteFromCategory = (catId, routeIdx) => {
    setRoutesList(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          routes: cat.routes.filter((_, i) => i !== routeIdx)
        };
      }
      return cat;
    }));
  };

  const handleAddCategory = () => {
    if (!newCatTitle.trim() || !newCatOrigin.trim()) return;
    const newCat = {
      id: `route-cat-${Date.now()}`,
      emoji: newCatEmoji || '??',
      title: newCatTitle.trim(),
      origin: newCatOrigin.trim(),
      tag: newCatTag.trim() || 'Popular Route Hub',
      routes: []
    };
    setRoutesList(prev => [...prev, newCat]);
    setSelectedCatId(newCat.id);
    setNewCatTitle('');
    setNewCatOrigin('');
    setNewCatTag('');
  };

  const handleDeleteCategory = (catId) => {
    if (!window.confirm('Are you sure you want to delete this route category?')) return;
    const filtered = routesList.filter(c => c.id !== catId);
    setRoutesList(filtered);
    if (selectedCatId === catId && filtered.length > 0) {
      setSelectedCatId(filtered[0].id);
    }
  };

  const handleAddLocation = () => {
    if (!newLocName.trim() || !newLocState.trim()) return;
    const newLoc = {
      name: newLocName.trim(),
      state: newLocState.trim(),
      type: newLocType || 'City',
      lat: parseFloat(newLocLat) || 31.0,
      lon: parseFloat(newLocLon) || 75.0
    };
    setLocationsList(prev => [newLoc, ...prev]);
    setNewLocName('');
    setNewLocLat('');
    setNewLocLon('');
  };

  const handleDeleteLocation = (name) => {
    setLocationsList(prev => prev.filter(l => l.name !== name));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      if (activeSubTab === 'routes') {
        await updatePopularRoutes(routesList);
        setStatusMsg({ type: 'success', text: 'Popular routes updated successfully!' });
      } else {
        await updatePopularLocations(locationsList);
        setStatusMsg({ type: 'success', text: 'Popular locations database updated successfully!' });
      }
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save data' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Navigation className="w-3.5 h-3.5 text-yellow-600" />
            <span>Routes & Locations</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Intercity Routes & Localities</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure popular travel route categories and geo-locations used by the distance calculation engine.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
            <button
              onClick={() => setActiveSubTab('routes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'routes' ? 'bg-slate-900 text-yellow-400 shadow' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Popular Routes
            </button>
            <button
              onClick={() => setActiveSubTab('locations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'locations' ? 'bg-slate-900 text-yellow-400 shadow' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Locations Database ({locationsList.length})
            </button>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fadeIn ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* VIEW 1: POPULAR ROUTES */}
      {activeSubTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Route Hub Categories</h2>
              
              <div className="space-y-2">
                {routesList.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setNewFrom(cat.origin || '');
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedCatId === cat.id
                        ? 'bg-yellow-50 border-brand-yellow text-slate-950 font-bold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{cat.emoji || '??'}</span>
                      <div>
                        <p className="text-xs font-bold">{cat.title}</p>
                        <p className="text-[10px] text-gray-500">{cat.routes?.length || 0} Routes</p>
                      </div>
                    </div>
                    {routesList.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Category Box */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Add New Category</span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    placeholder="??"
                    className="col-span-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs"
                  />
                  <input
                    type="text"
                    value={newCatTitle}
                    onChange={(e) => setNewCatTitle(e.target.value)}
                    placeholder="Title: e.g. Patiala Routes"
                    className="col-span-3 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCatOrigin}
                    onChange={(e) => setNewCatOrigin(e.target.value)}
                    placeholder="Origin City: Patiala"
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={newCatTag}
                    onChange={(e) => setNewCatTag(e.target.value)}
                    placeholder="Tag: Royal City Hub"
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full bg-slate-900 text-yellow-400 text-xs font-bold py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  + Add Hub Category
                </button>
              </div>
            </div>
          </div>

          {/* Routes in Current Category */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-6">
              
              {currentCategory && (
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <h2 className="text-lg font-bold font-nexa text-slate-900 flex items-center space-x-2">
                        <span>{currentCategory.emoji}</span>
                        <span>{currentCategory.title}</span>
                      </h2>
                      <span className="text-xs text-gray-500 font-medium">
                        Origin: <strong>{currentCategory.origin}</strong> � Tag: {currentCategory.tag}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                      {currentCategory.routes?.length || 0} Routes
                    </span>
                  </div>

                  {/* Add Route to this Category */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 mb-6">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Add Route to {currentCategory.title}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={newFrom || currentCategory.origin || ''}
                        onChange={(e) => setNewFrom(e.target.value)}
                        placeholder="From City"
                        className="sm:col-span-4 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        value={newTo}
                        onChange={(e) => setNewTo(e.target.value)}
                        placeholder="To (Destination)"
                        className="sm:col-span-4 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="sm:col-span-2 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="One Way">One Way</option>
                        <option value="Airport">Airport</option>
                        <option value="Round Trip">Round Trip</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddRouteToCategory}
                        className="sm:col-span-2 yellow-gradient-btn text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-sm"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* List of Routes in Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto p-1">
                    {currentCategory.routes?.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 hover:bg-yellow-50/50 rounded-2xl border border-gray-200/90 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{r.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-brand-yellow flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{r.to}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            r.type === 'Airport' ? 'bg-sky-100 text-sky-700' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {r.type}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRouteFromCategory(currentCategory.id, idx)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: LOCATIONS DATABASE */}
      {activeSubTab === 'locations' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">Pan-India Cities & Airport Coordinates</h2>
            <p className="text-xs text-gray-500 font-medium">Used for dynamic GPS distance calculation and autocomplete dropdown</p>
          </div>

          {/* Add New Location */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Add New Location to Database</span>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              <input
                type="text"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                placeholder="City/Airport Name"
                className="sm:col-span-2 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <input
                type="text"
                value={newLocState}
                onChange={(e) => setNewLocState(e.target.value)}
                placeholder="State (e.g. Punjab)"
                className="sm:col-span-1 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <input
                type="text"
                value={newLocType}
                onChange={(e) => setNewLocType(e.target.value)}
                placeholder="Type (City/Airport/Hill Station)"
                className="sm:col-span-1 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <select
                value={newLocRegionType}
                onChange={(e) => setNewLocRegionType(e.target.value)}
                className="sm:col-span-1 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="PLAIN">PLAIN</option>
                <option value="HILL">HILL</option>
                <option value="MIXED">MIXED</option>
              </select>
              <input
                type="number"
                step="0.0001"
                value={newLocLat}
                onChange={(e) => setNewLocLat(e.target.value)}
                placeholder="Latitude"
                className="sm:col-span-1 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="sm:col-span-1 yellow-gradient-btn text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-sm"
              >
                + Add Loc
              </button>
            </div>
          </div>

          {/* Locations Table */}
          <div className="max-h-[500px] overflow-y-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">Location Name</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Terrain (Plain / Hill)</th>
                  <th className="p-3">Coordinates (Lat, Lon)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locationsList.map((loc, i) => (
                  <tr key={i} className="hover:bg-yellow-50/30">
                    <td className="p-3 font-bold text-slate-900 flex items-center space-x-1.5">
                      {loc.type === 'Airport' ? <Plane className="w-3.5 h-3.5 text-sky-500" /> : <MapPin className="w-3.5 h-3.5 text-brand-yellow" />}
                      <span>{loc.name}</span>
                    </td>
                    <td className="p-3 text-gray-600 font-medium">{loc.state}</td>
                    <td className="p-3">
                      <span className="bg-gray-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{loc.type || 'City'}</span>
                    </td>
                    <td className="p-3">
                      <select
                        value={loc.regionType || 'PLAIN'}
                        onChange={(e) => {
                          const updated = locationsList.map((item, idx) => idx === i ? { ...item, regionType: e.target.value } : item);
                          setLocationsList(updated);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none ${
                          (loc.regionType || 'PLAIN') === 'HILL' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : (loc.regionType === 'MIXED' ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-blue-50 text-blue-800 border-blue-300')
                        }`}
                      >
                        <option value="PLAIN">PLAIN TERRAIN</option>
                        <option value="HILL">HILL TERRAIN</option>
                        <option value="MIXED">MIXED TERRAIN</option>
                      </select>
                    </td>
                    <td className="p-3 font-mono text-gray-500 text-[11px]">
                      {loc.lat?.toFixed(4)}, {loc.lon?.toFixed(4)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(loc.name)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
