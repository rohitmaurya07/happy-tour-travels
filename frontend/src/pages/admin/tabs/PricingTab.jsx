import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Save, AlertCircle, Plus, Trash2, ShieldCheck, Plane, Layers } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { updatePricingSettings, updateFleetVehicle } from '../../../services/api';

export default function PricingTab() {
  const { pricingSettings, fleet, refreshSiteData } = useSiteData();
  const [formSettings, setFormSettings] = useState({ 
    ...pricingSettings,
    airportOverrides: Array.isArray(pricingSettings?.airportOverrides) ? pricingSettings.airportOverrides : [
      {
        id: 'delhi-airport',
        name: 'Delhi Airport (DEL)',
        routeKeyword: 'Delhi Airport',
        rates: { dzire: 5180, verna: 5580, ertiga: 6000, innova: 7500, fortuner: 10500, tempo: 9500 }
      },
      {
        id: 'amritsar-airport',
        name: 'Amritsar Airport (ATQ)',
        routeKeyword: 'Amritsar Airport',
        rates: { dzire: 1900, verna: 2300, ertiga: 2400, innova: 3500, fortuner: 5500, tempo: 5000 }
      },
      {
        id: 'chandigarh-airport',
        name: 'Chandigarh Airport (IXC)',
        routeKeyword: 'Chandigarh Airport',
        rates: { dzire: 2500, verna: 2900, ertiga: 3000, innova: 4500, fortuner: 7000, tempo: 6000 }
      }
    ]
  });

  const [fleetRates, setFleetRates] = useState(
    (fleet || []).map(car => ({
      id: car.id,
      name: car.name,
      category: car.category,
      oneWayRate: car.oneWayRate || 12,
      roundTripRate: car.roundTripRate || 14,
      fourHours: car.localPackages?.fourHours || 1000,
      eightHours: car.localPackages?.eightHours || 1500,
      airportFixedRate: car.airportFixedRate || 2499,
      slabs: {
        minKm: car.slabs?.minKm ?? 20,
        slab20_35: car.slabs?.slab20_35 ?? 900,
        slab35_55: car.slabs?.slab35_55 ?? 1100,
        slab55_75: car.slabs?.slab55_75 ?? 1300,
        slab75_95: car.slabs?.slab75_95 ?? 1500,
        slab95Base: car.slabs?.slab95Base ?? 1700,
        post95Rate: car.slabs?.post95Rate ?? (car.oneWayRate || 12)
      }
    }))
  );

  const [activeSubTab, setActiveSubTab] = useState('slabs'); // 'slabs' | 'matrix' | 'airports' | 'charges'
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Handle fleet matrix rate changes
  const handleRateChange = (id, field, value) => {
    const num = parseFloat(value) || 0;
    setFleetRates(prev => prev.map(c => c.id === id ? { ...c, [field]: num } : c));
  };

  // Handle vehicle slab changes
  const handleSlabChange = (id, slabKey, value) => {
    const num = parseFloat(value) || 0;
    setFleetRates(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          slabs: {
            ...c.slabs,
            [slabKey]: num
          }
        };
      }
      return c;
    }));
  };

  // Handle airport override changes
  const handleAirportOverrideRateChange = (overrideIndex, vehicleId, value) => {
    const num = parseFloat(value) || 0;
    setFormSettings(prev => {
      const updatedOverrides = [...(prev.airportOverrides || [])];
      updatedOverrides[overrideIndex] = {
        ...updatedOverrides[overrideIndex],
        rates: {
          ...updatedOverrides[overrideIndex].rates,
          [vehicleId]: num
        }
      };
      return { ...prev, airportOverrides: updatedOverrides };
    });
  };

  const handleAirportOverrideMetaChange = (overrideIndex, field, value) => {
    setFormSettings(prev => {
      const updatedOverrides = [...(prev.airportOverrides || [])];
      updatedOverrides[overrideIndex] = {
        ...updatedOverrides[overrideIndex],
        [field]: value
      };
      return { ...prev, airportOverrides: updatedOverrides };
    });
  };

  const handleAddAirportOverride = () => {
    const newOverride = {
      id: 'airport-' + Date.now(),
      name: 'New Airport Route',
      routeKeyword: 'Airport',
      rates: { dzire: 3000, verna: 3400, ertiga: 3500, innova: 4800, fortuner: 7500, tempo: 6500 }
    };
    setFormSettings(prev => ({
      ...prev,
      airportOverrides: [...(prev.airportOverrides || []), newOverride]
    }));
  };

  const handleDeleteAirportOverride = (overrideIndex) => {
    setFormSettings(prev => ({
      ...prev,
      airportOverrides: prev.airportOverrides.filter((_, idx) => idx !== overrideIndex)
    }));
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // 1. Update Global pricing settings
      await updatePricingSettings(formSettings);

      // 2. Update each vehicle's rates and slabs
      for (const item of fleetRates) {
        const vehicleOriginal = fleet.find(f => f.id === item.id) || {};
        await updateFleetVehicle(item.id, {
          ...vehicleOriginal,
          oneWayRate: item.oneWayRate,
          roundTripRate: item.roundTripRate,
          ratesHint: '₹' + item.slabs.slab20_35 + ' (20-35km) • ₹' + item.slabs.slab95Base + ' (95km) • ₹' + item.slabs.post95Rate + '/km post 95km',
          localPackages: {
            fourHours: item.fourHours,
            eightHours: item.eightHours
          },
          hourlyRate: item.eightHours,
          airportFixedRate: item.airportFixedRate,
          slabs: item.slabs
        });
      }

      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'All prices, distance slabs, airport overrides, and charges updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update pricing' });
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
            <DollarSign className="w-3.5 h-3.5 text-yellow-600" />
            <span>Pricing & Slab Control</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Cab Fares & Distance Slabs</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure tiered distance slabs, per-KM rates, dedicated airport routes, and toll/tax inclusion policies.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Pricing'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
        <button
          onClick={() => setActiveSubTab('slabs')}
          className={'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ' + (
            activeSubTab === 'slabs' ? 'bg-slate-950 text-yellow-400 shadow-md' : 'text-gray-600 hover:text-slate-900'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Distance Slabs (One-Way)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('airports')}
          className={'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ' + (
            activeSubTab === 'airports' ? 'bg-slate-950 text-yellow-400 shadow-md' : 'text-gray-600 hover:text-slate-900'
          )}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Dedicated Airport Routes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ' + (
            activeSubTab === 'matrix' ? 'bg-slate-950 text-yellow-400 shadow-md' : 'text-gray-600 hover:text-slate-900'
          )}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Per-KM & Hourly Packages</span>
        </button>

        <button
          onClick={() => setActiveSubTab('charges')}
          className={'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ' + (
            activeSubTab === 'charges' ? 'bg-slate-950 text-yellow-400 shadow-md' : 'text-gray-600 hover:text-slate-900'
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tolls, Taxes & Inclusions</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMsg.text && (
        <div className={'p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fadeIn ' + (
          statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        )}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* TAB 1: Distance Slabs Editor */}
      {activeSubTab === 'slabs' && (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">Distance-Based One-Way Slabs</h2>
              <p className="text-xs text-gray-500 font-medium">Exact fixed charges for distance intervals up to 95 km + extra per-KM rate post 95 km</p>
            </div>
            <span className="text-xs font-bold bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
              Formula: ₹Base 95km + (Distance - 95) × ₹/KM
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Vehicle</th>
                  <th className="py-3.5 px-4">&lt; 20 km</th>
                  <th className="py-3.5 px-4">20–35 km (₹)</th>
                  <th className="py-3.5 px-4">35–55 km (₹)</th>
                  <th className="py-3.5 px-4">55–75 km (₹)</th>
                  <th className="py-3.5 px-4">75–95 km (₹)</th>
                  <th className="py-3.5 px-4">95 km Base (₹)</th>
                  <th className="py-3.5 px-4">&gt; 95 km (₹/KM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {fleetRates.map((car) => (
                  <tr key={car.id} className="hover:bg-yellow-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{car.name}</div>
                      <span className="text-[10px] text-gray-400 block font-semibold">{car.category}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-amber-700">
                      No Booking
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.slabs?.slab20_35 || 0}
                          onChange={(e) => handleSlabChange(car.id, 'slab20_35', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.slabs?.slab35_55 || 0}
                          onChange={(e) => handleSlabChange(car.id, 'slab35_55', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.slabs?.slab55_75 || 0}
                          onChange={(e) => handleSlabChange(car.id, 'slab55_75', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.slabs?.slab75_95 || 0}
                          onChange={(e) => handleSlabChange(car.id, 'slab75_95', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.slabs?.slab95Base || 0}
                          onChange={(e) => handleSlabChange(car.id, 'slab95Base', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-yellow-50 border border-yellow-300 rounded-xl font-extrabold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={car.slabs?.post95Rate || 0}
                          onChange={(e) => handleSlabChange(car.id, 'post95Rate', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl font-extrabold text-emerald-900 focus:outline-none focus:border-brand-yellow focus:bg-white text-xs"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              💡 Example: Jalandhar → Delhi Airport (385 km) on Dzire = ₹1,700 + (385 - 95) × ₹12 = ₹5,180
            </span>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="yellow-gradient-btn px-4 py-2 rounded-xl text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Slabs</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Dedicated Airport Routes */}
      {activeSubTab === 'airports' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">Dedicated Airport Override Rates</h2>
              <p className="text-xs text-gray-500 font-medium">Set fixed package prices for major airport transfers (e.g. Delhi Airport, Amritsar, Chandigarh)</p>
            </div>
            <button
              onClick={handleAddAirportOverride}
              className="bg-slate-900 hover:bg-slate-800 text-yellow-400 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Airport Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {(formSettings.airportOverrides || []).map((override, oIdx) => (
              <div key={override.id || oIdx} className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-700 flex items-center justify-center font-bold">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={override.name}
                        onChange={(e) => handleAirportOverrideMetaChange(oIdx, 'name', e.target.value)}
                        className="font-bold text-slate-900 text-sm sm:text-base bg-transparent border-b border-gray-300 focus:border-brand-yellow focus:outline-none px-1"
                      />
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[11px] text-gray-500 font-medium">Keyword match:</span>
                        <input
                          type="text"
                          value={override.routeKeyword}
                          onChange={(e) => handleAirportOverrideMetaChange(oIdx, 'routeKeyword', e.target.value)}
                          className="text-[11px] font-bold text-yellow-800 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAirportOverride(oIdx)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors self-end sm:self-auto"
                    title="Delete Airport Route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                  {fleetRates.map((car) => (
                    <div key={car.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                      <span className="text-[11px] font-bold text-slate-700 block truncate">{car.name}</span>
                      <span className="text-[10px] text-gray-400 block mb-1.5">{car.category}</span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={override.rates?.[car.id] || 0}
                          onChange={(e) => handleAirportOverrideRateChange(oIdx, car.id, e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-white border border-gray-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Per-KM & Local Hourly Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">Per-Kilometer & Hourly Rental Matrix</h2>
              <p className="text-xs text-gray-500 font-medium">Base per-km rates for Round Trips and local hourly rental packages</p>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{fleetRates.length} Vehicles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Vehicle Name</th>
                  <th className="py-3.5 px-4">One-Way (₹/KM)</th>
                  <th className="py-3.5 px-4">Round-Trip (₹/KM)</th>
                  <th className="py-3.5 px-4">4h / 40km (₹)</th>
                  <th className="py-3.5 px-4">8h / 80km (₹)</th>
                  <th className="py-3.5 px-4">Airport Base (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {fleetRates.map((car) => (
                  <tr key={car.id} className="hover:bg-yellow-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{car.name}</div>
                      <span className="text-[11px] text-gray-400 font-medium">{car.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={car.oneWayRate}
                          onChange={(e) => handleRateChange(car.id, 'oneWayRate', e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={car.roundTripRate}
                          onChange={(e) => handleRateChange(car.id, 'roundTripRate', e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.fourHours}
                          onChange={(e) => handleRateChange(car.id, 'fourHours', e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.eightHours}
                          onChange={(e) => handleRateChange(car.id, 'eightHours', e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="50"
                          value={car.airportFixedRate}
                          onChange={(e) => handleRateChange(car.id, 'airportFixedRate', e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow focus:bg-white"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Tolls, Taxes & Extra Charges Form */}
      {activeSubTab === 'charges' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">Tolls, Taxes & Extra Charges Inclusions</h2>
            <p className="text-xs text-gray-500 font-medium">Control what charges are included in the upfront website quotes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block">Highway Toll Taxes</span>
                <span className="text-[11px] text-gray-500 font-medium">Included in quote</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.tollIncluded}
                onChange={(e) => setFormSettings({ ...formSettings, tollIncluded: e.target.checked })}
                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block">Interstate State Tax</span>
                <span className="text-[11px] text-gray-500 font-medium">Included in quote</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.stateTaxIncluded}
                onChange={(e) => setFormSettings({ ...formSettings, stateTaxIncluded: e.target.checked })}
                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block">Driver Allowance</span>
                <span className="text-[11px] text-gray-500 font-medium">Included in quote</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.driverAllowanceIncluded}
                onChange={(e) => setFormSettings({ ...formSettings, driverAllowanceIncluded: e.target.checked })}
                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block">Fuel Charges</span>
                <span className="text-[11px] text-gray-500 font-medium">Included in quote</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.fuelIncluded}
                onChange={(e) => setFormSettings({ ...formSettings, fuelIncluded: e.target.checked })}
                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Night Driving Allowance (₹)
              </label>
              <input
                type="number"
                value={formSettings.nightChargesAmount}
                onChange={(e) => setFormSettings({ ...formSettings, nightChargesAmount: Number(e.target.value) })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Night Window (Start Hour: 0-23)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={formSettings.nightChargeStartHour}
                onChange={(e) => setFormSettings({ ...formSettings, nightChargeStartHour: Number(e.target.value) })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Night Window (End Hour: 0-23)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={formSettings.nightChargeEndHour}
                onChange={(e) => setFormSettings({ ...formSettings, nightChargeEndHour: Number(e.target.value) })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Website Terms & Inclusions Disclaimer Note
            </label>
            <textarea
              rows="3"
              value={formSettings.termsAndConditions}
              onChange={(e) => setFormSettings({ ...formSettings, termsAndConditions: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>
      )}

    </div>
  );
}
