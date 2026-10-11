import React, { useState } from 'react';
import { 
  Layers, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, 
  ArrowUpRight, Plane, Navigation, Car, Mountain, Clock, 
  Upload, Eye, EyeOff, Sparkles, Check 
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addService, updateService, deleteService, uploadMediaFile } from '../../../services/api';

export default function ServicesTab() {
  const { services, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

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
    </div>
  );
}
