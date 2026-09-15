import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import Map from './Map';

export default function Contact() {
  const { siteConfig } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    from: '',
    to: '',
    message: ''
  });

  const [formSuccess, setFormSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormSuccess('Please provide at least your Name and Phone Number.');
      return;
    }

    const message = `Hello ${siteConfig.businessName},

Inquiry Details from Website:
• Name: ${formData.name}
• Phone: ${formData.phone}
• Pickup (From): ${formData.from}
• Destination (To): ${formData.to || 'Not specified'}

Message:
${formData.message || 'I would like to inquire about taxi booking options and fares.'}`;

    bookOnWhatsApp(message);
    setFormSuccess('Opening WhatsApp with your pre-filled inquiry...');
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            24/7 Customer Support
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            Get in Touch With Us
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">
            Have questions about fares, customized tour packages, or airport transfers? Contact us directly on WhatsApp or phone.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Contact Information */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest block mb-2">
                Quick Contact Info
              </span>
              <h3 className="text-2xl sm:text-3xl font-nexa font-heading text-white mb-6">
                Happy Tour & Travels Jalandhar
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed mb-8 font-normal">
                Visit our office near Bus Stand Jalandhar or book directly online via WhatsApp. We operate 24 hours a day, 7 days a week.
              </p>

              {/* Info Cards */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-brand-yellow flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Call Us Directly</span>
                    <a href={`tel:${siteConfig.phoneNumber}`} className="text-base font-bold text-white hover:text-brand-yellow transition-colors">
                      {siteConfig.phoneNumberFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">WhatsApp Instant Support</span>
                    <button 
                      onClick={() => bookOnWhatsApp(`Hello ${siteConfig.businessName}, I would like to inquire about taxi services.`)}
                      className="text-base font-bold text-white hover:text-emerald-400 transition-colors text-left"
                    >
                      {siteConfig.whatsappNumberFormatted}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Office Location</span>
                    <span className="text-sm font-bold text-white">
                      {siteConfig.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-purple-400 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Working Hours</span>
                    <span className="text-sm font-bold text-white">
                      {siteConfig.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Instant Confirmation</span>
              <span className="text-brand-yellow font-semibold">Zero Booking Fees</span>
            </div>

          </div>

          {/* Column 2: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">
              Send an Enquiry
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">
              Fill in your details below to send your inquiry directly via WhatsApp.
            </p>

            {formSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Gurpreet Singh"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-400/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-400/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    placeholder="Jalandhar"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    placeholder="e.g. Delhi / Manali"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Special Requirements
                </label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mention trip date, preferred vehicle (Dzire, Ertiga, Innova, Tempo), or passenger count..."
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-yellow-400/20"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="yellow-gradient-btn py-3.5 px-4 rounded-xl text-slate-950 font-nexa text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Send via WhatsApp</span>
                </button>

              </div>

            </form>
          </div>

        </div>

        {/* Google Maps Component */}
        <Map />

      </div>
    </section>
  );
}
