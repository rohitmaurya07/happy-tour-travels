import React, { useState } from 'react';
import { Car, Plus, Edit2, Trash2, Upload, Users, Luggage, Wind, Fuel, X, CheckCircle2, AlertCircle, Mountain, ShieldCheck } from 'lucide-react';
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
    category: 'Budget Sedan',
    seats: '4 Passengers',
    luggage: '2-3 Bags',
    ac: 'Dual AC',
    fuel: 'Petrol/CNG',
    image: '/assets/images/dzire.jpg',
    altText: '',
    tag: '',
    rank: (fleet || []).length + 1,
    description: '',
    minBookingKm: 20,
    slabs: [
      { minKm: 20, maxKm: 35, price: 900 },
      { minKm: 35, maxKm: 55, price: 1100 },
      { minKm: 55, maxKm: 75, price: 1300 },
      { minKm: 75, maxKm: 95, price: 1500 }
    ],
    longDistance: {
      startAfterKm: 95,
      baseFare: 1700,
      additionalKmRate: 12
    },
    oneWayRate: 12,
    roundTripRate: 11,
    packages: {
      fourHours: { price: 1000, includedKm: 40 },
      eightHours: { price: 1500, includedKm: 80 }
    },
    airportBasePrice: 2499,
    plainRatePerKm: 10,
    hillRatePerKm: 12,
    minimumKm: 250,
    extraKmRate: 11,
    driverAllowance: 300,
    active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      ...initialFormState,
      id: 'car-' + Date.now(),
      rank: (fleet || []).length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
      minBookingKm: vehicle.minBookingKm !== undefined ? Number(vehicle.minBookingKm) : 20,
      slabs: Array.isArray(vehicle.slabs) ? vehicle.slabs : [
        { minKm: 20, maxKm: 35, price: 900 },
        { minKm: 35, maxKm: 55, price: 1100 },
        { minKm: 55, maxKm: 75, price: 1300 },
        { minKm: 75, maxKm: 95, price: 1500 }
      ],
      longDistance: vehicle.longDistance || {
        startAfterKm: 95,
        baseFare: 1700,
        additionalKmRate: Number(vehicle.plainRatePerKm) || 12
      },
      packages: vehicle.packages || {
        fourHours: { price: 1000, includedKm: 40 },
        eightHours: { price: 1500, includedKm: 80 }
      },
      airportBasePrice: vehicle.airportBasePrice !== undefined ? Number(vehicle.airportBasePrice) : 2499,
      plainRatePerKm: vehicle.plainRatePerKm !== undefined ? Number(vehicle.plainRatePerKm) : (vehicle.oneWayRate || 10),
      hillRatePerKm: vehicle.hillRatePerKm !== undefined ? Number(vehicle.hillRatePerKm) : (vehicle.roundTripRate || 12),
      minimumKm: vehicle.minimumKm !== undefined ? Number(vehicle.minimumKm) : 250,
      extraKmRate: vehicle.extraKmRate !== undefined ? Number(vehicle.extraKmRate) : (vehicle.plainRatePerKm || 10),
      driverAllowance: vehicle.driverAllowance !== undefined ? Number(vehicle.driverAllowance) : 300,
      active: vehicle.active !== false
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
    if (!formData.name?.trim()) return;
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
        minBookingKm: Number(formData.minBookingKm) || 20,
        plainRatePerKm: Number(formData.plainRatePerKm) || 10,
        hillRatePerKm: Number(formData.hillRatePerKm) || 12,
        minimumKm: Number(formData.minimumKm) || 250,
        extraKmRate: Number(formData.extraKmRate) || (Number(formData.plainRatePerKm) || 10),
        driverAllowance: Number(formData.driverAllowance) || 300,
        airportBasePrice: Number(formData.airportBasePrice) || 2499,
        active: Boolean(formData.active),
        ratesHint: '₹' + formData.plainRatePerKm + '/km Plain • ₹' + formData.hillRatePerKm + '/km Hill • Min ' + formData.minBookingKm + ' KM'
      };
      if (editingVehicle) {
        await updateFleetVehicle(editingVehicle.id, payload);
        setStatusMsg({ type: 'success', text: 'Vehicle updated successfully!' });
      } else {
        await addFleetVehicle(payload);
        setStatusMsg({ type: 'success', text: 'Vehicle added to fleet successfully!' });
      }
      await refreshSiteData();
      setModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save vehicle' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm('Are you sure you want to remove ' + name + ' from fleet?')) return;
    try {
      await deleteFleetVehicle(id);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Vehicle deleted from fleet.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete vehicle' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Car className="w-3.5 h-3.5 text-yellow-600" />
            <span>Fleet & Vehicle Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-nexa text-slate-900">
            Manage Fleet & Vehicle Tariffs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Add new cars, update images, configure plain-area / hill-area rates, minimum billable kilometers, and active availability.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {statusMsg.text && (
            <div className={'text-xs px-3.5 py-2 rounded-xl font-bold flex items-center ' + (statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200')}>{statusMsg.text}</div>
          )}
          <button onClick={openAddModal} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"><Plus className="w-4 h-4 text-brand-yellow" /><span>Add Vehicle</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(fleet || []).map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div><span className="inline-block px-2.5 py-0.5 bg-slate-900 text-yellow-400 text-[10px] font-bold uppercase rounded-md tracking-wider">{vehicle.category}</span><h3 className="text-lg font-bold font-nexa text-slate-900 mt-1">{vehicle.name}</h3></div>
                <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (vehicle.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600')}>{vehicle.active !== false ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="h-32 w-full flex items-center justify-center my-3 bg-gray-50 rounded-2xl overflow-hidden p-2">
                <img src={vehicle.image || '/assets/images/dzire.jpg'} alt={vehicle.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.target.src = '/assets/images/dzire.jpg'; }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-gray-100 mb-3">
                <div className="bg-slate-50 p-2 rounded-xl"><span className="text-[10px] text-gray-500 font-medium block">Plain Rate:</span><span className="font-bold text-slate-900">₹{vehicle.plainRatePerKm || vehicle.oneWayRate || 10}/km</span></div>
                <div className="bg-emerald-50 p-2 rounded-xl"><span className="text-[10px] text-emerald-700 font-medium block">Hill Rate:</span><span className="font-bold text-emerald-900">₹{vehicle.hillRatePerKm || 12}/km</span></div>
                <div className="bg-slate-50 p-2 rounded-xl"><span className="text-[10px] text-gray-500 font-medium block">Min. Distance:</span><span className="font-bold text-slate-900">{vehicle.minimumKm || 250} KM</span></div>
                <div className="bg-slate-50 p-2 rounded-xl"><span className="text-[10px] text-gray-500 font-medium block">Driver Allowance:</span><span className="font-bold text-slate-900">₹{vehicle.driverAllowance || 300}</span></div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{vehicle.description || 'Reliable chauffeur-driven taxi service.'}</p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
              <button onClick={() => openEditModal(vehicle)} className="flex-1 py-2 px-3 bg-white hover:bg-yellow-400 hover:text-slate-950 text-slate-800 font-bold text-xs rounded-xl border border-gray-200 transition-colors flex items-center justify-center space-x-1"><Edit2 className="w-3.5 h-3.5" /><span>Edit Vehicle</span></button>
              <button onClick={() => handleDelete(vehicle.id, vehicle.name)} className="py-2 px-3 bg-white hover:bg-rose-500 hover:text-white text-rose-600 font-bold text-xs rounded-xl border border-gray-200 transition-colors flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-left relative my-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-slate-900 transition-colors"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold font-nexa text-slate-900 mb-1">{editingVehicle ? 'Edit Vehicle & Tariff Slabs' : 'Add New Vehicle to Fleet'}</h3>
            <p className="text-xs text-gray-500 mb-5">Configure specs, photos, plain/hill rates, and minimum distance rules.</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-gray-600 font-semibold mb-1">Vehicle Name *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Maruti Suzuki Dzire" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-gray-600 font-semibold mb-1">Category</label><input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Budget Sedan, Family SUV" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              </div>
              <div><label className="block text-gray-600 font-semibold mb-1">Vehicle Image</label><div className="flex gap-2"><input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="/assets/images/dzire.jpg or https://..." className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-yellow-400" /><label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer flex items-center space-x-1 flex-shrink-0"><Upload className="w-3.5 h-3.5 text-brand-yellow" /><span>{isUploading ? 'Uploading...' : 'Upload'}</span><input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" /></label></div></div>
              <div className="bg-yellow-400/10 p-4 rounded-2xl border border-yellow-400/20 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center"><Mountain className="w-3.5 h-3.5 mr-1.5 text-yellow-700" />Pricing & Distance Rules</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div><label className="block text-gray-600 font-semibold mb-1">Plain Rate (₹/km)</label><input type="number" required value={formData.plainRatePerKm} onChange={e => setFormData({ ...formData, plainRatePerKm: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
                  <div><label className="block text-gray-600 font-semibold mb-1">Hill Rate (₹/km)</label><input type="number" required value={formData.hillRatePerKm} onChange={e => setFormData({ ...formData, hillRatePerKm: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
                  <div><label className="block text-gray-600 font-semibold mb-1">Min. Distance (KM)</label><input type="number" required value={formData.minimumKm} onChange={e => setFormData({ ...formData, minimumKm: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
                  <div><label className="block text-gray-600 font-semibold mb-1">Driver Allowance (₹)</label><input type="number" required value={formData.driverAllowance} onChange={e => setFormData({ ...formData, driverAllowance: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-slate-900 outline-none" /></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div><label className="block text-gray-600 font-semibold mb-1">Seating Capacity</label><input type="text" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} placeholder="e.g. 4 Passengers" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none" /></div>
                <div><label className="block text-gray-600 font-semibold mb-1">Luggage Capacity</label><input type="text" value={formData.luggage} onChange={e => setFormData({ ...formData, luggage: e.target.value })} placeholder="e.g. 2-3 Bags" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none" /></div>
                <div><label className="block text-gray-600 font-semibold mb-1">Active Status</label><select value={formData.active ? 'true' : 'false'} onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 outline-none"><option value="true">Active & Bookable</option><option value="false">Disabled / Inactive</option></select></div>
              </div>
              <div><label className="block text-gray-600 font-semibold mb-1">Description</label><textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Comfortable AC sedan for outstation trips..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none" /></div>
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs hover:bg-yellow-500">{isSaving ? 'Saving...' : 'Save Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}