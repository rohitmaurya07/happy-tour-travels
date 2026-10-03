import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { SiteDataProvider } from './context/SiteDataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MobileBottomBar from './components/MobileBottomBar';
import PaymentLockOverlay from './components/PaymentLockOverlay';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import PackagesPage from './pages/PackagesPage';
import RoutesPage from './pages/RoutesPage';
import ContactPage from './pages/ContactPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CityTaxiPage from './pages/CityTaxiPage';
import HourlyRentalPage from './pages/HourlyRentalPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';

function PublicLayout() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col font-manrope selection:bg-yellow-300 selection:text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MobileBottomBar />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <Router>
        {/* Full-Website Payment Lock Overlay (Toggleable in code) */}
        <PaymentLockOverlay />
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/taxi/:slug" element={<CityTaxiPage />} />
            <Route path="/hourly-rental" element={<HourlyRentalPage />} />
            <Route path="/hourly-rental/:citySlug" element={<HourlyRentalPage />} />
          </Route>
        </Routes>
      </Router>
    </SiteDataProvider>
  );
}
