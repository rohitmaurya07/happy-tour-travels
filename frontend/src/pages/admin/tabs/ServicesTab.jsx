import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, 
  ArrowUpRight, Plane, Navigation, Car, Mountain, Clock, 
  Upload, Eye, EyeOff, Sparkles, Check, Save, Zap
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addService, updateService, deleteService, uploadMediaFile, updateHourlyRentalPricing } from '../../../services/api';

export default function ServicesTab({ setActiveTab, onNavigateToHourly }) {
  const { services, hourlyRentalPricing, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Hourly Rental Modal & Form State
  const [hourlyModalOpen, setHourlyModalOpen] = useState(false);
  const [isSavingHourly, setIsSavingHourly] = useState(false);
  const [hourlyRatesForm, setHourlyRatesForm] = useState({
    dzire: { "4h40k": 1100, "8h80k": 1600, "10h100k": 2000, extraKmRate: 11, extraHourRate: 100 },
    ertiga: { "4h40k": 1500, "8h80k": 2300, "10h100k": 2800, extraKmRate: 14, extraHourRate: 150 },
    innova: { "4h40k": 2200, "8h80k": 3200, "10h100k": 3900, extraKmRate: 18, extraHourRate: 200 }
  });

  useEffect(() => {
    if (hourlyRentalPricing?.defaultRates) {
      setHourlyRatesForm({
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

  const handleSaveHourlyRates = async (e) => {
    e.preventDefault();
    setIsSavingHourly(true);
    try {
      const currentHourly = hourlyRentalPricing || {};
      const updatedPayload = {
        ...currentHourly,
        defaultRates: {
          ...currentHourly.defaultRates,
          dzire: {
            ...(currentHourly.defaultRates?.dzire || {}),
            name: "Dzire / similar",
            rates: {
              "4h40k": Number(hourlyRatesForm.dzire["4h40k"]) || 1100,
              "8h80k": Number(hourlyRatesForm.dzire["8h80k"]) || 1600,
              "10h100k": Number(hourlyRatesForm.dzire["10h100k"]) || 2000
            },
            extraKmRate: Number(hourlyRatesForm.dzire.extraKmRate) || 11,
            extraHourRate: Number(hourlyRatesForm.dzire.extraHourRate) || 100
          },
          ertiga: {
            ...(currentHourly.defaultRates?.ertiga || {}),
            name: "Ertiga / similar",
            rates: {
              "4h40k": Number(hourlyRatesForm.ertiga["4h40k"]) || 1500,
              "8h80k": Number(hourlyRatesForm.ertiga["8h80k"]) || 2300,
              "10h100k": Number(hourlyRatesForm.ertiga["10h100k"]) || 2800
            },
            extraKmRate: Number(hourlyRatesForm.ertiga.extraKmRate) || 14,
            extraHourRate: Number(hourlyRatesForm.ertiga.extraHourRate) || 150
          },
          innova: {
            ...(currentHourly.defaultRates?.innova || {}),
            name: "Innova Crysta",
            rates: {
              "4h40k": Number(hourlyRatesForm.innova["4h40k"]) || 2200,
              "8h80k": Number(hourlyRatesForm.innova["8h80k"]) || 3200,
              "10h100k": Number(hourlyRatesForm.innova["10h100k"]) || 3900
            },
            extraKmRate: Number(hourlyRatesForm.innova.extraKmRate) || 18,
            extraHourRate: Number(hourlyRatesForm.innova.extraHourRate) || 200
          }
        }
      };

      await updateHourlyRentalPricing(updatedPayload);
      await refreshSiteData();
      setHourlyModalOpen(false);
      setStatusMsg({ type: 'success', text: 'City Hourly Taxi Rental Rates updated successfully! The new rates are now live on your Services page.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update hourly rental rates.' });
    } finally {
      setIsSavingHourly(false);
    }
  };

  // Feature input state
  const [newFeatureText, setNewFeatureText] = useState('');
  // Connection input state
  const [newConnFrom, setNewConnFrom] = useState('');
  const [newConnTo, setNewConnTo] = useState('');

  const initialFormState = {
    id: '',
    title: '',
    tagline: 'PUNJAB • DELHI • HARYANA',
    badge: 'POPULAR SERVICE',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    iconName: 'Car',
    description: '',
    features: [
      'Doorstep Pickup across All Punjab, Haryana & Delhi',
      'No Return Fare charged on Outstation Trips',
      'Transparent All-Inclusive Pricing',
      'Dzire, Ertiga, Innova Crysta & Tempo'
    ],
    popularConnections: [
      { from: 'Punjab', to: 'Delhi' },
      { from: 'Jalandhar', to: 'Chandigarh' }
    ],
    searchType: 'One Way',
    defaultMessage: 'Hello Happy Tour & Travels, I want to inquire about this taxi service. Please share details.',
    active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const iconOptions = [
    { id: 'Plane', label: 'Plane (Airport Transfers)' },
    { id: 'Navigation', label: 'Navigation (One-Way Cabs)' },
    { id: 'Mountain', label: 'Mountain (Himachal Tours)' },
    { id: 'Clock', label: 'Clock (Hourly Rentals)' },
    { id: 'Car', label: 'Car (General / Outstation)' }
  ];

  const searchTypeOptions = [
    'One Way',
    'Round Trip',
    'Airport',
    'Hourly Rental'
  ];

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Plane': return <Plane className="w-5 h-5 text-amber-500" />;
      case 'Navigation': return <Navigation className="w-5 h-5 text-amber-500" />;
      case 'Mountain': return <Mountain className="w-5 h-5 text-amber-500" />;
      case 'Clock': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Car': return <Car className="w-5 h-5 text-amber-500" />;
      default: return <Car className="w-5 h-5 text-amber-500" />;
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      ...initialFormState,
      id: `service-${Date.now()}`
    });
    setNewFeatureText('');
    setNewConnFrom('');
    setNewConnTo('');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      title: service.title || '',
      tagline: service.tagline || '',
      badge: service.badge || 'Service',
      image: service.image || '',
      iconName: service.iconName || 'Car',
      description: service.description || '',
      features: Array.isArray(service.features) ? service.features : [],
      popularConnections: Array.isArray(service.popularConnections) ? service.popularConnections : [],
      searchType: service.searchType || 'One Way',
      defaultMessage: service.defaultMessage || '',
      active: service.active !== false
    });
    setNewFeatureText('');
    setNewConnFrom('');
    setNewConnTo('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, image: url }));
      setStatusMsg({ type: 'success', text: 'Service image uploaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const addFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const removeFeature = (idx) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const addConnection = () => {
    if (!newConnFrom.trim() || !newConnTo.trim()) return;
    setFormData(prev => ({
      ...prev,
      popularConnections: [
        ...prev.popularConnections,
        { from: newConnFrom.trim(), to: newConnTo.trim() }
      ]
    }));
    setNewConnFrom('');
    setNewConnTo('');
  };

  const removeConnection = (idx) => {
    setFormData(prev => ({
      ...prev,
      popularConnections: prev.popularConnections.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        title: formData.title.trim(),
        tagline: formData.tagline.trim(),
        badge: formData.badge.trim() || 'Service',
        searchType: formData.searchType || 'One Way',
        active: Boolean(formData.active)
      };

      if (editingService) {
        await updateService(editingService.id, payload);
        setStatusMsg({ type: 'success', text: `Service "${payload.title}" updated successfully!` });
      } else {
        await addService(payload);
        setStatusMsg({ type: 'success', text: `New service "${payload.title}" created!` });
      }

      setModalOpen(false);
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save service' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const updated = { ...service, active: service.active === false ? true : false };
      await updateService(service.id, updated);
      setStatusMsg({
        type: 'success',
        text: `Service "${service.title}" is now ${updated.active ? 'visible on website' : 'hidden from website'}.`
      });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update visibility' });
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      await deleteService(id);
      setStatusMsg({ type: 'success', text: `Service "${title}" removed.` });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete service' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Layers className="w-3.5 h-3.5 text-yellow-600" />
            <span>Taxi Services & Travel Solutions</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Travel Services</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure the 4 core service cards: banner images, feature checklists, popular routes, and connected search types.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Service</span>
        </button>
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

      {/* City Hourly Taxi Rental Rates Section Manager (Live on Services Page) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-yellow-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>Services Page Component</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-nexa text-white">
              City Hourly Taxi Rental Rates
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Update the 4-Hour, 8-Hour, and 10-Hour rental packages shown in the <strong className="text-yellow-400">&quot;City Hourly Taxi Rental Rates&quot;</strong> section on your public Services page.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setHourlyModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              <span>Update Hourly Rates</span>
            </button>

            {onNavigateToHourly && (
              <button
                type="button"
                onClick={onNavigateToHourly}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-3 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
                title="Open in Pricing & Charges Tab"
              >
                <span>Pricing Tab</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
              </button>
            )}
          </div>
        </div>

        {/* Live Quick Preview of Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          {/* Dzire */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-nexa font-bold text-sm text-white block">Dzire / Sedan</span>
                <span className="text-[10px] text-gray-400 font-medium">Extra: ₹{hourlyRatesForm.dzire.extraKmRate}/km • ₹{hourlyRatesForm.dzire.extraHourRate}/hr</span>
              </div>
              <span className="text-[10px] bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded">4 Seater</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">4h/40k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.dzire["4h40k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">8h/80k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.dzire["8h80k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">10h/100k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.dzire["10h100k"]}</strong>
              </div>
            </div>
          </div>

          {/* Ertiga */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-nexa font-bold text-sm text-white block">Ertiga / SUV</span>
                <span className="text-[10px] text-gray-400 font-medium">Extra: ₹{hourlyRatesForm.ertiga.extraKmRate}/km • ₹{hourlyRatesForm.ertiga.extraHourRate}/hr</span>
              </div>
              <span className="text-[10px] bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded">6 Seater</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">4h/40k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.ertiga["4h40k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">8h/80k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.ertiga["8h80k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">10h/100k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.ertiga["10h100k"]}</strong>
              </div>
            </div>
          </div>

          {/* Innova */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-nexa font-bold text-sm text-white block">Innova Crysta</span>
                <span className="text-[10px] text-gray-400 font-medium">Extra: ₹{hourlyRatesForm.innova.extraKmRate}/km • ₹{hourlyRatesForm.innova.extraHourRate}/hr</span>
              </div>
              <span className="text-[10px] bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded">7 Seater</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">4h/40k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.innova["4h40k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">8h/80k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.innova["8h80k"]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">10h/100k</span>
                <strong className="text-yellow-400 font-black">₹{hourlyRatesForm.innova["10h100k"]}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(services || []).map((service) => {
          const isActive = service.active !== false;
          return (
            <div
              key={service.id}
              className={`bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
                isActive ? 'border-gray-200/90' : 'border-dashed border-gray-300 opacity-75'
              }`}
            >
              <div>
                {/* Image Banner Header */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-brand-yellow text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {service.badge || 'Featured Service'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(service)}
                      title={isActive ? 'Click to hide from site' : 'Click to show on site'}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md transition-colors ${
                        isActive
                          ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isActive ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Title & Icon on Banner */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-yellow-400 uppercase tracking-wider block">
                        {service.tagline}
                      </span>
                      <h3 className="text-lg font-bold font-nexa text-white leading-tight">
                        {service.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-lg">
                      {getServiceIcon(service.iconName)}
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Service Features:
                      </span>
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Popular Connections */}
                  {Array.isArray(service.popularConnections) && service.popularConnections.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                        Popular Connections:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {service.popularConnections.map((conn, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-[11px] font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/60"
                          >
                            <span>{conn.from}</span>
                            <ArrowUpRight className="w-3 h-3 mx-1 text-amber-600" />
                            <span>{conn.to}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected Search Action */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Connected Search Tab:</span>
                    <span className="font-bold text-slate-900 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {service.searchType || 'One Way'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Service</span>
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-nexa text-slate-900">
                  {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service Card'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customize the card displayed in the Services section and its connected booking options.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Airport Transfer Services"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tagline (Subheader)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. DEL • ATQ • IXC TERMINALS"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.id} value={icon.id}>{icon.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 24/7 AIRPORT PICKUP/DROPS"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Search Tab Action
                  </label>
                  <select
                    value={formData.searchType}
                    onChange={(e) => setFormData({ ...formData, searchType: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  >
                    {searchTypeOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Banner Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Banner Image (URL or Upload Image)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or /assets/images/..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <label className="w-full sm:w-auto yellow-gradient-btn px-4 py-3 rounded-xl text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2 h-24 w-44 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Punctual airport pickup and drop services for domestic and international flights..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
                />
              </div>

              {/* Features Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Key Features (Bullet Points)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="e.g. Luggage Assistance & Live Flight Tracking (Press Enter)"
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-slate-900 text-yellow-400 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {formData.features.map((feat, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.features.length === 0 && (
                    <span className="text-xs text-gray-400">No features added yet.</span>
                  )}
                </div>
              </div>

              {/* Popular Connections Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Popular Connection Routes (From → To Pairs)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    value={newConnFrom}
                    onChange={(e) => setNewConnFrom(e.target.value)}
                    placeholder="From: e.g. Punjab"
                    className="sm:col-span-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <input
                    type="text"
                    value={newConnTo}
                    onChange={(e) => setNewConnTo(e.target.value)}
                    placeholder="To: e.g. Delhi Airport"
                    className="sm:col-span-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={addConnection}
                    className="sm:col-span-1 bg-slate-900 text-yellow-400 font-bold text-xs px-3 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Add Pair
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {formData.popularConnections.map((conn, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                      <span className="font-bold text-amber-700">{conn.from}</span>
                      <ArrowUpRight className="w-3 h-3 text-gray-400" />
                      <span className="font-bold text-slate-900">{conn.to}</span>
                      <button
                        type="button"
                        onClick={() => removeConnection(idx)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.popularConnections.length === 0 && (
                    <span className="text-xs text-gray-400">No popular connections added yet.</span>
                  )}
                </div>
              </div>

              {/* Default WhatsApp Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Default WhatsApp Inquiry Template
                </label>
                <textarea
                  rows="2"
                  value={formData.defaultMessage}
                  onChange={(e) => setFormData({ ...formData, defaultMessage: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="serviceActiveToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-yellow rounded focus:ring-yellow-400"
                />
                <label htmlFor="serviceActiveToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Display this service card as active on the website
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="yellow-gradient-btn px-6 py-3 rounded-xl text-slate-950 font-extrabold text-xs shadow-md"
                >
                  {isSaving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Quick Editing Hourly Rental Rates */}
      {hourlyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-2 border-yellow-400 my-8 max-h-[90vh] overflow-y-auto text-left relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-yellow-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-nexa text-slate-900">
                    Update City Hourly Taxi Rental Rates
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Modifying these rates updates both the Services Page and Hourly Rental booking cards instantly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHourlyModalOpen(false)}
                className="text-gray-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHourlyRates} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Dzire */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-black font-nexa text-slate-900">Dzire / Sedan</h4>
                    <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">4 Seater</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">4 Hours / 40 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.dzire["4h40k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        dzire: { ...hourlyRatesForm.dzire, "4h40k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">8 Hours / 80 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.dzire["8h80k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        dzire: { ...hourlyRatesForm.dzire, "8h80k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">10 Hours / 100 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.dzire["10h100k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        dzire: { ...hourlyRatesForm.dzire, "10h100k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/KM</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.dzire.extraKmRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          dzire: { ...hourlyRatesForm.dzire, extraKmRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/Hour</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.dzire.extraHourRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          dzire: { ...hourlyRatesForm.dzire, extraHourRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Ertiga */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-black font-nexa text-slate-900">Ertiga / SUV</h4>
                    <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">6 Seater</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">4 Hours / 40 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.ertiga["4h40k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        ertiga: { ...hourlyRatesForm.ertiga, "4h40k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">8 Hours / 80 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.ertiga["8h80k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        ertiga: { ...hourlyRatesForm.ertiga, "8h80k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">10 Hours / 100 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.ertiga["10h100k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        ertiga: { ...hourlyRatesForm.ertiga, "10h100k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/KM</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.ertiga.extraKmRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          ertiga: { ...hourlyRatesForm.ertiga, extraKmRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/Hour</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.ertiga.extraHourRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          ertiga: { ...hourlyRatesForm.ertiga, extraHourRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Innova */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h4 className="text-sm font-black font-nexa text-slate-900">Innova Crysta</h4>
                    <span className="text-[10px] bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded">7 Seater</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">4 Hours / 40 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.innova["4h40k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        innova: { ...hourlyRatesForm.innova, "4h40k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">8 Hours / 80 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.innova["8h80k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        innova: { ...hourlyRatesForm.innova, "8h80k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">10 Hours / 100 KM (₹)</label>
                    <input
                      type="number"
                      value={hourlyRatesForm.innova["10h100k"]}
                      onChange={(e) => setHourlyRatesForm({
                        ...hourlyRatesForm,
                        innova: { ...hourlyRatesForm.innova, "10h100k": e.target.value }
                      })}
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/KM</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.innova.extraKmRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          innova: { ...hourlyRatesForm.innova, extraKmRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Extra ₹/Hour</label>
                      <input
                        type="number"
                        value={hourlyRatesForm.innova.extraHourRate}
                        onChange={(e) => setHourlyRatesForm({
                          ...hourlyRatesForm,
                          innova: { ...hourlyRatesForm.innova, extraHourRate: e.target.value }
                        })}
                        className="w-full bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setHourlyModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingHourly}
                  className="yellow-gradient-btn px-6 py-3 rounded-xl text-slate-950 font-extrabold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingHourly ? 'Saving...' : 'Save Hourly Rates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
