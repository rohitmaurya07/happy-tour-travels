import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Upload, Clock, CheckCircle2, AlertCircle, X, Search, Eye, EyeOff, MapPin } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addPackage, updatePackage, deletePackage, uploadMediaFile } from '../../../services/api';

export default function PackagesTab() {
  const { packages, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const initialFormState = {
    id: '',
    name: '',
    title: '',
    category: 'Himachal Pradesh',
    duration: '2N / 3D Custom Tour',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80',
    description: '',
    badge: 'Popular Destination',
    active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const regionCategories = [
    'All',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Punjab',
    'Punjab / UT',
    'Uttarakhand',
    'Other'
  ];

  const formCategoryOptions = [
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Punjab',
    'Punjab / UT',
    'Uttarakhand',
    'Golden Triangle',
    'Custom Tour'
  ];

  const openAddModal = () => {
    setEditingPkg(null);
    setFormData({
      ...initialFormState,
      id: `dest-${Date.now()}`
    });
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      id: pkg.id,
      name: pkg.name || pkg.title || '',
      title: pkg.title || pkg.name || '',
      category: pkg.category || 'Himachal Pradesh',
      duration: pkg.duration || 'Custom Tour',
      image: pkg.image || '',
      description: pkg.description || '',
      badge: pkg.badge || 'Popular Tour',
      active: pkg.active !== false
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, image: url }));
      setStatusMsg({ type: 'success', text: 'Destination photo uploaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
        title: formData.title.trim() || `${formData.name.trim()} Tour Package`,
        category: formData.category || 'Himachal Pradesh',
        badge: formData.badge.trim() || 'Featured',
        duration: formData.duration.trim() || 'Custom Tour',
        active: Boolean(formData.active)
      };

      if (editingPkg) {
        await updatePackage(editingPkg.id, payload);
        setStatusMsg({ type: 'success', text: `Destination "${payload.name}" updated successfully!` });
      } else {
        await addPackage(payload);
        setStatusMsg({ type: 'success', text: `Destination "${payload.name}" added to tour packages!` });
      }

      setModalOpen(false);
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save destination package' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (pkg) => {
    try {
      const updated = { ...pkg, active: pkg.active === false ? true : false };
      await updatePackage(pkg.id, updated);
      setStatusMsg({
        type: 'success',
        text: `Destination "${pkg.name || pkg.title}" is now ${updated.active ? 'visible on website' : 'hidden from website'}.`
      });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update visibility' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete destination "${name}"?`)) return;

    try {
      await deletePackage(id);
      setStatusMsg({ type: 'success', text: `Destination "${name}" removed.` });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete package' });
    }
  };

  // Filter packages based on query and category
  const filteredPackages = (packages || []).filter(pkg => {
    const pkgName = (pkg.name || pkg.title || '').toLowerCase();
    const pkgDesc = (pkg.description || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || pkgName.includes(q) || pkgDesc.includes(q);

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Other') {
      return matchesSearch && !['Himachal Pradesh', 'Jammu & Kashmir', 'Punjab', 'Punjab / UT'].includes(pkg.category);
    }
    return matchesSearch && pkg.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Package className="w-3.5 h-3.5 text-yellow-600" />
            <span>Top Destinations & Tour Packages</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage 15+ Top Destinations</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage destination cards, scenic photography, badges, tour durations, and visibility on the live website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Destination</span>
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

      {/* Controls: Search & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination by name or spot..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {regionCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-yellow-400 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packages / Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => {
          const isActive = pkg.active !== false;
          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between group shadow-sm hover:shadow-md ${
                isActive ? 'border-gray-200/90' : 'border-dashed border-gray-300 opacity-75'
              }`}
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name || pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-brand-yellow text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {pkg.badge || 'Top Destination'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(pkg)}
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

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-300 block">
                        {pkg.category || 'North India'}
                      </span>
                      <h3 className="text-lg font-bold font-nexa leading-none drop-shadow-sm">
                        {pkg.name || pkg.title}
                      </h3>
                    </div>
                    {pkg.duration && (
                      <span className="bg-slate-950/80 backdrop-blur-sm text-yellow-300 font-semibold text-[10px] px-2 py-0.5 rounded-md flex items-center">
                        <Clock className="w-2.5 h-2.5 mr-1 text-yellow-400" />
                        {pkg.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {pkg.title || `${pkg.name} Tour`}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {pkg.description || 'Scenic sightseeing, temples, valleys, and outstation pickup.'}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.name || pkg.title)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                  title="Delete Destination"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-gray-500">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-700">No destinations match your search or filter.</p>
          <p className="text-xs text-gray-400 mt-1">Try clearing the search query or select "All" categories.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-nexa text-slate-900">
                  {editingPkg ? `Edit Destination: ${editingPkg.name || editingPkg.title}` : 'Add New Top Destination'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  This card appears in the Top Destinations section and the custom tour inquiry planner.
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
                    Destination Name * (Card Title)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shimla"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tour Package Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Shimla & Kufri Holiday Tour"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State / Region
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  >
                    {formCategoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
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
                    placeholder="e.g. Hill Station, Adventure Hub"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2N / 3D Custom Tour"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              {/* Destination Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination Photo (URL or Upload Image)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /assets/images/..."
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
                  <div className="mt-2 h-28 w-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highlights & Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="The Queen of Hills – Mall Road, Ridge, Kufri & Jakhoo Temple..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="pkgActiveToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-yellow rounded focus:ring-yellow-400"
                />
                <label htmlFor="pkgActiveToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Display this destination as active on the website
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
                  {isSaving ? 'Saving...' : editingPkg ? 'Update Destination' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
