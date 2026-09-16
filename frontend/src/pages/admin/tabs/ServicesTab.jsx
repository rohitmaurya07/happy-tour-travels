import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, ArrowUpRight, Plane, Navigation, Car, Compass } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addService, updateService, deleteService } from '../../../services/api';

export default function ServicesTab() {
  const { services, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [newRouteText, setNewRouteText] = useState('');

  const initialFormState = {
    id: '',
    title: '',
    tagline: 'Punjab • Delhi • Chandigarh',
    description: '',
    iconName: 'Plane',
    popularRoutes: [],
    badge: 'Popular Service',
    defaultMessage: 'Hello Happy Tour & Travels, I want to inquire about this service.'
  };

  const [formData, setFormData] = useState(initialFormState);

  const iconOptions = ['Plane', 'Navigation', 'Car', 'Compass'];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Plane': return <Plane className="w-5 h-5 text-slate-900" />;
      case 'Navigation': return <Navigation className="w-5 h-5 text-slate-900" />;
      case 'Car': return <Car className="w-5 h-5 text-slate-900" />;
      case 'Compass': return <Compass className="w-5 h-5 text-slate-900" />;
      default: return <Car className="w-5 h-5 text-slate-900" />;
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      ...initialFormState,
      id: `service-${Date.now()}`
    });
    setNewRouteText('');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({ ...service, popularRoutes: service.popularRoutes || [] });
    setNewRouteText('');
    setModalOpen(true);
  };

  const addRouteItem = () => {
    if (!newRouteText.trim()) return;
    setFormData(prev => ({
      ...prev,
      popularRoutes: [...prev.popularRoutes, newRouteText.trim()]
    }));
    setNewRouteText('');
  };

  const removeRouteItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      popularRoutes: prev.popularRoutes.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSaving(true);
      if (editingService) {
        await updateService(editingService.id, formData);
        setStatusMsg({ type: 'success', text: `Service "${formData.title}" updated successfully!` });
      } else {
        await addService(formData);
        setStatusMsg({ type: 'success', text: `New service "${formData.title}" added!` });
      }

      setModalOpen(false);
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save service' });
    } finally {
      setIsSaving(false);
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
            <span>Taxi Services & Solutions</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Travel Services</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure featured service cards, popular connection routes, badges, and WhatsApp inquiry templates.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-sm">
                  {getIcon(service.iconName)}
                </div>
                <span className="text-[10px] uppercase font-nexa tracking-wider bg-slate-900 text-yellow-400 px-2.5 py-1 rounded-full">
                  {service.badge || 'Service'}
                </span>
              </div>

              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                {service.tagline}
              </span>
              <h3 className="text-lg font-bold font-nexa text-slate-900 leading-snug mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Routes */}
              <div className="space-y-1 pt-3 border-t border-gray-100 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Popular Connections:
                </span>
                {service.popularRoutes?.map((route, idx) => (
                  <div key={idx} className="flex items-center text-xs font-semibold text-slate-700">
                    <ArrowUpRight className="w-3 h-3 mr-1 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{route}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center space-x-2">
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
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg sm:text-xl font-bold font-nexa text-slate-900">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
              </h3>
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
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Punjab • Delhi • Chandigarh"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <option key={icon} value={icon}>{icon}</option>
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
                    placeholder="e.g. 24/7 Airport Cab"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specialized 24/7 airport pickup and drop services..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
                />
              </div>

              {/* Service Popular Routes Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Routes List
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newRouteText}
                    onChange={(e) => setNewRouteText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRouteItem(); } }}
                    placeholder="e.g. All Punjab → Delhi IGI Airport (DEL) (Press Enter)"
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={addRouteItem}
                    className="bg-slate-900 text-yellow-400 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {formData.popularRoutes.map((r, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1">
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => removeRouteItem(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.popularRoutes.length === 0 && (
                    <span className="text-xs text-gray-400">No routes added yet.</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Default WhatsApp Message Template
                </label>
                <textarea
                  rows="2"
                  value={formData.defaultMessage}
                  onChange={(e) => setFormData({ ...formData, defaultMessage: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
                />
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
