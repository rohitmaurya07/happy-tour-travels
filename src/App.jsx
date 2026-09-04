import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import MobileBottomBar from './components/MobileBottomBar';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import PackagesPage from './pages/PackagesPage';
import RoutesPage from './pages/RoutesPage';
import ContactPage from './pages/ContactPage';
import SearchResultsPage from './pages/SearchResultsPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col font-manrope selection:bg-yellow-300 selection:text-slate-900 pb-16 md:pb-0">
        
        {/* Sticky Header Navigation */}
        <Navbar />

        {/* Multi-Page Route Views */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        {/* Fixed Bottom-Right WhatsApp Floating Action Button */}
        <WhatsAppButton />

        {/* Fixed Mobile Bottom Bar for Quick Trip Selection */}
        <MobileBottomBar />

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
