import React, { useState } from 'react';
import { MessageCircle, Calendar, Clock, Users, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';

export default function WhatsAppInquiryForm({ className = '', title = "Quick WhatsApp Inquiry", subtitle = "Fill in your travel details to get an instant quote on WhatsApp." }) {
  const { siteConfig } = useSiteData();

  // Helper for today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    service: 'One Way',
    from: '',
    to: '',
    travelDate: todayStr,
    travelTime: '09:00',
    passengers: '2',
    message: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const servicesList = [
    'Airport Transfer',
    'One Way',
    'Round Trip',
    'Local Taxi',
    'Tour Package'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  // Format date to "5 October 2026"
  const formatTravelDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Format 24-hour time "06:00" to "6:00 AM"
  const formatTravelTime = (timeStr) => {
    if (!timeStr) return 'Not specified';
    try {
      const [hh, mm] = timeStr.split(':');
      const hour = parseInt(hh, 10);
      const min = mm || '00';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${min} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.from.trim()) {
      setErrorMsg('Please enter pickup city or airport name.');
      return;
    }
    if (formData.service !== 'Local Taxi' && !formData.to.trim()) {
      setErrorMsg('Please enter destination city or airport name.');
      return;
    }
    if (!formData.travelDate) {
      setErrorMsg('Please select your travel date.');
      return;
    }

    const formattedDate = formatTravelDate(formData.travelDate);
    const formattedTime = formatTravelTime(formData.travelTime);
    const toDisplay = formData.to.trim() || (formData.service === 'Local Taxi' ? 'Local City Travel' : 'Not specified');
    const msgContent = formData.message.trim() || 'Please share available cab options and best fare quote.';

    const inquiryMessage = `New Website Inquiry – ${siteConfig?.businessName || 'Happy Tour & Travel'}

Name: ${formData.name.trim()}
Service: ${formData.service}
From: ${formData.from.trim()}
To: ${toDisplay}
Travel Date: ${formattedDate}
Travel Time: ${formattedTime}
Passengers: ${formData.passengers}
Message: ${msgContent}`;

    bookOnWhatsApp(inquiryMessage);
  };

  return (
    <div className={`bg-white rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-xl relative overflow-hidden ${className}`}>
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500" />

      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>Instant WhatsApp Inquiry</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-nexa text-slate-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSendWhatsApp} className="space-y-4">
        
        {/* 1. Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            1. Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            required
            className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all min-h-[44px]"
          />
        </div>

        {/* 2. Service Required */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            2. Service Required <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {servicesList.map((srv) => {
              const isSelected = formData.service === srv;
              return (
                <button
                  type="button"
                  key={srv}
                  onClick={() => setFormData(prev => ({ ...prev, service: srv }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all border touch-manipulation active:scale-95 min-h-[42px] ${
                    isSelected
                      ? 'bg-slate-900 text-yellow-400 border-slate-900 shadow-sm ring-2 ring-yellow-400/50'
                      : 'bg-gray-50 hover:bg-gray-100 text-slate-700 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{srv}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 & 4. From and To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-yellow-600 mr-1 flex-shrink-0" />
              <span>3. From</span> <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="Enter city name / airport name"
              required
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
              <span>4. To</span> {formData.service !== 'Local Taxi' && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder={formData.service === 'Local Taxi' ? 'Local City Travel / Optional' : 'Enter city name / airport name'}
              required={formData.service !== 'Local Taxi'}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all min-h-[44px]"
            />
          </div>
        </div>

        {/* 5, 6 & 7. Date, Time & Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
              <span>5. Travel Date</span> <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="date"
              name="travelDate"
              min={todayStr}
              value={formData.travelDate}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all cursor-pointer min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
              <span>6. Travel Time</span> <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="time"
              name="travelTime"
              value={formData.travelTime}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all cursor-pointer min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <Users className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
              <span>7. Passengers</span>
            </label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all cursor-pointer min-h-[44px]"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers (Dzire / Sedan)</option>
              <option value="5">5 Passengers</option>
              <option value="6">6 Passengers (Ertiga / SUV)</option>
              <option value="7">7 Passengers (Innova Crysta)</option>
              <option value="8">8 Passengers</option>
              <option value="9">9+ Passengers (Tempo Traveller)</option>
              <option value="12">12+ Passengers</option>
              <option value="16">16+ Passengers</option>
            </select>
          </div>
        </div>

        {/* 8. Message / Your Requirement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            8. Message / Your Requirement
          </label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="Innova Crysta चाहिए और pickup घर से चाहिए..."
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
          ></textarea>
        </div>

        {/* Note about WhatsApp Direct Number */}
        <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>No separate phone number field required — your inquiry opens directly in WhatsApp with all details formatted.</span>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black font-nexa py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2.5 text-sm sm:text-base group"
          >
            <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <MessageCircle className="w-5 h-5 fill-white stroke-none group-hover:scale-110 transition-transform" />
            <span>Send Inquiry on WhatsApp</span>
          </button>
        </div>

      </form>
    </div>
  );
}
