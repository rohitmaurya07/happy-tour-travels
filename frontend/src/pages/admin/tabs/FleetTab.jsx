import React, { useState } from 'react';
import { Car, Plus, Edit2, Trash2, Upload, Users, Luggage, Wind, Fuel, X, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addFleetVehicle, updateFleetVehicle, deleteFleetVehicle, uploadMediaFile } from '../../../services/api';

export default function FleetTab() {
  const { fleet, refreshSiteData } = useSiteData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const initialFormState = {
    id: '',
    name: '',
    category: 'Sedan',
    seats: '4 Passengers',
    luggage: '2-3 Bags',
    ac: 'Dual AC',
    fuel: 'Petrol/CNG',
    image: '/assets/images/dzire.jpg',
    altText: '',
    tag: '',
    rank: fleet.length + 1,
    description: '',
    oneWayRate: 12,
    roundTripRate: 14,
    localPackages: { fourHours: 1000, eightHours: 1500 },
    hourlyRate: 1500,
    airportFixedRate: 2499,
    slabs: {
      minKm: 20,
      slab20_35: 900,
      slab35_55: 1100,
      slab55_75: 1300,
      slab75_95: 1500,
      slab95Base: 1700,
      post95Rate: 12
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      ...initialFormState,
      id: 'car-' + Date.now(),
      rank: fleet.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
      localPackages: vehicle.localPackages || { fourHours: 1000, eightHours: 1500 },
      slabs: vehicle.slabs || {
        minKm: 20,
        slab20_35: 900,
        slab35_55: 1100,
        slab55_75: 1300,
        slab75_95: 1500,
        slab95Base: 1700,
        post95Rate: vehicle.oneWayRate || 12
      }
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
      setStatusMsg({ type: 'success', text: 'Vehicle image uploaded successfully!' });
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
        ratesHint: '₹' + (formData.slabs?.slab20_35 || 900) + ' (20-35km) • ₹' + (formData.slabs?.slab95Base || 1700) + ' (95km) • ₹' + (formData.slabs?.post95Rate || formData.oneWayRate) + '/km post 95km',
        hourlyRate: formData.localPackages?.eightHours || 1500
      };

      if (editingVehicle) {
        await updateFleetVehicle(editingVehicle.id, payload);
        setStatusMsg({ type: 'success', text: formData.name + ' updated successfully!' });
      } else {
        await addFleetVehicle(payload);
        setStatusMsg({ type: 'success', text: formData.name + ' added to fleet!' });
      }

      setModalOpen(false);
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Action failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vehicleId, vehicleName) => {
    if (!window.confirm('Are you sure you want to remove ' + vehicleName + ' from the fleet?')) return;

    try {
      await deleteFleetVehicle(vehicleId);
      setStatusMsg({ type: 'success', text: vehicleName + ' removed from fleet' });
      await refreshSiteData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete vehicle' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Car className="w-3.5 h-3.5 text-yellow-600" />
            <span>Fleet Inventory</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Fleet & Rates</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Add new cars, update images, edit specs, distance slabs and pricing packages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
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

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleet.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Image Preview Box */}
              <div className="relative h-48 bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4">
                <span className="absolute top-3 left-3 bg-slate-950 text-yellow-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm z-10">
                  {car.tag || car.category}
                </span>

                <img
                  src={car.image}
                  alt={car.altText || car.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              {/* Vehicle Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold font-nexa text-slate-900 text-lg leading-tight">{car.name}</h3>
                    <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block mt-0.5">
                      {car.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                    Rank #{car.rank || 1}
                  </span>
                </div>

                {/* Specs Chips */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center">
                    <Users className="w-3 h-3 mr-1 text-yellow-600" />
                    {car.seats}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center">
                    <Luggage className="w-3 h-3 mr-1 text-yellow-600" />
                    {car.luggage}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center">
                    <Wind className="w-3 h-3 mr-1 text-blue-500" />
                    {car.ac}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center">
                    <Fuel className="w-3 h-3 mr-1 text-amber-500" />
                    {car.fuel}
                  </span>
                </div>

                {/* Pricing Summary */}
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>95km Base / Extra:</span>
                    <span className="text-amber-700">₹{car.slabs?.slab95Base || 1700} + ₹{car.slabs?.post95Rate || car.oneWayRate}/km</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>20–35 km Slab:</span>
                    <span className="font-bold text-slate-700">₹{car.slabs?.slab20_35 || 900}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Round-Trip:</span>
                    <span className="font-bold text-slate-700">₹{car.roundTripRate}/km</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>8h / 80km Package:</span>
                    <span className="font-bold text-slate-700">₹{car.localPackages?.eightHours || 1500}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 flex items-center space-x-2">
              <button
                onClick={() => openEditModal(car)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-yellow-400 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Vehicle & Slabs</span>
              </button>

              <button
                onClick={() => handleDelete(car.id, car.name)}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold font-nexa text-slate-900">
                  {editingVehicle ? 'Edit Vehicle: ' + editingVehicle.name : 'Add New Fleet Vehicle'}
                </h2>
                <p className="text-xs text-gray-500 font-medium">Update car information, image, distance slabs and packages</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-slate-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload / URL Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Image
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-16 bg-gray-100 rounded-xl p-1 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <img src={formData.image} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/assets/images/car.png"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow"
                    />
                    <label className="inline-flex items-center space-x-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-yellow-200">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Dzire"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Budget Sedan"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Seats</label>
                  <input
                    type="text"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    placeholder="4 Passengers"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Luggage</label>
                  <input
                    type="text"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    placeholder="2-3 Bags"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">AC Type</label>
                  <input
                    type="text"
                    value={formData.ac}
                    onChange={(e) => setFormData({ ...formData, ac: e.target.value })}
                    placeholder="Dual AC"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Fuel</label>
                  <input
                    type="text"
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    placeholder="Diesel/Petrol"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Distance Slabs Form Section */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-yellow-600" />
                  <span>One-Way Distance Slabs & Rates</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">20–35 km Slab (₹)</label>
                    <input
                      type="number"
                      step="50"
                      value={formData.slabs?.slab20_35 || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        slabs: { ...formData.slabs, slab20_35: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">35–55 km Slab (₹)</label>
                    <input
                      type="number"
                      step="50"
                      value={formData.slabs?.slab35_55 || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        slabs: { ...formData.slabs, slab35_55: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">55–75 km Slab (₹)</label>
                    <input
                      type="number"
                      step="50"
                      value={formData.slabs?.slab55_75 || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        slabs: { ...formData.slabs, slab55_75: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">75–95 km Slab (₹)</label>
                    <input
                      type="number"
                      step="50"
                      value={formData.slabs?.slab75_95 || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        slabs: { ...formData.slabs, slab75_95: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">95 km Base (₹)</label>
                    <input
                      type="number"
                      step="50"
                      value={formData.slabs?.slab95Base || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        slabs: { ...formData.slabs, slab95Base: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Above 95 km (₹/km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.slabs?.post95Rate || formData.oneWayRate || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        oneWayRate: Number(e.target.value),
                        slabs: { ...formData.slabs, post95Rate: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-extrabold text-emerald-900"
                    />
                  </div>
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Round-Trip (₹/km)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.roundTripRate}
                    onChange={(e) => setFormData({ ...formData, roundTripRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">4h / 40km (₹)</label>
                  <input
                    type="number"
                    value={formData.localPackages?.fourHours || 1000}
                    onChange={(e) => setFormData({
                      ...formData,
                      localPackages: { ...formData.localPackages, fourHours: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">8h / 80km (₹)</label>
                  <input
                    type="number"
                    value={formData.localPackages?.eightHours || 1500}
                    onChange={(e) => setFormData({
                      ...formData,
                      localPackages: { ...formData.localPackages, eightHours: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tag / Badge & Rank
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. ⭐ Family Choice"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                  <input
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: Number(e.target.value) })}
                    placeholder="Display Rank (1 = Top)"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comfortable 4-seater sedan for outstation and airport rides..."
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
                  {isSaving ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
