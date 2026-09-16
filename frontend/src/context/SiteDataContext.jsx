import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteConfig as defaultSiteConfig } from '../config/siteConfig';
import { fleetData as defaultFleet } from '../data/fleet';
import { packagesData as defaultPackages } from '../data/packages';
import { servicesData as defaultServices } from '../data/services';
import { popularRouteCategories as defaultRoutes } from '../data/popularRoutes';
import { popularLocations as defaultLocations } from '../data/popularLocations';
import { API_BASE } from '../services/api';

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('/uploads/')) {
    return API_BASE ? `${API_BASE}${url}` : url;
  }
  return url;
};
import {
  fetchPublicSiteData,
  adminLogin as apiAdminLogin,
  adminVerify,
  adminChangePassword as apiChangePassword
} from '../services/api';

const defaultPricing = {
  tollIncluded: true,
  stateTaxIncluded: true,
  driverAllowanceIncluded: true,
  fuelIncluded: true,
  nightChargesAmount: 250,
  nightChargeStartHour: 23,
  nightChargeEndHour: 5,
  gstPercent: 0,
  gstIncluded: true,
  termsAndConditions: 'All outstation estimates include State Taxes, Highway Toll Taxes, Driver Allowance and Fuel. Toll & parking on local rentals as per actual.'
};

const defaultMedia = {
  heroVideoUrl: '/assets/herovideo.mp4',
  heroTitle: 'Safe, Reliable and Comfortable Taxi Services.',
  heroHighlightedWord: 'Taxi Services.',
  heroSubtitle: 'Across North India, wherever your journey takes you.',
  trustBadgeText: 'Best Taxi Service in North India',
  logoUrl: '/assets/images/logo.jpg'
};

const SiteDataContext = createContext(null);

export const SiteDataProvider = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [pricingSettings, setPricingSettings] = useState(defaultPricing);
  const [mediaSettings, setMediaSettings] = useState(defaultMedia);
  const [fleet, setFleet] = useState(defaultFleet);
  const [packages, setPackages] = useState(defaultPackages);
  const [services, setServices] = useState(defaultServices);
  const [popularRoutes, setPopularRoutes] = useState(defaultRoutes);
  const [popularLocations, setPopularLocations] = useState(defaultLocations);

  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('happy_admin_token') || null);

  // Refresh data from backend
  const refreshSiteData = useCallback(async () => {
    try {
      const data = await fetchPublicSiteData();
      if (data) {
        if (data.siteConfig) setSiteConfig(data.siteConfig);
        if (data.pricingSettings) setPricingSettings(data.pricingSettings);
        if (data.mediaSettings) {
          setMediaSettings({
            ...data.mediaSettings,
            heroVideoUrl: normalizeUrl(data.mediaSettings.heroVideoUrl),
            logoUrl: normalizeUrl(data.mediaSettings.logoUrl)
          });
        }
        if (data.fleet && data.fleet.length > 0) {
          setFleet(data.fleet.map(car => ({ ...car, image: normalizeUrl(car.image) })));
        }
        if (data.packages && data.packages.length > 0) setPackages(data.packages);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.popularRoutes && data.popularRoutes.length > 0) setPopularRoutes(data.popularRoutes);
        if (data.popularLocations && data.popularLocations.length > 0) setPopularLocations(data.popularLocations);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.warn('Backend server not connected or unreachable, using cached/default data:', err.message);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshSiteData();
  }, [refreshSiteData]);

  // Check auth session on startup
  useEffect(() => {
    if (token) {
      adminVerify()
        .then(user => {
          setAdminUser(user);
        })
        .catch(() => {
          localStorage.removeItem('happy_admin_token');
          setToken(null);
          setAdminUser(null);
        });
    }
  }, [token]);

  // Login handler
  const login = async (username, password) => {
    const res = await apiAdminLogin(username, password);
    localStorage.setItem('happy_admin_token', res.token);
    setToken(res.token);
    setAdminUser(res.user);
    return res;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('happy_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  // Change Password handler
  const changePassword = async (payload) => {
    const res = await apiChangePassword(payload);
    if (res.token) {
      localStorage.setItem('happy_admin_token', res.token);
      setToken(res.token);
      setAdminUser(res.user);
    }
    return res;
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteConfig,
        pricingSettings,
        mediaSettings,
        fleet,
        packages,
        services,
        popularRoutes,
        popularLocations,
        isLoading,
        isBackendConnected,
        refreshSiteData,
        // Admin Auth
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        changePassword
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
