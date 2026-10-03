import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { bookOnWhatsApp } from '../utils/whatsapp';
import Map from './Map';
import WhatsAppInquiryForm from './WhatsAppInquiryForm';

export default function Contact() {
  const { siteConfig } = useSiteData();

  return (
    <section id="contact" className="py-16 sm:py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/30">
            24/7 Customer Support & Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-nexa text-slate-900 font-heading mt-4 tracking-tight">
            Get in Touch With Us
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium">
            Send an instant booking inquiry on WhatsApp or call our desk directly for custom quotes.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
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
                      {siteConfig.phoneNumber}
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
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-red-400 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Email Address</span>
                    <a href={`mailto:${siteConfig.email}`} className="text-sm font-bold text-white hover:text-red-400 transition-colors break-all">
                      {siteConfig.email}
                    </a>
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

          {/* Column 2: New WhatsApp Inquiry Form */}
          <div className="lg:col-span-7">
            <WhatsAppInquiryForm 
              title="Send WhatsApp Inquiry"
              subtitle="Fill in the fields below and click Send Inquiry to open WhatsApp with your pre-formatted booking details."
            />
          </div>

        </div>

        {/* Google Maps Component */}
        <Map />

      </div>
    </section>
  );
}
