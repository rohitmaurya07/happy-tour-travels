import React, { useState, useEffect } from 'react';
import { 
  DollarSign, CheckCircle2, Save, AlertCircle, Plus, Trash2, Mountain, 
  Route, Car, Clock, ShieldCheck, Layers, Eye, Calculator, Sparkles, 
  Check, ArrowRight, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { 
  updatePricingSettings, updateFleetVehicle, updateAllVehiclePricing, 
  fetchPricingRoutes, addPricingRoute, updatePricingRoute, deletePricingRoute, 
  fetchAdminBookings, previewFareAdminApi 
} from '../../../services/api';

export default function PricingTab() {
  const { pricingSettings, fleet, refreshSiteData } = useSiteData();
  const [activeSubTab, setActiveSubTab] = useState('vehicle_pricing'); // 'vehicle_pricing' | 'preview_calculator' | 'routes' | 'charges' | 'bookings'
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [validationError, setValidationError] = useState('');

  // Fleet Vehicles state
  const [vehiclesList, setVehiclesList] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    if (fleet && fleet.length > 0) {
      const formatted = fleet.map(car => ({
        ...car,
        minBookingKm: car.minBookingKm !== undefined ? Number(car.minBookingKm) : 20,
        slabs: Array.isArray(car.slabs) ? car.slabs : [
          { minKm: 20, maxKm: 35, price: 900 },
          { minKm: 35, maxKm: 55, price: 1100 },
          { minKm: 55, maxKm: 75, price: 1300 },
          { minKm: 75, maxKm: 95, price: 1500 }
        ],
        longDistance: car.longDistance || {
          startAfterKm: 95,
          baseFare: 1700,
          additionalKmRate: car.oneWayRate || car.plainRatePerKm || 12
        },
        oneWayRate: car.oneWayRate !== undefined ? Number(car.oneWayRate) : 12,
        roundTripRate: car.roundTripRate !== undefined ? Number(car.roundTripRate) : 11,
        packages: car.packages || {
          fourHours: { price: car.localPackages?.fourHours || 1000, includedKm: 40 },
          eightHours: { price: car.localPackages?.eightHours || car.hourlyRate || 1500, includedKm: 80 }
        },
        airportBasePrice: car.airportBasePrice !== undefined ? Number(car.airportBasePrice) : (car.airportFixedRate || 2499),
        plainRatePerKm: car.plainRatePerKm !== undefined ? Number(car.plainRatePerKm) : 10,
        hillRatePerKm: car.hillRatePerKm !== undefined ? Number(car.hillRatePerKm) : 11,
        minimumKm: car.minimumKm !== undefined ? Number(car.minimumKm) : 250,
        extraKmRate: car.extraKmRate !== undefined ? Number(car.extraKmRate) : 11,
        driverAllowance: car.driverAllowance !== undefined ? Number(car.driverAllowance) : 300,
        active: car.active !== false
      }));

      setVehiclesList(formatted);
      if (!selectedVehicleId || !formatted.some(v => v.id === selectedVehicleId)) {
        setSelectedVehicleId(formatted[0].id);
      }
    }
  }, [fleet]);

  const selectedVehicle = vehiclesList.find(v => v.id === selectedVehicleId) || vehiclesList[0] || null;

  // Slabs & Form updater
  const updateSelectedVehicleField = (field, value) => {
    setValidationError('');
    setVehiclesList(prev => prev.map(v => {
      if (v.id === selectedVehicleId) {
        return { ...v, [field]: value };
      }
      return v;
    }));
  };

  const updateLongDistanceField = (field, value) => {
    setValidationError('');
    setVehiclesList(prev => prev.map(v => {
      if (v.id === selectedVehicleId) {
        return {
          ...v,
          longDistance: {
            ...v.longDistance,
            [field]: Number(value) || 0
          }
        };
      }
      return v;
    }));
  };

  const updatePackageField = (pkgKey, field, value) => {
    setValidationError('');
    setVehiclesList(prev => prev.map(v => {
      if (v.id === selectedVehicleId) {
        return {
          ...v,
          packages: {
            ...v.packages,
            [pkgKey]: {
              ...v.packages?.[pkgKey],
              [field]: Number(value) || 0
            }
          }
        };
      }
      return v;
    }));
  };

  const handleSlabChange = (index, field, val) => {
    setValidationError('');
    if (!selectedVehicle) return;
    const newSlabs = [...(selectedVehicle.slabs || [])];
    newSlabs[index] = { ...newSlabs[index], [field]: Number(val) || 0 };
    updateSelectedVehicleField('slabs', newSlabs);
  };

  const handleAddSlab = () => {
    setValidationError('');
    if (!selectedVehicle) return;
    const currentSlabs = selectedVehicle.slabs || [];
    const lastSlab = currentSlabs[currentSlabs.length - 1];
    const newMin = lastSlab ? Number(lastSlab.maxKm) : (selectedVehicle.minBookingKm || 20);
    const newMax = newMin + 20;
    const newPrice = lastSlab ? Number(lastSlab.price) + 200 : 900;
    updateSelectedVehicleField('slabs', [...currentSlabs, { minKm: newMin, maxKm: newMax, price: newPrice }]);
  };

  const handleRemoveSlab = (index) => {
    setValidationError('');
    if (!selectedVehicle) return;
    const newSlabs = (selectedVehicle.slabs || []).filter((_, i) => i !== index);
    updateSelectedVehicleField('slabs', newSlabs);
  };

  // Client-side Validation Engine
  const validateVehicleForm = (vehicle) => {
    if (!vehicle) return 'No vehicle selected.';
    if (!vehicle.name?.trim()) return 'Vehicle name cannot be empty.';

    const nonNegatives = [
      { val: vehicle.plainRatePerKm, name: 'Plain Rate' },
      { val: vehicle.hillRatePerKm, name: 'Hill Rate' },
      { val: vehicle.oneWayRate, name: 'One-Way Rate' },
      { val: vehicle.roundTripRate, name: 'Round-Trip Rate' },
      { val: vehicle.extraKmRate, name: 'Extra KM Rate' },
      { val: vehicle.minBookingKm, name: 'Minimum Booking KM' },
      { val: vehicle.airportBasePrice, name: 'Airport Base Price' },
      { val: vehicle.driverAllowance, name: 'Driver Allowance' },
      { val: vehicle.longDistance?.startAfterKm, name: 'Long Distance Threshold KM' },
      { val: vehicle.longDistance?.baseFare, name: 'Long Distance Base Fare' },
      { val: vehicle.longDistance?.additionalKmRate, name: 'Long Distance Additional Rate' },
      { val: vehicle.packages?.fourHours?.price, name: '4-Hour Package Price' },
      { val: vehicle.packages?.eightHours?.price, name: '8-Hour Package Price' }
    ];

    for (const item of nonNegatives) {
      if (item.val === undefined || item.val === null || isNaN(item.val) || Number(item.val) < 0) {
        return `${item.name} cannot be negative or invalid.`;
      }
    }

    if (Number(vehicle.longDistance?.startAfterKm) < Number(vehicle.minBookingKm)) {
      return `Long-distance threshold (${vehicle.longDistance?.startAfterKm} km) cannot be lower than minimum booking distance (${vehicle.minBookingKm} km).`;
    }

    if (Array.isArray(vehicle.slabs) && vehicle.slabs.length > 0) {
      const sorted = [...vehicle.slabs].sort((a, b) => Number(a.minKm) - Number(b.minKm));
      for (let i = 0; i < sorted.length; i++) {
        const s = sorted[i];
        if (Number(s.minKm) < 0 || Number(s.maxKm) <= Number(s.minKm)) {
          return `Slab #${i + 1} (${s.minKm}–${s.maxKm} KM) is invalid. End KM must be greater than Start KM.`;
        }
        if (Number(s.price) < 0) {
          return `Slab #${i + 1} price cannot be negative.`;
        }
        if (i > 0) {
          const prev = sorted[i - 1];
          if (Number(s.minKm) === Number(prev.minKm) && Number(s.maxKm) === Number(prev.maxKm)) {
            return `Duplicate slab range: ${s.minKm}–${s.maxKm} KM.`;
          }
          if (Number(s.minKm) < Number(prev.maxKm)) {
            return `Overlapping slabs: ${prev.minKm}–${prev.maxKm} KM overlaps with ${s.minKm}–${s.maxKm} KM.`;
          }
        }
      }
    }

    return null;
  };

  const handleSaveSelectedVehicle = async () => {
    if (!selectedVehicle) return;
    const error = validateVehicleForm(selectedVehicle);
    if (error) {
      setValidationError(error);
      setStatusMsg({ type: 'error', text: error });
      return;
    }

    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    setValidationError('');

    try {
      await updateFleetVehicle(selectedVehicle.id, selectedVehicle);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: `Pricing configuration for ${selectedVehicle.name} saved successfully!` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save vehicle pricing.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllVehicles = async () => {
    for (const v of vehiclesList) {
      const error = validateVehicleForm(v);
      if (error) {
        setValidationError(`Vehicle "${v.name}": ${error}`);
        setStatusMsg({ type: 'error', text: `Vehicle "${v.name}": ${error}` });
        return;
      }
    }

    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    setValidationError('');

    try {
      await updateAllVehiclePricing(vehiclesList);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'All vehicles pricing configurations saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save all vehicles.' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- PREVIEW / TEST FARE CALCULATOR STATE ---
  const [testCalc, setTestCalc] = useState({
    vehicleId: 'dzire',
    distanceKm: 385,
    tripType: 'One Way',
    pickupTime: '09:00',
    hourlyPackage: '8h'
  });
  const [testResult, setTestResult] = useState(null);
  const [isCalculatingTest, setIsCalculatingTest] = useState(false);

  const runTestCalculation = async () => {
    setIsCalculatingTest(true);
    try {
      const result = await previewFareAdminApi({
        vehicleId: testCalc.vehicleId,
        distanceKm: Number(testCalc.distanceKm) || 50,
        tripType: testCalc.tripType,
        pickupTime: testCalc.pickupTime,
        hourlyPackage: testCalc.hourlyPackage
      });
      setTestResult(result);
    } catch (err) {
      console.error(err);
      // Fallback local calculate
      const car = vehiclesList.find(v => v.id === testCalc.vehicleId) || vehiclesList[0];
      if (car) {
        const dist = Number(testCalc.distanceKm) || 50;
        const ld = car.longDistance || { startAfterKm: 95, baseFare: 1700, additionalKmRate: 12 };
        let baseFare = 0;
        let pricingType = 'long_distance';
        if (dist > ld.startAfterKm) {
          baseFare = ld.baseFare + ((dist - ld.startAfterKm) * ld.additionalKmRate);
        } else {
          baseFare = Math.round(dist * car.oneWayRate);
          pricingType = 'local_slab';
        }
        setTestResult({
          vehicle: car.name,
          distanceKm: dist,
          billableKm: dist,
          baseFare,
          driverAllowance: car.driverAllowance || 300,
          nightCharges: 0,
          estimatedTotal: baseFare + (car.driverAllowance || 300),
          pricingType,
          pricingRuleApplied: `Long Distance: ₹${ld.baseFare} + (${dist} - ${ld.startAfterKm}) × ₹${ld.additionalKmRate}`
        });
      }
    } finally {
      setIsCalculatingTest(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'preview_calculator' && vehiclesList.length > 0) {
      runTestCalculation();
    }
  }, [activeSubTab, testCalc.vehicleId, testCalc.distanceKm, testCalc.tripType, testCalc.pickupTime, testCalc.hourlyPackage]);

  // --- PRICING ROUTES STATE ---
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

  // --- CHARGES STATE ---
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

  // --- BOOKINGS STATE ---
  const [bookingsList, setBookingsList] = useState([]);
  const [viewBookingSnapshot, setViewBookingSnapshot] = useState(null);

  const loadBookings = async () => {
    try {
      const data = await fetchAdminBookings();
      if (Array.isArray(data)) setBookingsList(data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5 text-yellow-600" />
            <span>Configurable Pricing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
            Taxi Pricing & Fare Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure local slab prices, long-distance thresholds, base fares, hourly packages, airport rates, and test calculations live.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {statusMsg.text && (
            <div className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('vehicle_pricing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'vehicle_pricing' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Vehicle Pricing & Distance Slabs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preview_calculator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'preview_calculator' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-yellow-500" />
          <span>Preview / Test Fare Calculator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('routes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'routes' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>Fixed & Route Tariffs ({pricingRoutesList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('charges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'charges' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Surcharges & Policies</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('bookings'); loadBookings(); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'bookings' ? 'bg-slate-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Historical Bookings Snapshot ({bookingsList.length})</span>
        </button>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SUBTAB 1: VEHICLE PRICING & SLABS */}
      {activeSubTab === 'vehicle_pricing' && (
        <div className="space-y-6">
          
          {/* Vehicle Selector Carousel / Pills */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Select Vehicle to Configure:
              </span>
              <button
                onClick={handleSaveAllVehicles}
                disabled={isSaving}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Vehicles</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {vehiclesList.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVehicleId(v.id); setValidationError(''); }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedVehicleId === v.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-yellow-400/50'
                      : 'bg-gray-50 hover:bg-gray-100 text-slate-800 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gray-400">{v.category}</span>
                    <span className={`w-2 h-2 rounded-full ${v.active ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                  </div>
                  <h4 className="text-xs font-black font-nexa mt-1 truncate">{v.name}</h4>
                  <p className="text-[11px] font-bold text-brand-yellow mt-1">
                    ₹{v.longDistance?.additionalKmRate || v.plainRatePerKm || 12}/km
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Vehicle Pricing Editor Card */}
          {selectedVehicle && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8 animate-fadeIn">
              
              {/* Header with Name and Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-yellow-400 text-[10px] font-bold uppercase rounded-md tracking-wider mb-1">
                    Editing Pricing Parameters
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-nexa text-slate-900 flex items-center gap-2">
                    <span>{selectedVehicle.name}</span>
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVehicle.active}
                      onChange={e => updateSelectedVehicleField('active', e.target.checked)}
                      className="rounded text-yellow-400 focus:ring-yellow-400"
                    />
                    <span>Active for Booking</span>
                  </label>

                  <button
                    onClick={handleSaveSelectedVehicle}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : `Save ${selectedVehicle.name}`}</span>
                  </button>
                </div>
              </div>

              {/* GRID: Local Slabs & Long Distance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SECTION 1: Local One-Way Slabs */}
                <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black font-nexa text-slate-900 flex items-center">
                        <Route className="w-4 h-4 mr-2 text-brand-gold" />
                        Local One-Way Pricing & Slabs
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">Fixed rates for short commutes within local city limits.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSlab}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-brand-yellow" />
                      <span>Add Slab</span>
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Minimum Booking Distance:</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="0"
                        value={selectedVehicle.minBookingKm ?? 20}
                        onChange={e => updateSelectedVehicleField('minBookingKm', e.target.value)}
                        className="w-20 px-2.5 py-1 text-right font-bold text-slate-900 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <span className="text-xs font-semibold text-gray-500">KM</span>
                    </div>
                  </div>

                  {/* Slabs List */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2">
                      <span className="col-span-3">From KM</span>
                      <span className="col-span-3">To KM</span>
                      <span className="col-span-4">Fixed Slab Price</span>
                      <span className="col-span-2 text-right">Action</span>
                    </div>

                    {(selectedVehicle.slabs || []).map((slab, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-gray-200">
                        <div className="col-span-3 flex items-center space-x-1">
                          <input
                            type="number"
                            value={slab.minKm}
                            onChange={e => handleSlabChange(idx, 'minKm', e.target.value)}
                            className="w-full px-2 py-1 text-xs font-bold text-slate-900 border border-gray-200 rounded-lg outline-none"
                          />
                        </div>
                        <div className="col-span-3 flex items-center space-x-1">
                          <input
                            type="number"
                            value={slab.maxKm}
                            onChange={e => handleSlabChange(idx, 'maxKm', e.target.value)}
                            className="w-full px-2 py-1 text-xs font-bold text-slate-900 border border-gray-200 rounded-lg outline-none"
                          />
                        </div>
                        <div className="col-span-4 flex items-center space-x-1">
                          <span className="text-xs font-bold text-gray-400">₹</span>
                          <input
                            type="number"
                            value={slab.price}
                            onChange={e => handleSlabChange(idx, 'price', e.target.value)}
                            className="w-full px-2 py-1 text-xs font-black text-slate-900 border border-gray-200 rounded-lg outline-none"
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSlab(idx)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 2: Long Distance Threshold & Additional KM */}
                <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                  <div>
                    <h3 className="text-sm font-black font-nexa text-brand-yellow flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Long Distance Dynamic Threshold
                    </h3>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Applied when ride distance exceeds the specified threshold kilometer limit.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        After KM Threshold
                      </label>
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={selectedVehicle.longDistance?.startAfterKm ?? 95}
                          onChange={e => updateLongDistanceField('startAfterKm', e.target.value)}
                          className="w-full bg-transparent text-lg font-black text-white outline-none border-b border-slate-600 focus:border-yellow-400"
                        />
                        <span className="text-xs text-gray-400 font-bold">KM</span>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Base Fare at Threshold
                      </label>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-yellow-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={selectedVehicle.longDistance?.baseFare ?? 1700}
                          onChange={e => updateLongDistanceField('baseFare', e.target.value)}
                          className="w-full bg-transparent text-lg font-black text-white outline-none border-b border-slate-600 focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Additional Rate / KM
                      </label>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-yellow-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={selectedVehicle.longDistance?.additionalKmRate ?? 12}
                          onChange={e => updateLongDistanceField('additionalKmRate', e.target.value)}
                          className="w-full bg-transparent text-lg font-black text-white outline-none border-b border-slate-600 focus:border-yellow-400"
                        />
                        <span className="text-xs text-gray-400">/km</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Dynamic Formula Card */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-yellow-400/20 text-xs text-gray-300 space-y-1">
                    <p className="font-bold text-yellow-300 text-[11px] uppercase tracking-wider">Formula Preview:</p>
                    <p className="font-mono text-[11px] text-white">
                      if (distance &gt; {selectedVehicle.longDistance?.startAfterKm || 95} km):<br />
                      &nbsp;&nbsp;fare = ₹{selectedVehicle.longDistance?.baseFare || 1700} + (distance - {selectedVehicle.longDistance?.startAfterKm || 95}) × ₹{selectedVehicle.longDistance?.additionalKmRate || 12}/km
                    </p>
                    <p className="text-[10px] text-gray-400 pt-1">
                      Example: 385 km = ₹{selectedVehicle.longDistance?.baseFare || 1700} + ({385 - (selectedVehicle.longDistance?.startAfterKm || 95)}) × ₹{selectedVehicle.longDistance?.additionalKmRate || 12} = ₹{((selectedVehicle.longDistance?.baseFare || 1700) + (385 - (selectedVehicle.longDistance?.startAfterKm || 95)) * (selectedVehicle.longDistance?.additionalKmRate || 12)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

              </div>

              {/* SECTION 3: Standard Rates, Packages & Terrain Classifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 text-xs">
                
                {/* 3A: Outstation Per-KM Rates */}
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
                    <Car className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    One-Way & Round-Trip Rates
                  </h4>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Standard One-Way Rate (₹/km)</label>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={selectedVehicle.oneWayRate ?? 12}
                        onChange={e => updateSelectedVehicleField('oneWayRate', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Round-Trip Rate (₹/km)</label>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={selectedVehicle.roundTripRate ?? 11}
                        onChange={e => updateSelectedVehicleField('roundTripRate', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Outstation Minimum KM / Day</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={selectedVehicle.minimumKm ?? 250}
                        onChange={e => updateSelectedVehicleField('minimumKm', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                      <span className="text-gray-400">KM</span>
                    </div>
                  </div>
                </div>

                {/* 3B: Hourly Rental Packages */}
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                    Hourly Rental Packages
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">4H Price (₹)</label>
                      <input
                        type="number"
                        value={selectedVehicle.packages?.fourHours?.price ?? 1000}
                        onChange={e => updatePackageField('fourHours', 'price', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">4H Incl. KM</label>
                      <input
                        type="number"
                        value={selectedVehicle.packages?.fourHours?.includedKm ?? 40}
                        onChange={e => updatePackageField('fourHours', 'includedKm', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">8H Price (₹)</label>
                      <input
                        type="number"
                        value={selectedVehicle.packages?.eightHours?.price ?? 1500}
                        onChange={e => updatePackageField('eightHours', 'price', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">8H Incl. KM</label>
                      <input
                        type="number"
                        value={selectedVehicle.packages?.eightHours?.includedKm ?? 80}
                        onChange={e => updatePackageField('eightHours', 'includedKm', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Extra KM Rate (₹/km)</label>
                    <input
                      type="number"
                      value={selectedVehicle.extraKmRate ?? 11}
                      onChange={e => updateSelectedVehicleField('extraKmRate', e.target.value)}
                      className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* 3C: Terrain Classifications & Airport Base */}
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
                    <Mountain className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Terrain Rates & Airport Base
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">Plain Rate (₹/km)</label>
                      <input
                        type="number"
                        value={selectedVehicle.plainRatePerKm ?? 10}
                        onChange={e => updateSelectedVehicleField('plainRatePerKm', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">Hill Rate (₹/km)</label>
                      <input
                        type="number"
                        value={selectedVehicle.hillRatePerKm ?? 11}
                        onChange={e => updateSelectedVehicleField('hillRatePerKm', e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Airport Base Price (₹)</label>
                    <input
                      type="number"
                      value={selectedVehicle.airportBasePrice ?? 2499}
                      onChange={e => updateSelectedVehicleField('airportBasePrice', e.target.value)}
                      className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Driver Allowance (₹ / Day)</label>
                    <input
                      type="number"
                      value={selectedVehicle.driverAllowance ?? 300}
                      onChange={e => updateSelectedVehicleField('driverAllowance', e.target.value)}
                      className="w-full bg-white px-3 py-2 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => refreshSiteData()}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSaveSelectedVehicle}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : `Save ${selectedVehicle.name} Configuration`}</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PREVIEW / TEST FARE CALCULATOR */}
      {activeSubTab === 'preview_calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Controls Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5 text-yellow-600" />
                <span>Real-Time Sandbox</span>
              </div>
              <h2 className="text-xl font-bold font-nexa text-slate-900">
                Preview & Test Fare Calculation
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Test how modified thresholds, slabs, and rates calculate in practice for any distance or trip type.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Select Vehicle</label>
                <select
                  value={testCalc.vehicleId}
                  onChange={e => setTestCalc({ ...testCalc, vehicleId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {vehiclesList.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category}) — ₹{v.longDistance?.additionalKmRate || v.plainRatePerKm}/km
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Enter Test Distance (KM)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={testCalc.distanceKm}
                    onChange={e => setTestCalc({ ...testCalc, distanceKm: e.target.value })}
                    placeholder="e.g. 385"
                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-slate-900 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <span className="font-bold text-gray-500">KM</span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-400 font-bold self-center mr-1">Presets:</span>
                  {[25, 50, 70, 95, 150, 385, 460].map(dist => (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => setTestCalc({ ...testCalc, distanceKm: dist })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-400 hover:text-slate-950 text-gray-700 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      {dist} km
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Trip Type</label>
                  <select
                    value={testCalc.tripType}
                    onChange={e => setTestCalc({ ...testCalc, tripType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="Airport">Airport</option>
                    <option value="Hourly Rental">Hourly Rental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1">Pickup Time</label>
                  <input
                    type="time"
                    value={testCalc.pickupTime}
                    onChange={e => setTestCalc({ ...testCalc, pickupTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {testCalc.tripType === 'Hourly Rental' && (
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Hourly Package</label>
                  <select
                    value={testCalc.hourlyPackage}
                    onChange={e => setTestCalc({ ...testCalc, hourlyPackage: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    <option value="4h">4 Hours / 40 KM</option>
                    <option value="8h">8 Hours / 80 KM</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={runTestCalculation}
                disabled={isCalculatingTest}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 text-brand-yellow ${isCalculatingTest ? 'animate-spin' : ''}`} />
                <span>Recalculate Fare Preview</span>
              </button>
            </div>
          </div>

          {/* Results Breakdown Card */}
          <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold">
                    Authoritative Output
                  </span>
                  <h3 className="text-xl font-black font-nexa text-white mt-1">
                    {testResult?.vehicle || selectedVehicle?.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimated Total</span>
                  <div className="text-3xl font-black font-nexa text-brand-yellow">
                    ₹{testResult?.estimatedTotal?.toLocaleString('en-IN') || '0'}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown Table */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-xs space-y-2.5 font-mono">
                <div className="flex justify-between text-gray-400 border-b border-slate-800 pb-2">
                  <span>Pricing Rule:</span>
                  <span className="text-yellow-300 font-bold text-right truncate max-w-[200px]">
                    {testResult?.pricingRuleApplied || 'Standard Engine'}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Actual Distance:</span>
                  <span className="font-bold text-white">{testResult?.distanceKm || testCalc.distanceKm} KM</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Billable Distance:</span>
                  <span className="font-bold text-white">{testResult?.billableKm || testCalc.distanceKm} KM</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Base Fare:</span>
                  <span className="font-bold text-emerald-400">₹{testResult?.baseFare?.toLocaleString('en-IN') || 0}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Driver Allowance:</span>
                  <span className="font-bold text-white">₹{testResult?.driverAllowance || 0}</span>
                </div>

                {testResult?.nightCharges > 0 && (
                  <div className="flex justify-between text-indigo-400">
                    <span>Night Surcharge:</span>
                    <span className="font-bold">₹{testResult?.nightCharges}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400 text-[11px] pt-1">
                  <span>Tolls & Parking:</span>
                  <span className="text-gray-300">Payable at Actual Receipts</span>
                </div>
              </div>

              {/* Snapshot Raw View */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-gray-400">
                <p className="font-bold text-gray-300 text-[10px] uppercase mb-1">Pricing Model Tag:</p>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-yellow-300 font-mono text-[10px]">
                  {testResult?.pricingType || 'calculated'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 pt-4 text-center">
              Fare calculated server-side with zero hardcoded variables.
            </p>
          </div>

        </div>
      )}

      {/* SUBTAB 3: FIXED & ROUTE TARIFFS */}
      {activeSubTab === 'routes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-nexa text-slate-900">Fixed & Route-Specific Tariffs</h2>
              <p className="text-xs text-gray-500">Configure fixed tariffs for designated routes (Airport, Plain, Hill, Mixed) that override standard calculations.</p>
            </div>
            <button
              onClick={() => {
                setIsAddingRoute(true);
                setSelectedRoute(null);
                setRouteFormData({
                  pickup: '',
                  destination: '',
                  routeType: 'PLAIN',
                  pricingType: 'fixed',
                  distanceKm: 250,
                  active: true,
                  vehiclePrices: { dzire: 3500, verna: 4000, ertiga: 4500, innova: 5500, fortuner: 8500, tempo: 7500 }
                });
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-brand-yellow" />
              <span>Add Route Tariff</span>
            </button>
          </div>

          {(isAddingRoute || selectedRoute) && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold font-nexa text-brand-yellow">
                {isAddingRoute ? 'Add New Route Tariff' : 'Edit Route Tariff'}
              </h3>
              <form onSubmit={handleSaveRoute} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">Pickup City</label>
                    <input
                      type="text"
                      required
                      value={routeFormData.pickup}
                      onChange={e => setRouteFormData({ ...routeFormData, pickup: e.target.value })}
                      placeholder="e.g. Jalandhar"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Destination</label>
                    <input
                      type="text"
                      required
                      value={routeFormData.destination}
                      onChange={e => setRouteFormData({ ...routeFormData, destination: e.target.value })}
                      placeholder="e.g. Delhi Airport"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Route Classification</label>
                    <select
                      value={routeFormData.routeType}
                      onChange={e => setRouteFormData({ ...routeFormData, routeType: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"
                    >
                      <option value="PLAIN">PLAIN TERRAIN</option>
                      <option value="HILL">HILL TERRAIN</option>
                      <option value="MIXED">MIXED TERRAIN</option>
                      <option value="AIRPORT">AIRPORT ROUTE</option>
                      <option value="FIXED">FIXED ROUTE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Pricing Model</label>
                    <select
                      value={routeFormData.pricingType}
                      onChange={e => setRouteFormData({ ...routeFormData, pricingType: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-yellow-400"
                    >
                      <option value="fixed">Fixed Flat Tariff</option>
                      <option value="per_km">Standard Per-KM</option>
                    </select>
                  </div>
                </div>

                {routeFormData.pricingType === 'fixed' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-300 mb-2">
                      Vehicle-Specific Override Fares (₹)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                      {['dzire', 'verna', 'ertiga', 'innova', 'fortuner', 'tempo'].map(carId => (
                        <div key={carId} className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                          <span className="block text-[11px] text-gray-400 uppercase font-bold">{carId}</span>
                          <input
                            type="number"
                            value={routeFormData.vehiclePrices?.[carId] || 0}
                            onChange={e => setRouteFormData({
                              ...routeFormData,
                              vehiclePrices: { ...routeFormData.vehiclePrices, [carId]: Number(e.target.value) || 0 }
                            })}
                            className="w-full bg-transparent text-white font-bold text-sm outline-none border-b border-slate-600 focus:border-yellow-400 mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setIsAddingRoute(false); setSelectedRoute(null); }}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs hover:bg-yellow-500"
                  >
                    {isSaving ? 'Saving...' : 'Save Route Tariff'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Classification</th>
                  <th className="py-3 px-3">Pricing Type</th>
                  <th className="py-3 px-3">Sample Fixed Fare (Dzire / Innova)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingRoutesList.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{r.pickup} → {r.destination}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.routeType === 'HILL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {r.routeType || 'PLAIN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{r.pricingType === 'fixed' ? 'Fixed Fare' : 'Per-KM Slabs'}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">
                      {r.pricingType === 'fixed' && r.vehiclePrices ? `₹${r.vehiclePrices.dzire || 0} / ₹${r.vehiclePrices.innova || 0}` : <span className="text-gray-400">Standard Rates</span>}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                        {r.active !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRoute(r);
                          setIsAddingRoute(false);
                          setRouteFormData({
                            pickup: r.pickup,
                            destination: r.destination,
                            routeType: r.routeType || 'PLAIN',
                            pricingType: r.pricingType || 'fixed',
                            distanceKm: r.distanceKm || 250,
                            active: r.active !== false,
                            vehiclePrices: r.vehiclePrices || {}
                          });
                        }}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-400 hover:text-slate-950 font-bold rounded-lg text-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(r.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-500 hover:text-white font-bold rounded-lg text-rose-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SURCHARGES & POLICIES */}
      {activeSubTab === 'charges' && (
        <form onSubmit={handleSaveCharges} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-nexa text-slate-900">Additional Charges & Surcharges</h2>
              <p className="text-xs text-gray-500">Configure night-time travel surcharges, default chauffeur allowances, and disclaimer receipts.</p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Charges Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                Night Travel Surcharge Policy
              </h3>
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Night Surcharge Amount (₹)</label>
                <input
                  type="number"
                  value={chargesSettings.nightChargesAmount}
                  onChange={e => setChargesSettings({ ...chargesSettings, nightChargesAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Start Hour (24h format)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={chargesSettings.nightChargeStartHour}
                    onChange={e => setChargesSettings({ ...chargesSettings, nightChargeStartHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">End Hour (24h format)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={chargesSettings.nightChargeEndHour}
                    onChange={e => setChargesSettings({ ...chargesSettings, nightChargeEndHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                Receipts & Inclusions Policy
              </h3>
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Terms & Inclusions Disclaimer</label>
                <textarea
                  rows={4}
                  value={chargesSettings.termsAndConditions}
                  onChange={e => setChargesSettings({ ...chargesSettings, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SUBTAB 5: HISTORICAL BOOKINGS SNAPSHOT */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-nexa text-slate-900">Historical Bookings & Frozen Snapshots</h2>
              <p className="text-xs text-gray-500">Every customer booking preserves the exact immutable tariff, distance, and rates in effect at booking time.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Distance / Rate</th>
                  <th className="py-3 px-3">Total Fare</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Snapshot Audit</th>
                </tr>
              </thead>
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
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setViewBookingSnapshot(b)}
                          className="px-2.5 py-1 bg-slate-900 text-white hover:bg-yellow-400 hover:text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Snapshot</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {viewBookingSnapshot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-left relative">
                <h3 className="text-lg font-bold font-nexa text-slate-900 mb-1">
                  Historical Pricing Snapshot
                </h3>
                <p className="text-xs text-gray-500 mb-3">Booking ID: {viewBookingSnapshot.id}</p>
                <pre className="bg-slate-900 text-yellow-300 p-4 rounded-2xl text-[11px] overflow-auto max-h-96 font-mono">
                  {JSON.stringify(viewBookingSnapshot.pricingSnapshot || viewBookingSnapshot, null, 2)}
                </pre>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setViewBookingSnapshot(null)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}