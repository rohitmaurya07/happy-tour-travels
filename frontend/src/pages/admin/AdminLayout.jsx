import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  Car,
  Package,
  Sparkles,
  Navigation,
  Phone,
  Video,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import OverviewTab from './tabs/OverviewTab';
import PricingTab from './tabs/PricingTab';
import FleetTab from './tabs/FleetTab';
import PackagesTab from './tabs/PackagesTab';
import ServicesTab from './tabs/ServicesTab';
import RoutesTab from './tabs/RoutesTab';
import ContactTab from './tabs/ContactTab';
import MediaTab from './tabs/MediaTab';
import SecurityTab from './tabs/SecurityTab';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, adminUser, logout, refreshSiteData, siteConfig, isBackendConnected } = useSiteData();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSiteData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'pricing', label: 'Pricing & Charges', icon: DollarSign },
    { id: 'fleet', label: 'Car Fleet & Rates', icon: Car },
    { id: 'packages', label: 'Top Destinations & Tours', icon: Package },
    { id: 'services', label: 'Travel Services', icon: Sparkles },
    { id: 'routes', label: 'Routes & Locations', icon: Navigation },
    { id: 'contact', label: 'Contact & Business Info', icon: Phone },
    { id: 'media', label: 'Media & Hero Video', icon: Video },
    { id: 'security', label: 'Admin Security', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-manrope selection:bg-yellow-300 selection:text-slate-900">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 font-black flex items-center justify-center font-heading text-sm">
            HT
          </div>
          <span className="font-nexa font-bold text-sm tracking-tight text-white">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-900 text-yellow-400 rounded-xl border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-full md:h-screen w-72 bg-slate-950 text-white z-50 flex flex-col justify-between p-5 transition-transform duration-300 border-r border-slate-800/80
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800/80 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-950 font-black flex items-center justify-center font-heading text-base shadow-yellow-glow">
              HT
            </div>
            <div>
              <h2 className="font-nexa font-extrabold text-sm text-white leading-tight">
                {siteConfig.businessName}
              </h2>
              <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider block">
                Master Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-slate-950 shadow-md font-extrabold scale-[1.02]'
                      : 'text-gray-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="truncate">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Logged in as:</span>
              <strong className="text-white font-bold truncate block">{adminUser?.username || 'admin'}</strong>
            </div>
            <button
              onClick={handleRefresh}
              title="Refresh Data"
              className={`p-2 rounded-xl bg-slate-900 text-gray-400 hover:text-yellow-400 border border-slate-800 ${isRefreshing ? 'animate-spin text-yellow-400' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 hover:bg-slate-850 text-gray-300 hover:text-yellow-400 border border-slate-800 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'pricing' && <PricingTab />}
        {activeTab === 'fleet' && <FleetTab />}
        {activeTab === 'packages' && <PackagesTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'media' && <MediaTab />}
        {activeTab === 'security' && <SecurityTab />}
      </main>

    </div>
  );
}
