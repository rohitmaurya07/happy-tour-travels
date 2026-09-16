import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Save, AlertCircle, Plus, Trash2, Mountain, Route, Car, Clock, ShieldCheck, Layers, Eye } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { updatePricingSettings, updateFleetVehicle, fetchPricingRoutes, addPricingRoute, updatePricingRoute, deletePricingRoute, fetchAdminBookings, updateBookingStatus } from '../../../services/api';

export default function PricingTab() {
  const { pricingSettings, fleet, refreshSiteData } = useSiteData();
  const [activeSubTab, setActiveSubTab] = useState('vehicle_rates');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [fleetRates, setFleetRates] = useState([]);
  useEffect(() => {
    if (fleet) {
      setFleetRates(
        fleet.map(car => ({
          id: car.id,
          name: car.name,
          category: car.category,
          plainRatePerKm: car.plainRatePerKm !== undefined ? car.plainRatePerKm : (car.oneWayRate || 10),
          hillRatePerKm: car.hillRatePerKm !== undefined ? car.hillRatePerKm : (car.roundTripRate || 12),
          minimumKm: car.minimumKm !== undefined ? car.minimumKm : 250,
          extraKmRate: car.extraKmRate !== undefined ? car.extraKmRate : (car.plainRatePerKm || 10),
          driverAllowance: car.driverAllowance !== undefined ? car.driverAllowance : 300,
          active: car.active !== false
        }))
      );
    }
  }, [fleet]);

  const [pricingRoutesList, setPricingRoutesList] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [routeFormData, setRouteFormData] = useState({
    pickup: '',
    destination: '',
    routeType: 'PLAIN',
    pricingType: 'fixed',
    distanceKm: 250,
    active: true,
    vehiclePrices: { dzire: 3500, verna: 4000, ertiga: 4500, innova: 5500, fortuner: 8500, tempo: 7500 }
  });

  const loadPricingRoutes = async () => {
    try {
      const data = await fetchPricingRoutes();
      if (Array.isArray(data)) setPricingRoutesList(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadPricingRoutes();
    loadBookings();
  }, []);

  const [chargesSettings, setChargesSettings] = useState({
    driverAllowance: pricingSettings?.driverAllowance ?? 300,
    nightChargesAmount: pricingSettings?.nightChargesAmount ?? 250,
    nightChargeStartHour: pricingSettings?.nightChargeStartHour ?? 23,
    nightChargeEndHour: pricingSettings?.nightChargeEndHour ?? 5,
    toll: pricingSettings?.toll ?? 'actual',
    parking: pricingSettings?.parking ?? 'actual',
    stateTax: pricingSettings?.stateTax ?? 'actual',
    termsAndConditions: pricingSettings?.termsAndConditions ?? 'All rates include Fuel & Driver. Tolls and state taxes at actuals.'
  });

  useEffect(() => {
    if (pricingSettings) {
      setChargesSettings({
        driverAllowance: pricingSettings.driverAllowance ?? 300,
        nightChargesAmount: pricingSettings.nightChargesAmount ?? 250,
        nightChargeStartHour: pricingSettings.nightChargeStartHour ?? 23,
        nightChargeEndHour: pricingSettings.nightChargeEndHour ?? 5,
        toll: pricingSettings.toll ?? 'actual',
        parking: pricingSettings.parking ?? 'actual',
        stateTax: pricingSettings.stateTax ?? 'actual',
        termsAndConditions: pricingSettings.termsAndConditions ?? 'All rates include Fuel & Driver. Tolls and state taxes at actuals.'
      });
    }
  }, [pricingSettings]);

  const [bookingsList, setBookingsList] = useState([]);
  const [viewBookingSnapshot, setViewBookingSnapshot] = useState(null);

  const loadBookings = async () => {
    try {
      const data = await fetchAdminBookings();
      if (Array.isArray(data)) setBookingsList(data);
    } catch (err) { console.error(err); }
  };

  const handleVehicleRateChange = (id, field, val) => {
    const value = field === 'active' ? val : (parseFloat(val) || 0);
    setFleetRates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSaveVehicleRates = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      for (const item of fleetRates) {
        const original = fleet.find(f => f.id === item.id) || {};
        await updateFleetVehicle(item.id, {
          ...original,
          plainRatePerKm: item.plainRatePerKm,
          hillRatePerKm: item.hillRatePerKm,
          minimumKm: item.minimumKm,
          extraKmRate: item.extraKmRate,
          driverAllowance: item.driverAllowance,
          active: item.active,
          ratesHint: '₹' + item.plainRatePerKm + '/km Plain • ₹' + item.hillRatePerKm + '/km Hill • Min ' + item.minimumKm + ' KM'
        });
      }
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Vehicle rates & minimum KM configurations updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save vehicle rates' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      if (isAddingRoute) {
        await addPricingRoute(routeFormData);
        setStatusMsg({ type: 'success', text: 'New pricing route added successfully!' });
      } else if (selectedRoute) {
        await updatePricingRoute(selectedRoute.id, routeFormData);
        setStatusMsg({ type: 'success', text: 'Pricing route updated successfully!' });
      }
      setIsAddingRoute(false);
      setSelectedRoute(null);
      await loadPricingRoutes();
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save route' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await deletePricingRoute(id);
      await loadPricingRoutes();
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Pricing route deleted.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete route' });
    }
  };

  const handleSaveCharges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      await updatePricingSettings({
        ...pricingSettings,
        ...chargesSettings
      });
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Additional charges & surcharge policies saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update charges' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5 text-yellow-600" />
            <span>Authoritative Pricing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
            Fare & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure vehicle plain/hill rates, minimum kilometers, fixed route tariffs, and immutable booking logs.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {statusMsg.text && (
            <div className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>{statusMsg.text}</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveSubTab('vehicle_rates')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${activeSubTab === 'vehicle_rates' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Car className="w-3.5 h-3.5" /><span>Vehicle Rates & Minimum KM</span></button>
        <button onClick={() => setActiveSubTab('routes')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${activeSubTab === 'routes' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Route className="w-3.5 h-3.5" /><span>Fixed Route Tariffs ({pricingRoutesList.length})</span></button>
        <button onClick={() => setActiveSubTab('charges')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${activeSubTab === 'charges' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Clock className="w-3.5 h-3.5" /><span>Additional Charges & Surcharges</span></button>
        <button onClick={() => { setActiveSubTab('bookings'); loadBookings(); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${activeSubTab === 'bookings' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Layers className="w-3.5 h-3.5" /><span>Historical Bookings Ledger ({bookingsList.length})</span></button>
      </div>

      {activeSubTab === 'vehicle_rates' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold font-nexa text-slate-900">Vehicle Base Rate Cards</h2><p className="text-xs text-gray-500">Configure plain-area rate, hill-area rate, minimum billable KM, and chauffeur allowance.</p></div>
            <button onClick={handleSaveVehicleRates} disabled={isSaving} className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"><Save className="w-4 h-4" /><span>{isSaving ? 'Saving...' : 'Save All Vehicle Rates'}</span></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]"><th className="py-3 px-3">Vehicle</th><th className="py-3 px-3">Category</th><th className="py-3 px-3">Plain Rate (₹/km)</th><th className="py-3 px-3">Hill Rate (₹/km)</th><th className="py-3 px-3">Min. Billable KM</th><th className="py-3 px-3">Driver Allowance (₹)</th><th className="py-3 px-3 text-center">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {fleetRates.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{v.name}</td>
                    <td className="py-3.5 px-3 text-gray-500">{v.category}</td>
                    <td className="py-3.5 px-3"><div className="flex items-center space-x-1"><span className="text-gray-400 font-bold">₹</span><input type="number" value={v.plainRatePerKm} onChange={e => handleVehicleRateChange(v.id, 'plainRatePerKm', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-gray-200 font-bold text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none" /></div></td>
                    <td className="py-3.5 px-3"><div className="flex items-center space-x-1"><span className="text-gray-400 font-bold">₹</span><input type="number" value={v.hillRatePerKm} onChange={e => handleVehicleRateChange(v.id, 'hillRatePerKm', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-gray-200 font-bold text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none" /></div></td>
                    <td className="py-3.5 px-3"><div className="flex items-center space-x-1"><input type="number" value={v.minimumKm} onChange={e => handleVehicleRateChange(v.id, 'minimumKm', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-gray-200 font-bold text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none" /><span className="text-gray-400">km</span></div></td>
                    <td className="py-3.5 px-3"><div className="flex items-center space-x-1"><span className="text-gray-400 font-bold">₹</span><input type="number" value={v.driverAllowance} onChange={e => handleVehicleRateChange(v.id, 'driverAllowance', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-gray-200 font-bold text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none" /></div></td>
                    <td className="py-3.5 px-3 text-center"><button type="button" onClick={() => handleVehicleRateChange(v.id, 'active', !v.active)} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${v.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{v.active ? 'Active' : 'Disabled'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'routes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center justify-between">
            <div><h2 className="text-lg font-bold font-nexa text-slate-900">Fixed & Route-Specific Pricing</h2><p className="text-xs text-gray-500">Configure fixed tariffs for designated routes that override standard per-km calculations.</p></div>
            <button onClick={() => { setIsAddingRoute(true); setSelectedRoute(null); setRouteFormData({ pickup: '', destination: '', routeType: 'PLAIN', pricingType: 'fixed', distanceKm: 250, active: true, vehiclePrices: { dzire: 3500, verna: 4000, ertiga: 4500, innova: 5500, fortuner: 8500, tempo: 7500 } }); }} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"><Plus className="w-4 h-4 text-brand-yellow" /><span>Add Fixed Route</span></button>
          </div>

          {(isAddingRoute || selectedRoute) && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold font-nexa text-brand-yellow">{isAddingRoute ? 'Add New Route Tariff' : 'Edit Route Tariff'}</h3>
              <form onSubmit={handleSaveRoute} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div><label className="block text-gray-400 mb-1">Pickup City</label><input type="text" required value={routeFormData.pickup} onChange={e => setRouteFormData({ ...routeFormData, pickup: e.target.value })} placeholder="e.g. Jalandhar" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400" /></div>
                  <div><label className="block text-gray-400 mb-1">Destination</label><input type="text" required value={routeFormData.destination} onChange={e => setRouteFormData({ ...routeFormData, destination: e.target.value })} placeholder="e.g. Delhi Airport" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400" /></div>
                  <div><label className="block text-gray-400 mb-1">Route Terrain Classification</label><select value={routeFormData.routeType} onChange={e => setRouteFormData({ ...routeFormData, routeType: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"><option value="PLAIN">PLAIN TERRAIN</option><option value="HILL">HILL TERRAIN</option><option value="MIXED">MIXED TERRAIN</option></select></div>
                  <div><label className="block text-gray-400 mb-1">Pricing Model</label><select value={routeFormData.pricingType} onChange={e => setRouteFormData({ ...routeFormData, pricingType: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"><option value="fixed">Fixed Flat Tariff</option><option value="per_km">Standard Per-KM</option></select></div>
                </div>
                {routeFormData.pricingType === 'fixed' && (
                  <div className="pt-2"><label className="block text-xs font-bold text-gray-300 mb-2">Vehicle Fixed Fares (₹)</label><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">{['dzire', 'verna', 'ertiga', 'innova', 'fortuner', 'tempo'].map(carId => (<div key={carId} className="bg-slate-800 p-2.5 rounded-xl border border-slate-700"><span className="block text-[11px] text-gray-400 uppercase font-bold">{carId}</span><input type="number" value={routeFormData.vehiclePrices?.[carId] || 0} onChange={e => setRouteFormData({ ...routeFormData, vehiclePrices: { ...routeFormData.vehiclePrices, [carId]: Number(e.target.value) || 0 } })} className="w-full bg-transparent text-white font-bold text-sm outline-none border-b border-slate-600 focus:border-yellow-400 mt-1" /></div>))}</div></div>
                )}
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800"><button type="button" onClick={() => { setIsAddingRoute(false); setSelectedRoute(null); }} className="px-4 py-2 bg-slate-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-slate-700">Cancel</button><button type="submit" disabled={isSaving} className="px-5 py-2 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs hover:bg-yellow-500">{isSaving ? 'Saving...' : 'Save Route Tariff'}</button></div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]"><th className="py-3 px-3">Route</th><th className="py-3 px-3">Terrain</th><th className="py-3 px-3">Pricing Type</th><th className="py-3 px-3">Sample Fixed Fare (Dzire / Innova)</th><th className="py-3 px-3 text-center">Status</th><th className="py-3 px-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {pricingRoutesList.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{r.pickup} → {r.destination}</td>
                    <td className="py-3.5 px-3"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.routeType === 'HILL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{r.routeType || 'PLAIN'}</span></td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{r.pricingType === 'fixed' ? 'Fixed Fare' : 'Per-KM Slabs'}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{r.pricingType === 'fixed' && r.vehiclePrices ? '₹' + (r.vehiclePrices.dzire || 0) + ' / ₹' + (r.vehiclePrices.innova || 0) : <span className="text-gray-400">Standard Rates</span>}</td>
                    <td className="py-3.5 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{r.active !== false ? 'Active' : 'Disabled'}</span></td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button onClick={() => { setSelectedRoute(r); setIsAddingRoute(false); setRouteFormData({ pickup: r.pickup, destination: r.destination, routeType: r.routeType || 'PLAIN', pricingType: r.pricingType || 'fixed', distanceKm: r.distanceKm || 250, active: r.active !== false, vehiclePrices: r.vehiclePrices || {} }); }} className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-400 hover:text-slate-950 font-bold rounded-lg text-slate-700 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteRoute(r.id)} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-500 hover:text-white font-bold rounded-lg text-rose-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'charges' && (
        <form onSubmit={handleSaveCharges} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold font-nexa text-slate-900">Additional Charges & Surcharges</h2><p className="text-xs text-gray-500">Configure driver allowance, night-time surcharges, and toll/tax display rules.</p></div>
            <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"><Save className="w-4 h-4" /><span>{isSaving ? 'Saving...' : 'Save Charges Settings'}</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-600" />Night Travel Surcharge</h3>
              <div><label className="block text-gray-600 mb-1 font-medium">Night Surcharge Amount (₹)</label><input type="number" value={chargesSettings.nightChargesAmount} onChange={e => setChargesSettings({ ...chargesSettings, nightChargesAmount: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-gray-600 mb-1 font-medium">Start Hour (24h)</label><input type="number" min="0" max="23" value={chargesSettings.nightChargeStartHour} onChange={e => setChargesSettings({ ...chargesSettings, nightChargeStartHour: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
                <div><label className="block text-gray-600 mb-1 font-medium">End Hour (24h)</label><input type="number" min="0" max="23" value={chargesSettings.nightChargeEndHour} onChange={e => setChargesSettings({ ...chargesSettings, nightChargeEndHour: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />Receipts & Policy Disclaimer</h3>
              <div><label className="block text-gray-600 mb-1 font-medium">Terms & Inclusions Disclaimer</label><textarea rows={4} value={chargesSettings.termsAndConditions} onChange={e => setChargesSettings({ ...chargesSettings, termsAndConditions: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium text-slate-900 outline-none" /></div>
            </div>
          </div>
        </form>
      )}

      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold font-nexa text-slate-900">Historical Bookings & Frozen Snapshots</h2><p className="text-xs text-gray-500">All customer bookings preserve the exact tariff, billable distance, and rates in effect at booking time.</p></div></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]"><th className="py-3 px-3">Booking ID</th><th className="py-3 px-3">Route</th><th className="py-3 px-3">Vehicle</th><th className="py-3 px-3">Distance / Rate</th><th className="py-3 px-3">Total Fare</th><th className="py-3 px-3">Status</th><th className="py-3 px-3 text-right">Audit Snapshot</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {bookingsList.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-400">No bookings recorded yet.</td></tr>
                ) : (
                  bookingsList.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3.5 px-3 font-bold text-slate-900">{b.id}</td>
                      <td className="py-3.5 px-3 font-medium text-slate-800">{b.pickup} → {b.destination}</td>
                      <td className="py-3.5 px-3 text-gray-600">{b.vehicleName}</td>
                      <td className="py-3.5 px-3 text-gray-700">{b.billableKm} KM @ ₹{b.ratePerKm}/km</td>
                      <td className="py-3.5 px-3 font-black text-slate-950">₹{b.totalFare?.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{b.status}</span></td>
                      <td className="py-3.5 px-3 text-right"><button onClick={() => setViewBookingSnapshot(b)} className="px-2.5 py-1 bg-slate-900 text-white hover:bg-yellow-400 hover:text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1 ml-auto"><Eye className="w-3.5 h-3.5" /><span>View Snapshot</span></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {viewBookingSnapshot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-left relative">
                <h3 className="text-lg font-bold font-nexa text-slate-900 mb-3">Historical Pricing Snapshot: {viewBookingSnapshot.id}</h3>
                <pre className="bg-slate-900 text-yellow-300 p-4 rounded-2xl text-[11px] overflow-auto max-h-96 font-mono">{JSON.stringify(viewBookingSnapshot.pricingSnapshot || viewBookingSnapshot, null, 2)}</pre>
                <div className="mt-4 flex justify-end"><button onClick={() => setViewBookingSnapshot(null)} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800">Close</button></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}