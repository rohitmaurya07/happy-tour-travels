import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Trash2, Edit2, Search, Save, 
  CheckCircle2, AlertCircle, Clock, Plane, ShieldCheck, X, RefreshCw, RotateCcw
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { 
  fetchPricingRoutes, addPricingRoute, updatePricingRoute, deletePricingRoute,
  updatePricingSettings, updateHourlyRentalPricing, updateAllVehiclePricing,
  bulkApplyRoundTripRates
} from '../../../services/api';

export default function PricingTab() {
  const { pricingSettings, fleet, hourlyRentalPricing, refreshSiteData } = useSiteData();
  const [activeTab, setActiveTab] = useState('routes'); // 'routes' | 'roundtrip' | 'hourly' | 'airport' | 'charges'
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // --- 1. ROUTES STATE ---
  const [routesList, setRoutesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeForm, setRouteForm] = useState({
    pickup: '',
    destination: '',
    distanceKm: '',
    routeType: 'PLAIN',
    vehiclePrices: {
      dzire: 4000,
      verna: 4500,
      ertiga: 5000,
      innova: 6500,
      fortuner: 9500,
      tempo: 8500
    },
    roundTripPrices: {
      dzire: '',
      verna: '',
      ertiga: '',
      innova: '',
      fortuner: '',
      tempo: ''
    }
  });

  const loadRoutes = async () => {
    try {
      const data = await fetchPricingRoutes();
      if (Array.isArray(data)) setRoutesList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // --- 2. HOURLY RENTAL STATE ---
  const [hourlyRates, setHourlyRates] = useState({
    dzire: { "4h40k": 1100, "8h80k": 1600, "10h100k": 2000, extraKmRate: 11, extraHourRate: 100 },
    ertiga: { "4h40k": 1500, "8h80k": 2300, "10h100k": 2800, extraKmRate: 14, extraHourRate: 150 },
    innova: { "4h40k": 2200, "8h80k": 3200, "10h100k": 3900, extraKmRate: 18, extraHourRate: 200 }
  });

  useEffect(() => {
    if (hourlyRentalPricing?.defaultRates) {
      setHourlyRates({
        dzire: {
          "4h40k": hourlyRentalPricing.defaultRates?.dzire?.rates?.['4h40k'] || 1100,
          "8h80k": hourlyRentalPricing.defaultRates?.dzire?.rates?.['8h80k'] || 1600,
          "10h100k": hourlyRentalPricing.defaultRates?.dzire?.rates?.['10h100k'] || 2000,
          extraKmRate: hourlyRentalPricing.defaultRates?.dzire?.extraKmRate || 11,
          extraHourRate: hourlyRentalPricing.defaultRates?.dzire?.extraHourRate || 100
        },
        ertiga: {
          "4h40k": hourlyRentalPricing.defaultRates?.ertiga?.rates?.['4h40k'] || 1500,
          "8h80k": hourlyRentalPricing.defaultRates?.ertiga?.rates?.['8h80k'] || 2300,
          "10h100k": hourlyRentalPricing.defaultRates?.ertiga?.rates?.['10h100k'] || 2800,
          extraKmRate: hourlyRentalPricing.defaultRates?.ertiga?.extraKmRate || 14,
          extraHourRate: hourlyRentalPricing.defaultRates?.ertiga?.extraHourRate || 150
        },
        innova: {
          "4h40k": hourlyRentalPricing.defaultRates?.innova?.rates?.['4h40k'] || 2200,
          "8h80k": hourlyRentalPricing.defaultRates?.innova?.rates?.['8h80k'] || 3200,
          "10h100k": hourlyRentalPricing.defaultRates?.innova?.rates?.['10h100k'] || 3900,
          extraKmRate: hourlyRentalPricing.defaultRates?.innova?.extraKmRate || 18,
          extraHourRate: hourlyRentalPricing.defaultRates?.innova?.extraHourRate || 200
        }
      });
    }
  }, [hourlyRentalPricing]);

  // --- 3. AIRPORT BASE RATES STATE ---
  const [airportPrices, setAirportPrices] = useState({
    dzire: 2499,
    verna: 2999,
    ertiga: 3499,
    innova: 3999,
    fortuner: 5999,
    tempo: 4999
  });

  useEffect(() => {
    if (fleet && fleet.length > 0) {
      const ap = {};
      fleet.forEach(car => {
        ap[car.id] = Number(car.airportBasePrice) || Number(car.airportFixedRate) || 2499;
      });
      setAirportPrices(prev => ({ ...prev, ...ap }));
    }
  }, [fleet]);

  // --- 4. CHARGES & POLICIES STATE ---
  const [charges, setCharges] = useState({
    driverAllowance: 300,
    nightChargesAmount: 250,
    nightChargeStartHour: 23,
    nightChargeEndHour: 5,
    roundTripMultipliers: {
      plain: 1.7,
      mixed: 1.8,
      hill: 1.9,
      belowKm: 2.0
    },
    roundTripBelowKmThreshold: 82,
    termsAndConditions: 'All rates include Fuel & Driver. Tolls and state taxes at actuals.'
  });

  useEffect(() => {
    if (pricingSettings) {
      setCharges({
        driverAllowance: pricingSettings.driverAllowance ?? 300,
        nightChargesAmount: pricingSettings.nightChargesAmount ?? 250,
        nightChargeStartHour: pricingSettings.nightChargeStartHour ?? 23,
        nightChargeEndHour: pricingSettings.nightChargeEndHour ?? 5,
        roundTripMultipliers: pricingSettings.roundTripMultipliers || {
          plain: 1.7,
          mixed: 1.8,
          hill: 1.9,
          belowKm: 2.0
        },
        roundTripBelowKmThreshold: Number(pricingSettings.roundTripBelowKmThreshold) || 82,
        termsAndConditions: pricingSettings.termsAndConditions || 'All rates include Fuel & Driver. Tolls and state taxes at actuals.'
      });
    }
  }, [pricingSettings]);

  // --- ROUTE ACTIONS ---
  const handleOpenAddRoute = () => {
    setEditingRouteId(null);
    setRouteForm({
      pickup: '',
      destination: '',
      distanceKm: '',
      routeType: 'PLAIN',
      vehiclePrices: {
        dzire: 4000,
        verna: 4500,
        ertiga: 5000,
        innova: 6500,
        fortuner: 9500,
        tempo: 8500
      },
      roundTripPrices: {
        dzire: '',
        verna: '',
        ertiga: '',
        innova: '',
        fortuner: '',
        tempo: ''
      }
    });
    setIsAddingOrEditing(true);
  };

  const handleEditRoute = (route) => {
    setEditingRouteId(route.id);
    setRouteForm({
      pickup: route.pickup || '',
      destination: route.destination || '',
      distanceKm: route.distanceKm || '',
      routeType: route.routeType || 'PLAIN',
      vehiclePrices: {
        dzire: route.vehiclePrices?.dzire || 4000,
        verna: route.vehiclePrices?.verna || 4500,
        ertiga: route.vehiclePrices?.ertiga || 5000,
        innova: route.vehiclePrices?.innova || 6500,
        fortuner: route.vehiclePrices?.fortuner || 9500,
        tempo: route.vehiclePrices?.tempo || 8500
      },
      roundTripPrices: {
        dzire: route.roundTripPrices?.dzire !== undefined ? route.roundTripPrices.dzire : '',
        verna: route.roundTripPrices?.verna !== undefined ? route.roundTripPrices.verna : '',
        ertiga: route.roundTripPrices?.ertiga !== undefined ? route.roundTripPrices.ertiga : '',
        innova: route.roundTripPrices?.innova !== undefined ? route.roundTripPrices.innova : '',
        fortuner: route.roundTripPrices?.fortuner !== undefined ? route.roundTripPrices.fortuner : '',
        tempo: route.roundTripPrices?.tempo !== undefined ? route.roundTripPrices.tempo : ''
      }
    });
    setIsAddingOrEditing(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!routeForm.pickup.trim() || !routeForm.destination.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter both From Location and To Location.' });
      return;
    }

    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        pickup: routeForm.pickup.trim(),
        destination: routeForm.destination.trim(),
        routeType: routeForm.routeType || 'PLAIN',
        pricingType: 'fixed',
        distanceKm: routeForm.distanceKm ? Number(routeForm.distanceKm) : null,
        active: true,
        vehiclePrices: {
          dzire: Number(routeForm.vehiclePrices.dzire) || 0,
          verna: Number(routeForm.vehiclePrices.verna) || 0,
          ertiga: Number(routeForm.vehiclePrices.ertiga) || 0,
          innova: Number(routeForm.vehiclePrices.innova) || 0,
          fortuner: Number(routeForm.vehiclePrices.fortuner) || 0,
          tempo: Number(routeForm.vehiclePrices.tempo) || 0
        },
        roundTripPrices: {
          dzire: routeForm.roundTripPrices?.dzire ? Number(routeForm.roundTripPrices.dzire) : 0,
          verna: routeForm.roundTripPrices?.verna ? Number(routeForm.roundTripPrices.verna) : 0,
          ertiga: routeForm.roundTripPrices?.ertiga ? Number(routeForm.roundTripPrices.ertiga) : 0,
          innova: routeForm.roundTripPrices?.innova ? Number(routeForm.roundTripPrices.innova) : 0,
          fortuner: routeForm.roundTripPrices?.fortuner ? Number(routeForm.roundTripPrices.fortuner) : 0,
          tempo: routeForm.roundTripPrices?.tempo ? Number(routeForm.roundTripPrices.tempo) : 0
        }
      };

      if (editingRouteId) {
        await updatePricingRoute(editingRouteId, payload);
        setStatusMsg({ type: 'success', text: `Route "${payload.pickup} → ${payload.destination}" updated successfully!` });
      } else {
        await addPricingRoute(payload);
        setStatusMsg({ type: 'success', text: `New route "${payload.pickup} → ${payload.destination}" added successfully!` });
      }

      setIsAddingOrEditing(false);
      setEditingRouteId(null);
      await loadRoutes();
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save route.' });
    } finally {
      setIsSaving(false);
    }
  };

  // View filter for routes table: 'both' | 'oneway' | 'roundtrip'
  const [priceViewMode, setPriceViewMode] = useState('both');

  const handleDeleteRoute = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the route "${name}"?`)) return;
    try {
      await deletePricingRoute(id);
      await loadRoutes();
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Route deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete route.' });
    }
  };

  // --- SAVE HOURLY RENTALS ---
  const handleSaveHourly = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const currentHourly = hourlyRentalPricing || {};
      const updatedHourlyPayload = {
        ...currentHourly,
        defaultRates: {
          ...currentHourly.defaultRates,
          dzire: {
            ...(currentHourly.defaultRates?.dzire || {}),
            name: "Dzire / similar",
            rates: {
              "4h40k": Number(hourlyRates.dzire["4h40k"]) || 1100,
              "8h80k": Number(hourlyRates.dzire["8h80k"]) || 1600,
              "10h100k": Number(hourlyRates.dzire["10h100k"]) || 2000
            },
            extraKmRate: Number(hourlyRates.dzire.extraKmRate) || 11,
            extraHourRate: Number(hourlyRates.dzire.extraHourRate) || 100
          },
          ertiga: {
            ...(currentHourly.defaultRates?.ertiga || {}),
            name: "Ertiga / similar",
            rates: {
              "4h40k": Number(hourlyRates.ertiga["4h40k"]) || 1500,
              "8h80k": Number(hourlyRates.ertiga["8h80k"]) || 2300,
              "10h100k": Number(hourlyRates.ertiga["10h100k"]) || 2800
            },
            extraKmRate: Number(hourlyRates.ertiga.extraKmRate) || 14,
            extraHourRate: Number(hourlyRates.ertiga.extraHourRate) || 150
          },
          innova: {
            ...(currentHourly.defaultRates?.innova || {}),
            name: "Innova Crysta",
            rates: {
              "4h40k": Number(hourlyRates.innova["4h40k"]) || 2200,
              "8h80k": Number(hourlyRates.innova["8h80k"]) || 3200,
              "10h100k": Number(hourlyRates.innova["10h100k"]) || 3900
            },
            extraKmRate: Number(hourlyRates.innova.extraKmRate) || 18,
            extraHourRate: Number(hourlyRates.innova.extraHourRate) || 200
          }
        }
      };

      await updateHourlyRentalPricing(updatedHourlyPayload);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Hourly Rental package rates saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save hourly pricing.' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE AIRPORT BASE PRICES ---
  const handleSaveAirport = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const updatedFleet = (fleet || []).map(car => ({
        ...car,
        airportBasePrice: Number(airportPrices[car.id]) || Number(car.airportBasePrice) || 2499,
        airportFixedRate: Number(airportPrices[car.id]) || Number(car.airportFixedRate) || 2499
      }));

      await updateAllVehiclePricing(updatedFleet);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Airport base rates saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save airport pricing.' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE CHARGES ---
  const handleSaveCharges = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      await updatePricingSettings({
        ...pricingSettings,
        driverAllowance: Number(charges.driverAllowance) || 300,
        nightChargesAmount: Number(charges.nightChargesAmount) || 250,
        nightChargeStartHour: Number(charges.nightChargeStartHour) || 23,
        nightChargeEndHour: Number(charges.nightChargeEndHour) || 5,
        roundTripMultipliers: {
          plain: Number(charges.roundTripMultipliers?.plain) || 1.7,
          mixed: Number(charges.roundTripMultipliers?.mixed) || 1.8,
          hill: Number(charges.roundTripMultipliers?.hill) || 1.9,
          belowKm: Number(charges.roundTripMultipliers?.belowKm) || 2.0
        },
        roundTripBelowKmThreshold: Number(charges.roundTripBelowKmThreshold) || 82,
        termsAndConditions: charges.termsAndConditions
      });
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Pricing policies and round-trip multipliers saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save surcharges.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter routes for search
  const filteredRoutes = routesList.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      r.pickup?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-yellow-600" />
            <span>Fixed Route & Package Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
            Pricing & Routes Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Easily set location-to-location prices, hourly rentals, airport base rates, and driver allowances.
          </p>
        </div>
      </div>

      {/* Status Feedback Message */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 animate-fadeIn ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Clean 4 Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => { setActiveTab('routes'); setIsAddingOrEditing(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'routes' ? 'bg-slate-900 text-yellow-400 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Location to Location Prices ({routesList.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('hourly'); setIsAddingOrEditing(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'hourly' ? 'bg-slate-900 text-yellow-400 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Hourly Rental Packages</span>
        </button>

        <button
          onClick={() => { setActiveTab('airport'); setIsAddingOrEditing(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'airport' ? 'bg-slate-900 text-yellow-400 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Airport Base Tariffs</span>
        </button>

        <button
          onClick={() => { setActiveTab('charges'); setIsAddingOrEditing(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'charges' ? 'bg-slate-900 text-yellow-400 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Driver Allowance & Surcharges</span>
        </button>
      </div>

      {/* SUBTAB 1: LOCATION TO LOCATION ROUTES */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          
          {/* Action Top Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search From or To location (e.g. Delhi, Shimla, Manali)..."
                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-yellow-400 focus:bg-white"
              />
            </div>

            {/* Price View Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
              <button
                type="button"
                onClick={() => setPriceViewMode('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priceViewMode === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                All Rates
              </button>
              <button
                type="button"
                onClick={() => setPriceViewMode('oneway')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priceViewMode === 'oneway' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                One-Way Only
              </button>
              <button
                type="button"
                onClick={() => setPriceViewMode('roundtrip')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priceViewMode === 'roundtrip' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                Round-Trip Only
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm('Apply official Round Trip Multipliers (Plane 1.7×, Mixed 1.8×, Hill 1.9×, <82km 2.0×) to ALL routes?')) return;
                  setIsSaving(true);
                  setStatusMsg({ type: '', text: '' });
                  try {
                    const res = await bulkApplyRoundTripRates();
                    setStatusMsg({ type: 'success', text: res.message || 'Updated all routes with round-trip rates!' });
                    await loadRoutes();
                    await refreshSiteData();
                  } catch (err) {
                    setStatusMsg({ type: 'error', text: err.message || 'Failed to apply round trip rates.' });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                title="Recalculate RT rates for all routes according to configured multipliers"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isSaving ? 'animate-spin' : ''}`} />
                <span>Bulk Recalculate RT</span>
              </button>

              <button
                onClick={handleOpenAddRoute}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Route Price</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Route Modal Overlay */}
          {isAddingOrEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-yellow-400 shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp text-left relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 sticky -top-6 sm:-top-8 bg-white/95 backdrop-blur-xs z-10 pt-2">
                  <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-nexa text-slate-900">
                    {editingRouteId ? 'Edit Location to Location Route' : 'Add New Location to Location Route'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => { setIsAddingOrEditing(false); setEditingRouteId(null); }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRoute} className="space-y-6">
                
                {/* From, To, Distance and Terrain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      From Location (Pickup) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={routeForm.pickup}
                      onChange={(e) => setRouteForm({ ...routeForm, pickup: e.target.value })}
                      placeholder="e.g. Jalandhar"
                      required
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      To Location (Destination) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={routeForm.destination}
                      onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                      placeholder="e.g. Delhi Airport"
                      required
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Distance (in KMs)
                    </label>
                    <input
                      type="number"
                      value={routeForm.distanceKm}
                      onChange={(e) => setRouteForm({ ...routeForm, distanceKm: e.target.value })}
                      placeholder="e.g. 385"
                      min="1"
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Route Terrain / Type
                    </label>
                    <select
                      value={routeForm.routeType || 'PLAIN'}
                      onChange={(e) => setRouteForm({ ...routeForm, routeType: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white"
                    >
                      <option value="PLAIN">PLAIN TERRAIN (1.7× RT)</option>
                      <option value="MIXED">MIXED TERRAIN (1.8× RT)</option>
                      <option value="HILL">HILL TERRAIN (1.9× RT)</option>
                      <option value="AIRPORT">AIRPORT CORRIDOR</option>
                    </select>
                  </div>
                </div>

                {/* Prices for Each Vehicle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Set Fixed Prices (₹) for this Route:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    
                    {/* Dzire */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Dzire / Sedan</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.dzire}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, dzire: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Ertiga */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Ertiga (6S)</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.ertiga}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, ertiga: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Innova Crysta */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Innova Crysta</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.innova}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, innova: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Verna */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Verna (Sedan)</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.verna}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, verna: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Fortuner */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Fortuner (SUV)</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.fortuner}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, fortuner: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Tempo Traveller */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">Tempo Traveller</span>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={routeForm.vehiclePrices.tempo}
                          onChange={(e) => setRouteForm({
                            ...routeForm,
                            vehiclePrices: { ...routeForm.vehiclePrices, tempo: e.target.value }
                          })}
                          className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Round Trip Prices for Each Vehicle (Optional Return Fixed Fare) */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Round-Trip Return Rates (₹)
                      </label>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Optional fixed return fare. If left empty, calculated via vehicle round-trip rate per KM.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const dist = Number(routeForm.distanceKm) || 0;
                        const type = (routeForm.routeType || 'PLAIN').toUpperCase();
                        let mult = 1.7;
                        if (dist > 0 && dist < (Number(charges.roundTripBelowKmThreshold) || 82)) {
                          mult = Number(charges.roundTripMultipliers?.belowKm) || 2.0;
                        } else if (type === 'HILL') {
                          mult = Number(charges.roundTripMultipliers?.hill) || 1.9;
                        } else if (type === 'MIXED') {
                          mult = Number(charges.roundTripMultipliers?.mixed) || 1.8;
                        } else {
                          mult = Number(charges.roundTripMultipliers?.plain) || 1.7;
                        }

                        const vp = routeForm.vehiclePrices || {};
                        setRouteForm(prev => ({
                          ...prev,
                          roundTripPrices: {
                            dzire: vp.dzire ? Math.round(Number(vp.dzire) * mult) : '',
                            verna: vp.verna ? Math.round(Number(vp.verna) * mult) : '',
                            ertiga: vp.ertiga ? Math.round(Number(vp.ertiga) * mult) : '',
                            innova: vp.innova ? Math.round(Number(vp.innova) * mult) : '',
                            fortuner: vp.fortuner ? Math.round(Number(vp.fortuner) * mult) : '',
                            tempo: vp.tempo ? Math.round(Number(vp.tempo) * mult) : ''
                          }
                        }));
                      }}
                      className="text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors self-start sm:self-auto shadow-xs"
                    >
                      ⚡ Auto Calculate RT ({
                        (Number(routeForm.distanceKm) > 0 && Number(routeForm.distanceKm) < (Number(charges.roundTripBelowKmThreshold) || 82))
                          ? '2.0× (<82 KM)'
                          : (routeForm.routeType === 'HILL')
                          ? '1.9× (Hill)'
                          : (routeForm.routeType === 'MIXED')
                          ? '1.8× (Mixed)'
                          : '1.7× (Plane)'
                      })
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { id: 'dzire', label: 'Dzire RT' },
                      { id: 'ertiga', label: 'Ertiga RT' },
                      { id: 'innova', label: 'Innova RT' },
                      { id: 'verna', label: 'Verna RT' },
                      { id: 'fortuner', label: 'Fortuner RT' },
                      { id: 'tempo', label: 'Tempo RT' }
                    ].map(v => (
                      <div key={v.id} className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/70">
                        <span className="text-[10px] font-black uppercase text-amber-900 block">{v.label}</span>
                        <div className="relative mt-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={routeForm.roundTripPrices?.[v.id] || ''}
                            onChange={(e) => setRouteForm({
                              ...routeForm,
                              roundTripPrices: { ...routeForm.roundTripPrices, [v.id]: e.target.value }
                            })}
                            placeholder="Optional"
                            className="w-full bg-white border border-amber-300 pl-6 pr-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddingOrEditing(false); setEditingRouteId(null); }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : editingRouteId ? 'Update Route Price' : 'Save Route Price'}</span>
                  </button>
                </div>

              </form>
              </div>
            </div>
          )}

          {/* Routes List Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/90 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">From Location</th>
                    <th className="py-3.5 px-4">To Location</th>
                    <th className="py-3.5 px-3">Distance</th>
                    <th className="py-3.5 px-3">Terrain</th>
                    <th className="py-3.5 px-3">Dzire {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-3">Ertiga {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-3">Innova Crysta {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-3">Verna {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-3">Fortuner {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-3">Tempo {priceViewMode === 'roundtrip' ? '(RT)' : priceViewMode === 'oneway' ? '(OW)' : ''}</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRoutes.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-8 text-center text-gray-400 font-medium">
                        No routes found matching "{searchTerm}". Click "+ Add Route Price" above.
                      </td>
                    </tr>
                  ) : (
                    filteredRoutes.map((r) => {
                      const renderCell = (vKey) => {
                        const ow = r.vehiclePrices?.[vKey];
                        const rt = r.roundTripPrices?.[vKey];

                        if (priceViewMode === 'oneway') {
                          return (
                            <span className="font-semibold text-slate-800">
                              {ow ? `₹${ow}` : '—'}
                            </span>
                          );
                        }

                        if (priceViewMode === 'roundtrip') {
                          return (
                            <span className={`font-bold ${rt > 0 ? 'text-amber-800' : 'text-gray-400'}`}>
                              {rt > 0 ? `₹${rt}` : '—'}
                            </span>
                          );
                        }

                        // 'both' mode
                        return (
                          <div>
                            <div className="font-semibold text-slate-800">{ow ? `₹${ow}` : '—'}</div>
                            {rt > 0 ? (
                              <span className="text-[10px] text-amber-700 font-bold block">
                                RT ₹{rt}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium block">
                                RT: Not set
                              </span>
                            )}
                          </div>
                        );
                      };

                      return (
                        <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {r.pickup}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {r.destination}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                            {r.distanceKm ? `${r.distanceKm} KM` : '—'}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              r.routeType === 'HILL' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : r.routeType === 'MIXED'
                                ? 'bg-purple-100 text-purple-800'
                                : r.routeType === 'AIRPORT'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {r.routeType || 'PLAIN'}
                            </span>
                          </td>
                          <td className="py-3 px-3">{renderCell('dzire')}</td>
                          <td className="py-3 px-3">{renderCell('ertiga')}</td>
                          <td className="py-3 px-3">{renderCell('innova')}</td>
                          <td className="py-3 px-3">{renderCell('verna')}</td>
                          <td className="py-3 px-3">{renderCell('fortuner')}</td>
                          <td className="py-3 px-3">{renderCell('tempo')}</td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleEditRoute(r)}
                            className="p-1.5 bg-gray-100 hover:bg-yellow-400 text-slate-800 hover:text-slate-950 rounded-lg transition-colors"
                            title="Edit Route Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteRoute(r.id, `${r.pickup} → ${r.destination}`)}
                            className="p-1.5 bg-gray-100 hover:bg-rose-500 text-slate-800 hover:text-white rounded-lg transition-colors"
                            title="Delete Route"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: HOURLY RENTAL PACKAGES */}
      {activeTab === 'hourly' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-nexa text-slate-900">
                Hourly Rental Package Rates
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Set fixed package prices for Dzire, Ertiga, and Innova Crysta.
              </p>
            </div>

            <button
              onClick={handleSaveHourly}
              disabled={isSaving}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Hourly Packages'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dzire */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black font-nexa text-slate-900">Dzire / Sedan</h3>
                <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">4 Seater</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">4 Hours / 40 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.dzire["4h40k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, dzire: { ...hourlyRates.dzire, "4h40k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">8 Hours / 80 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.dzire["8h80k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, dzire: { ...hourlyRates.dzire, "8h80k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">10 Hours / 100 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.dzire["10h100k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, dzire: { ...hourlyRates.dzire, "10h100k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Ertiga */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black font-nexa text-slate-900">Ertiga / SUV</h3>
                <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">6 Seater</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">4 Hours / 40 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.ertiga["4h40k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, ertiga: { ...hourlyRates.ertiga, "4h40k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">8 Hours / 80 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.ertiga["8h80k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, ertiga: { ...hourlyRates.ertiga, "8h80k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">10 Hours / 100 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.ertiga["10h100k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, ertiga: { ...hourlyRates.ertiga, "10h100k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Innova Crysta */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black font-nexa text-slate-900">Innova Crysta</h3>
                <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">7 Seater</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">4 Hours / 40 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.innova["4h40k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, innova: { ...hourlyRates.innova, "4h40k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">8 Hours / 80 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.innova["8h80k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, innova: { ...hourlyRates.innova, "8h80k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">10 Hours / 100 KM (₹)</label>
                  <input
                    type="number"
                    value={hourlyRates.innova["10h100k"]}
                    onChange={(e) => setHourlyRates({ ...hourlyRates, innova: { ...hourlyRates.innova, "10h100k": e.target.value } })}
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: AIRPORT BASE TARIFFS */}
      {activeTab === 'airport' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-nexa text-slate-900">
                Airport Base / Flat Rates
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Base starting rates for direct airport terminal pickups.
              </p>
            </div>

            <button
              onClick={handleSaveAirport}
              disabled={isSaving}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Airport Rates'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Object.keys(airportPrices).map((carId) => (
              <div key={carId} className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] font-black text-gray-400 uppercase block">{carId}</span>
                <h4 className="text-xs font-black font-nexa text-slate-900 capitalize mb-2">{carId}</h4>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={airportPrices[carId]}
                    onChange={(e) => setAirportPrices({ ...airportPrices, [carId]: e.target.value })}
                    className="w-full bg-white border border-gray-300 pl-6 pr-2 py-1.5 rounded-xl font-bold text-xs text-slate-900 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DRIVER ALLOWANCE & SURCHARGES */}
      {activeTab === 'charges' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-nexa text-slate-900">
                Driver Allowance & Surcharges
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Driver allowances and night charges.
              </p>
            </div>

            <button
              onClick={handleSaveCharges}
              disabled={isSaving}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Charges'}</span>
            </button>
          </div>

          {/* Round Trip Rates Configuration */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/50">
              <div>
                <h3 className="text-sm font-black font-nexa text-amber-950 flex items-center space-x-2">
                  <span>Round-Trip Fare Multipliers (Admin Configuration)</span>
                </h3>
                <p className="text-[11px] text-amber-900/80 font-medium mt-0.5">
                  Configure multipliers applied to one-way fares: Plane areas (1.7×), Mixed (1.8×), Hill (1.9×), and Below 82 KM (2.0×).
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm('Apply these multipliers to all existing routes right now?')) return;
                  setIsSaving(true);
                  try {
                    await handleSaveCharges();
                    const res = await bulkApplyRoundTripRates();
                    setStatusMsg({ type: 'success', text: res.message || 'All routes recalculated!' });
                    await loadRoutes();
                  } catch (err) {
                    setStatusMsg({ type: 'error', text: err.message });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
                <span>Save & Apply to All Routes</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Plane Areas (× One-Way)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={charges.roundTripMultipliers?.plain || 1.7}
                  onChange={(e) => setCharges({
                    ...charges,
                    roundTripMultipliers: { ...charges.roundTripMultipliers, plain: e.target.value }
                  })}
                  className="w-full bg-white border border-amber-300 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-[10px] text-amber-800 font-medium">Standard National Highway plains</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Mixed Routes (× One-Way)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={charges.roundTripMultipliers?.mixed || 1.8}
                  onChange={(e) => setCharges({
                    ...charges,
                    roundTripMultipliers: { ...charges.roundTripMultipliers, mixed: e.target.value }
                  })}
                  className="w-full bg-white border border-amber-300 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-[10px] text-amber-800 font-medium">e.g. Delhi to Shimla, Kasauli, Manali</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Hill Areas (× One-Way)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={charges.roundTripMultipliers?.hill || 1.9}
                  onChange={(e) => setCharges({
                    ...charges,
                    roundTripMultipliers: { ...charges.roundTripMultipliers, hill: e.target.value }
                  })}
                  className="w-full bg-white border border-amber-300 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-[10px] text-amber-800 font-medium">Pure mountainous hill terrain</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Below 82 KM (× One-Way)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={charges.roundTripMultipliers?.belowKm || 2.0}
                  onChange={(e) => setCharges({
                    ...charges,
                    roundTripMultipliers: { ...charges.roundTripMultipliers, belowKm: e.target.value }
                  })}
                  className="w-full bg-white border border-amber-300 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-[10px] text-amber-800 font-medium">Short distance trips (&lt; 82 KM)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Driver Allowance (₹/Day)</label>
              <input
                type="number"
                value={charges.driverAllowance}
                onChange={(e) => setCharges({ ...charges, driverAllowance: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900"
              />
            </div> */}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Night Charge (₹)</label>
              <input
                type="number"
                value={charges.nightChargesAmount}
                onChange={(e) => setCharges({ ...charges, nightChargesAmount: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Night Start Hour (24h)</label>
              <input
                type="number"
                value={charges.nightChargeStartHour}
                onChange={(e) => setCharges({ ...charges, nightChargeStartHour: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Night End Hour (24h)</label>
              <input
                type="number"
                value={charges.nightChargeEndHour}
                onChange={(e) => setCharges({ ...charges, nightChargeEndHour: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Pricing Policy Note</label>
            <input
              type="text"
              value={charges.termsAndConditions}
              onChange={(e) => setCharges({ ...charges, termsAndConditions: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-semibold text-slate-900"
            />
          </div>
        </div>
      )}

    </div>
  );
}