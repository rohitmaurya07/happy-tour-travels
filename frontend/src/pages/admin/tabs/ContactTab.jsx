import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Save, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { updateSiteConfig } from '../../../services/api';

export default function ContactTab() {
  const { siteConfig, refreshSiteData } = useSiteData();
  const [formData, setFormData] = useState({ ...siteConfig });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await updateSiteConfig(formData);
      await refreshSiteData();
      setStatusMsg({ type: 'success', text: 'Contact details and business info updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update contact info' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Phone className="w-3.5 h-3.5 text-yellow-600" />
            <span>Contact & Business Info</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Manage Contact & Location Information</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Update phone numbers, WhatsApp click-to-chat numbers, office address, and Google Maps embed.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="yellow-gradient-btn px-6 py-3 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all self-stretch sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Contact Info'}</span>
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

      {/* Main Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Box 1: Business Identity & Contact Numbers */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Building2 className="w-5 h-5 text-brand-yellow" />
            <h2 className="text-base font-bold font-heading text-slate-900">Brand Identity & Phones</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp API Number (digits only) *
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. 917837175090"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                required
              />
              <span className="text-[10px] text-gray-400 font-medium">Without '+' or spaces (e.g. 917837175090)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Display Format
              </label>
              <input
                type="text"
                value={formData.whatsappNumberFormatted}
                onChange={(e) => setFormData({ ...formData, whatsappNumberFormatted: e.target.value })}
                placeholder="e.g. +91 78371 75090"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 78371 75090"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                placeholder="24/7 Available (365 Days)"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

        </div>

        {/* Box 2: Physical Address & Google Maps Embed */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold font-heading text-slate-900">Physical Office & Map Location</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Office Full Address *
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary City
              </label>
              <input
                type="text"
                value={formData.primaryCity}
                onChange={(e) => setFormData({ ...formData, primaryCity: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary State
              </label>
              <input
                type="text"
                value={formData.primaryState}
                onChange={(e) => setFormData({ ...formData, primaryState: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Google Maps Embed IFrame URL
            </label>
            <input
              type="text"
              value={formData.googleMapsEmbedUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-yellow"
            />
          </div>

          {/* Map Live Preview */}
          {formData.googleMapsEmbedUrl && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 h-40">
              <iframe
                src={formData.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location Map Preview"
              />
            </div>
          )}
        </div>

      </form>

    </div>
  );
}
