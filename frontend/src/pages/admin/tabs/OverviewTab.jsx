import React from 'react';
import { Car, Package, Sparkles, Navigation, Phone, Video, ShieldCheck, DollarSign, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

export default function OverviewTab({ setActiveTab }) {
  const { siteConfig, fleet, packages, services, popularRoutes, popularLocations, pricingSettings, isBackendConnected } = useSiteData();

  const totalRoutes = popularRoutes.reduce((acc, cat) => acc + (cat.routes?.length || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Live Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-nexa font-extrabold text-white">
              Welcome to {siteConfig.businessName} Admin
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1 max-w-2xl">
              Control pricing, car fleet, tour packages, media, website content, and security settings with real-time synchronization.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className={`w-3 h-3 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping`} />
            <div className="text-xs">
              <span className="text-gray-400 font-semibold block">System Status:</span>
              <strong className={isBackendConnected ? 'text-emerald-400' : 'text-amber-400'}>
                {isBackendConnected ? 'API Connected & Synced' : 'Offline / Local Cache'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div 
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Car className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Fleet Vehicles</span>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{fleet.length} Cabs</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Click to manage car rates & specs</span>
        </div>

        <div 
          onClick={() => setActiveTab('packages')}
          className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tour Packages</span>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{packages.length} Tours</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Himachal & Punjab tour itineraries</span>
        </div>

        <div 
          onClick={() => setActiveTab('routes')}
          className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Popular Routes</span>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{totalRoutes} Routes</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Across {popularLocations.length} Pan-India destinations</span>
        </div>

        <div 
          onClick={() => setActiveTab('pricing')}
          className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Pricing Policy</span>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
            {pricingSettings.tollIncluded ? 'All-Inclusive' : 'Custom'}
          </div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Tolls, State Tax & Driver Allowance</span>
        </div>

      </div>

      {/* Quick Action Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mb-6 flex items-center">
          <Sparkles className="w-5 h-5 text-brand-yellow mr-2" />
          Quick Management Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('pricing')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update Cab Rates & Tolls</h3>
              <p className="text-xs text-gray-500 mt-0.5">Modify per-km fares and local package prices</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Change Hero Video & Images</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload new background video or banner assets</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update WhatsApp & Contacts</h3>
              <p className="text-xs text-gray-500 mt-0.5">Change phone numbers, office address and map</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add / Edit Fleet Vehicles</h3>
              <p className="text-xs text-gray-500 mt-0.5">Update photos, seating specs and car descriptions</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Tour Packages</h3>
              <p className="text-xs text-gray-500 mt-0.5">Add new Himachal/Punjab tour packages</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
              <p className="text-xs text-gray-500 mt-0.5">Change admin credentials and security policy</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
