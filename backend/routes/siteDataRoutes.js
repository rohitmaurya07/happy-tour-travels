import express from 'express';
import { readJson } from '../utils/storage.js';

const router = express.Router();

// GET /api/site-data - Returns full public package of dynamic website content
router.get('/', (req, res) => {
  try {
    const siteConfig = readJson('siteConfig');
    const fleet = readJson('fleet') || [];
    const packages = readJson('packages') || [];
    const services = readJson('services') || [];
    const popularRoutes = readJson('popularRoutes') || [];
    const popularLocations = readJson('popularLocations') || [];
    const pricingRoutes = readJson('pricingRoutes') || [];
    const pricingSettings = readJson('pricingSettings') || {};
    const mediaSettings = readJson('mediaSettings') || {};
    const hourlyRentalPricing = readJson('hourlyRentalPricing') || {};

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        siteConfig,
        fleet,
        packages,
        services,
        popularRoutes,
        popularLocations,
        pricingRoutes,
        pricingSettings,
        mediaSettings,
        hourlyRentalPricing
      }
    });
  } catch (error) {
    console.error('Error fetching site data:', error);
    return res.status(500).json({ success: false, message: 'Failed to load site data' });
  }
});

export default router;
