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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div 
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Fleet Vehicles</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">{fleet.length} Cabs</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Rates, specs & KMs</span>
        </div>

        <div 
          onClick={() => setActiveTab('packages')}
          className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Top Destinations</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">{packages.length} Spots</div>
          <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Shimla, Manali & more</span>
        </div>

        <div 
          onClick={() => setActiveTab('services')}
          className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Travel Services</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">{services.length} Services</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Airport, One-Way & Hourly</span>
        </div>

        <div 
          onClick={() => setActiveTab('routes')}
          className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Popular Routes</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">{totalRoutes} Routes</div>
          <span className="text-[10px] text-indigo-700 font-semibold mt-1 block">{popularLocations.length} Pan-India spots</span>
        </div>

        <div 
          onClick={() => setActiveTab('pricing')}
          className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-yellow-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Pricing Policy</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
            {pricingSettings.tollIncluded ? 'All-Inclusive' : 'Custom'}
          </div>
          <span className="text-[10px] text-purple-700 font-semibold mt-1 block">Toll & driver allowance</span>
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
              <h3 className="text-sm font-bold text-slate-900">Manage Top Destinations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Add, edit, or hide 15+ destination tour packages</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className="p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 bg-gray-50/70 hover:bg-yellow-50/40 text-left transition-all flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-sm text-yellow-600 group-hover:bg-brand-yellow group-hover:text-slate-950 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Travel Services</h3>
              <p className="text-xs text-gray-500 mt-0.5">Configure 4 core service cards & connections</p>
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
