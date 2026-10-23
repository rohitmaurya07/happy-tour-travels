import AdminUser from './AdminUser.js';
import SiteConfig from './SiteConfig.js';
import PricingSettings from './PricingSettings.js';
import MediaSettings from './MediaSettings.js';
import Fleet from './Fleet.js';
import PricingRoute from './PricingRoute.js';
import PopularLocation from './PopularLocation.js';
import PopularRoute from './PopularRoute.js';
import Package from './Package.js';
import Service from './Service.js';
import HourlyRentalPricing from './HourlyRentalPricing.js';
import Booking from './Booking.js';

export {
  AdminUser,
  SiteConfig,
  PricingSettings,
  MediaSettings,
  Fleet,
  PricingRoute,
  PopularLocation,
  PopularRoute,
  Package,
  Service,
  HourlyRentalPricing,
  Booking
};

/**
 * Mapping of file/entity names to their respective Mongoose model and storage format
 */
export const MODEL_REGISTRY = {
  adminUser: {
    model: AdminUser,
    type: 'single', // stored as single document
    keyField: 'username'
  },
  siteConfig: {
    model: SiteConfig,
    type: 'single',
    keyField: 'key'
  },
  pricingSettings: {
    model: PricingSettings,
    type: 'single',
    keyField: 'key'
  },
  mediaSettings: {
    model: MediaSettings,
    type: 'single',
    keyField: 'key'
  },
  hourlyRentalPricing: {
    model: HourlyRentalPricing,
    type: 'single',
    keyField: 'key'
  },
  fleet: {
    model: Fleet,
    type: 'array',
    idField: 'id'
  },
  pricingRoutes: {
    model: PricingRoute,
    type: 'array',
    idField: 'id'
  },
  popularLocations: {
    model: PopularLocation,
    type: 'array',
    idField: 'name'
  },
  popularRoutes: {
    model: PopularRoute,
    type: 'array',
    idField: 'category'
  },
  packages: {
    model: Package,
    type: 'array',
    idField: 'id'
  },
  services: {
    model: Service,
    type: 'array',
    idField: 'id'
  },
  bookings: {
    model: Booking,
    type: 'array',
    idField: 'id'
  }
};
