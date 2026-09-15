import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Upload, Clock, CheckCircle2, AlertCircle, X, Tag } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addPackage, updatePackage, deletePackage, uploadMediaFile } from '../../../services/api';

export default function PackagesTab() {
  const { packages, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [newHighlightText, setNewHighlightText] = useState('');

  const initialFormState = {
    id: '',
    title: '',
    category: 'Himachal Tours',
    duration: '3 Nights / 4 Days',
    highlights: [],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    altText: '',
    description: '',
    badge: 'Popular Tour'
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = ['Himachal Tours', 'Punjab Tours', 'Airport Transfer', 'One Way Taxi', 'Outstation Rides', 'Custom Tour'];

  const openAddModal = () => {
    setEditingPkg(null);
    setFormData({
      ...initialFormState,
      id: `pkg-${Date.now()}`
    });
    setNewHighlightText('');
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPkg(pkg);
    setFormData({ ...pkg, highlights: pkg.highlights || [] });
    setNewHighlightText('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, image: url }));
      setStatusMsg({ type: 'success', text: 'Package photo uploaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const addHighlight = () => {
    if (!newHighlightText.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlightText.trim()]
    }));
    setNewHighlightText('');
  };

  const removeHighlight = (idx) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSaving(true);
      if (editingPkg) {
        await updatePackage(editingPkg.id, formData);
        setStatusMsg({ type: 'success', text: `Package "${formData.title}" updated successfully!` });
      } else {
        await addPackage(formData);
        setStatusMsg({ type: 'success', text: `New package "${formData.title}" created!` });
      }

      setModalOpen(false);
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save package' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete tour package "${title}"?`)) return;

    try {
      await deletePackage(id);
      setStatusMsg({ type: 'success', text: `Package "${title}" removed.` });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete package' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Package className="w-3.5 h-3.5 text-yellow-600" />
            <span>Tour Packages & Itineraries</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Tour Packages & Hill Trips</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Add new holiday itineraries, edit tour highlights, photos, and WhatsApp inquiry options.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Tour Package</span>
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image */}
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-yellow text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  {pkg.badge || 'Featured'}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-yellow-300 font-bold text-xs px-2.5 py-1 rounded-full flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {pkg.duration}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  {pkg.category}
                </span>
                <h3 className="text-base font-bold font-nexa text-slate-900 leading-snug">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {pkg.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Highlights ({pkg.highlights?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pkg.highlights?.slice(0, 3).map((h, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {h}
                      </span>
                    ))}
                    {(pkg.highlights?.length || 0) > 3 && (
                      <span className="text-[10px] text-gray-400 font-bold self-center">
                        +{pkg.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex items-center space-x-2">
              <button
                onClick={() => openEditModal(pkg)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Package</span>
              </button>
              <button
                onClick={() => handleDelete(pkg.id, pkg.title)}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                title="Delete Package"
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
                {editingPkg ? `Edit Package: ${editingPkg.title}` : 'Create New Tour Package'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tour Package Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Delhi Airport to Chandigarh, Shimla, Manali & Kasol"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 4 Nights / 5 Days"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Top Bestseller"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tour Photo (Upload or Enter URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <label className="w-full sm:w-auto yellow-gradient-btn px-4 py-3 rounded-xl text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
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
                  <div className="mt-2 h-24 w-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Highlights Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tour Highlights
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlightText}
                    onChange={(e) => setNewHighlightText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                    placeholder="e.g. Solang Valley & Atal Tunnel Visit (Press Enter)"
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="bg-slate-900 text-yellow-400 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {formData.highlights.map((h, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1">
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.highlights.length === 0 && (
                    <span className="text-xs text-gray-400">No highlights added yet.</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Direct pickup from Delhi IGI Airport to Chandigarh and scenic Himachal hill stations..."
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
                  {isSaving ? 'Saving...' : editingPkg ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
