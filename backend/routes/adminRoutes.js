import fs from 'fs';
import express from 'express';
import path from 'path';
import multer from 'multer';
import { readJson, writeJson } from '../utils/storage.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateVehiclePricing, calculateFare } from '../utils/pricingEngine.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Protect all /api/admin/* endpoints with authMiddleware
router.use(authMiddleware);

// Multer Storage Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|mp4|webm|mov|ogg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are supported.'));
    }
  }
});

// POST /api/admin/upload - Upload image or video
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// --- SITE CONFIG & CONTACT INFO ---
router.get('/site-config', (req, res) => {
  res.json({ success: true, data: readJson('siteConfig') });
});

router.put('/site-config', (req, res) => {
  const current = readJson('siteConfig') || {};
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  writeJson('siteConfig', updated);
  res.json({ success: true, message: 'Site configuration updated successfully', data: updated });
});

// --- PRICING & CHARGES SETTINGS ---
router.get('/pricing-settings', (req, res) => {
  res.json({ success: true, data: readJson('pricingSettings') });
});

router.put('/pricing-settings', (req, res) => {
  const current = readJson('pricingSettings') || {};
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  writeJson('pricingSettings', updated);
  res.json({ success: true, message: 'Pricing and extra charges updated successfully', data: updated });
});

// --- MEDIA SETTINGS ---
router.get('/media-settings', (req, res) => {
  res.json({ success: true, data: readJson('mediaSettings') });
});

router.put('/media-settings', (req, res) => {
  const current = readJson('mediaSettings') || {};
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  writeJson('mediaSettings', updated);
  res.json({ success: true, message: 'Media settings updated successfully', data: updated });
});

// --- FLEET MANAGEMENT (CRUD with Full Pricing Configuration & Validation) ---
router.get('/fleet', (req, res) => {
  res.json({ success: true, data: readJson('fleet') || [] });
});

router.post('/fleet', (req, res) => {
  const validation = validateVehiclePricing(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const fleet = readJson('fleet') || [];
  const id = req.body.id || `car-${Date.now()}`;

  const newVehicle = {
    ...req.body,
    id,
    name: req.body.name?.trim(),
    minBookingKm: req.body.minBookingKm !== undefined ? Number(req.body.minBookingKm) : 20,
    slabs: Array.isArray(req.body.slabs) ? req.body.slabs : [],
    longDistance: req.body.longDistance || {
      startAfterKm: 95,
      baseFare: 1700,
      additionalKmRate: Number(req.body.plainRatePerKm) || 12
    },
    oneWayRate: Number(req.body.oneWayRate) || 12,
    roundTripRate: Number(req.body.roundTripRate) || 11,
    packages: req.body.packages || {
      fourHours: { price: 1000, includedKm: 40 },
      eightHours: { price: 1500, includedKm: 80 }
    },
    airportBasePrice: Number(req.body.airportBasePrice) || 2499,
    plainRatePerKm: Number(req.body.plainRatePerKm) || 10,
    hillRatePerKm: Number(req.body.hillRatePerKm) || 12,
    minimumKm: Number(req.body.minimumKm) || 250,
    extraKmRate: Number(req.body.extraKmRate) || (Number(req.body.plainRatePerKm) || 10),
    driverAllowance: Number(req.body.driverAllowance) || 300,
    active: req.body.active !== undefined ? Boolean(req.body.active) : true,
    rank: Number(req.body.rank) || fleet.length + 1,
    ratesHint: `₹${req.body.plainRatePerKm || 10}/km Plain • ₹${req.body.hillRatePerKm || 12}/km Hill • Min ${req.body.minBookingKm || 20} KM`
  };

  fleet.push(newVehicle);
  writeJson('fleet', fleet);
  res.json({ success: true, message: 'Vehicle added to fleet successfully', data: newVehicle });
});

router.put('/fleet/:id', (req, res) => {
  let fleet = readJson('fleet') || [];
  const index = fleet.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  const merged = {
    ...fleet[index],
    ...req.body,
    id: req.params.id
  };

  const validation = validateVehiclePricing(merged);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  fleet[index] = {
    ...merged,
    name: merged.name?.trim(),
    pricingMode: merged.pricingMode || fleet[index].pricingMode || 'hybrid',
    minBookingKm: merged.minBookingKm !== undefined ? Number(merged.minBookingKm) : 20,
    slabs: Array.isArray(merged.slabs) ? merged.slabs : (fleet[index].slabs || []),
    longDistance: merged.longDistance || fleet[index].longDistance || {
      startAfterKm: 95,
      baseFare: 1700,
      additionalKmRate: 12
    },
    oneWayRate: merged.oneWayRate !== undefined ? Number(merged.oneWayRate) : fleet[index].oneWayRate,
    roundTripRate: merged.roundTripRate !== undefined ? Number(merged.roundTripRate) : fleet[index].roundTripRate,
    packages: merged.packages || fleet[index].packages || {
      fourHours: { price: 1000, includedKm: 40 },
      eightHours: { price: 1500, includedKm: 80 }
    },
    airportBasePrice: merged.airportBasePrice !== undefined ? Number(merged.airportBasePrice) : fleet[index].airportBasePrice,
    plainRatePerKm: merged.plainRatePerKm !== undefined ? Number(merged.plainRatePerKm) : fleet[index].plainRatePerKm,
    hillRatePerKm: merged.hillRatePerKm !== undefined ? Number(merged.hillRatePerKm) : fleet[index].hillRatePerKm,
    minimumKm: merged.minimumKm !== undefined ? Number(merged.minimumKm) : fleet[index].minimumKm,
    extraKmRate: merged.extraKmRate !== undefined ? Number(merged.extraKmRate) : fleet[index].extraKmRate,
    driverAllowance: merged.driverAllowance !== undefined ? Number(merged.driverAllowance) : fleet[index].driverAllowance,
    active: merged.active !== undefined ? Boolean(merged.active) : (fleet[index].active !== false),
    localPackages: {
      fourHours: Number(merged.packages?.fourHours?.price) || Number(merged.localPackages?.fourHours) || 1000,
      eightHours: Number(merged.packages?.eightHours?.price) || Number(merged.localPackages?.eightHours) || 1500
    },
    hourlyRate: Number(merged.packages?.eightHours?.price) || Number(merged.hourlyRate) || 1500,
    airportFixedRate: Number(merged.airportBasePrice) || Number(merged.airportFixedRate) || 2499,
    ratesHint: `₹${merged.plainRatePerKm || 10}/km Plain • ₹${merged.hillRatePerKm || 12}/km Hill • Min ${merged.minBookingKm || 20} KM`
  };

  writeJson('fleet', fleet);
  res.json({ success: true, message: 'Vehicle pricing updated successfully', data: fleet[index] });
});

router.put('/vehicle-pricing-all', (req, res) => {
  const { fleetList } = req.body;
  if (!Array.isArray(fleetList)) {
    return res.status(400).json({ success: false, message: 'Invalid vehicle list format.' });
  }

  for (let i = 0; i < fleetList.length; i++) {
    const v = fleetList[i];
    const validation = validateVehiclePricing(v);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: `Vehicle "${v.name || '#' + (i + 1)}": ${validation.message}` });
    }
  }

  let fleet = readJson('fleet') || [];
  const updatedFleet = fleetList.map(item => {
    const existing = fleet.find(f => f.id === item.id) || {};
    const p4 = item.packages?.fourHours?.price !== undefined ? Number(item.packages.fourHours.price) : (item.localPackages?.fourHours || 1000);
    const p8 = item.packages?.eightHours?.price !== undefined ? Number(item.packages.eightHours.price) : (item.localPackages?.eightHours || 1500);
    const airportPrice = item.airportBasePrice !== undefined ? Number(item.airportBasePrice) : (item.airportFixedRate || 2499);

    return {
      ...existing,
      ...item,
      pricingMode: item.pricingMode || existing.pricingMode || 'hybrid',
      localPackages: {
        fourHours: p4,
        eightHours: p8
      },
      hourlyRate: p8,
      airportFixedRate: airportPrice,
      ratesHint: `₹${item.plainRatePerKm || 10}/km Plain • ₹${item.hillRatePerKm || 12}/km Hill • Min ${item.minBookingKm || 20} KM`
    };
  });

  writeJson('fleet', updatedFleet);
  res.json({ success: true, message: 'All vehicle pricing configurations saved successfully', data: updatedFleet });
});

// --- ADMIN PREVIEW / TEST FARE CALCULATOR ---
router.post('/preview-fare', (req, res) => {
  try {
    const {
      vehicleId,
      distanceKm,
      pickup,
      destination,
      tripType,
      pickupTime,
      hourlyPackage
    } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ success: false, message: 'Vehicle ID is required.' });
    }

    const fare = calculateFare({
      pickup: pickup || 'Jalandhar',
      destination: destination || (distanceKm ? `${distanceKm} km Test Route` : 'Delhi'),
      vehicleId,
      tripType: tripType || 'One Way',
      pickupTime: pickupTime || '09:00',
      hourlyPackage: hourlyPackage || '8h',
      distanceKm: distanceKm ? Number(distanceKm) : null
    });

    return res.json({ success: true, fare });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/fleet-reorder', (req, res) => {
  const { fleetList } = req.body;
  if (Array.isArray(fleetList)) {
    writeJson('fleet', fleetList);
    return res.json({ success: true, message: 'Fleet reordered successfully', data: fleetList });
  }
  res.status(400).json({ success: false, message: 'Invalid list format' });
});

router.delete('/fleet/:id', (req, res) => {
  let fleet = readJson('fleet') || [];
  const filtered = fleet.filter(item => item.id !== req.params.id);
  writeJson('fleet', filtered);
  res.json({ success: true, message: 'Vehicle removed from fleet' });
});

// --- PRICING ROUTES MANAGEMENT (Location to Location & Vehicle Prices) ---
const syncPredefinedLocations = (pickup, destination) => {
  try {
    const locations = readJson('popularLocations') || [];
    const names = [pickup?.trim(), destination?.trim()].filter(Boolean);
    let modified = false;

    names.forEach(name => {
      const lower = name.toLowerCase();
      const exists = locations.some(l => l.name.toLowerCase() === lower);
      if (!exists) {
        locations.push({
          name,
          state: lower.includes('airport') ? 'Airport Hub' : 'North India',
          type: lower.includes('airport') ? 'Airport' : 'City',
          lat: 31.326,
          lon: 75.576,
          regionType: 'PLAIN'
        });
        modified = true;
      }
    });

    if (modified) {
      writeJson('popularLocations', locations);
    }
  } catch (err) {
    console.error('Error syncing predefined locations:', err);
  }
};

router.get('/pricing-routes', (req, res) => {
  res.json({ success: true, data: readJson('pricingRoutes') || [] });
});

router.post('/pricing-routes', (req, res) => {
  const routes = readJson('pricingRoutes') || [];
  const { pickup, destination, routeType, pricingType, vehiclePrices, distanceKm, active } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ success: false, message: 'Pickup and destination are required' });
  }

  const id = `${pickup.toLowerCase().replace(/[^a-z0-9]/g, '-')}-to-${destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const newRoute = {
    id,
    pickup: pickup.trim(),
    destination: destination.trim(),
    routeType: (routeType || 'PLAIN').toUpperCase(),
    pricingType: pricingType || 'fixed',
    vehiclePrices: vehiclePrices || {},
    distanceKm: distanceKm ? Number(distanceKm) : null,
    active: active !== undefined ? Boolean(active) : true,
    updatedAt: new Date().toISOString()
  };

  routes.push(newRoute);
  writeJson('pricingRoutes', routes);
  syncPredefinedLocations(pickup, destination);
  res.json({ success: true, message: 'Pricing route added successfully', data: newRoute });
});

router.put('/pricing-routes/:id', (req, res) => {
  let routes = readJson('pricingRoutes') || [];
  const index = routes.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Pricing route not found' });
  }

  routes[index] = {
    ...routes[index],
    ...req.body,
    id: req.params.id,
    pickup: req.body.pickup ? req.body.pickup.trim() : routes[index].pickup,
    destination: req.body.destination ? req.body.destination.trim() : routes[index].destination,
    routeType: (req.body.routeType || routes[index].routeType || 'PLAIN').toUpperCase(),
    pricingType: req.body.pricingType || routes[index].pricingType || 'fixed',
    vehiclePrices: req.body.vehiclePrices || routes[index].vehiclePrices || {},
    active: req.body.active !== undefined ? Boolean(req.body.active) : routes[index].active !== false,
    updatedAt: new Date().toISOString()
  };

  writeJson('pricingRoutes', routes);
  syncPredefinedLocations(routes[index].pickup, routes[index].destination);
  res.json({ success: true, message: 'Pricing route updated successfully', data: routes[index] });
});

router.delete('/pricing-routes/:id', (req, res) => {
  let routes = readJson('pricingRoutes') || [];
  const filtered = routes.filter(r => r.id !== req.params.id);
  writeJson('pricingRoutes', filtered);
  res.json({ success: true, message: 'Pricing route deleted successfully' });
});

// --- BOOKINGS MANAGEMENT (Admin inspection of historical snapshots) ---
router.get('/bookings', (req, res) => {
  const bookings = readJson('bookings') || [];
  res.json({ success: true, data: bookings });
});

router.put('/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  let bookings = readJson('bookings') || [];
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  bookings[index].status = status || bookings[index].status;
  bookings[index].statusUpdatedAt = new Date().toISOString();
  writeJson('bookings', bookings);
  res.json({ success: true, message: 'Booking status updated', data: bookings[index] });
});

// --- PACKAGES MANAGEMENT (CRUD) ---
router.get('/packages', (req, res) => {
  res.json({ success: true, data: readJson('packages') || [] });
});

router.post('/packages', (req, res) => {
  const packages = readJson('packages') || [];
  const newPkg = {
    id: req.body.id || `pkg-${Date.now()}`,
    ...req.body
  };
  packages.push(newPkg);
  writeJson('packages', packages);
  res.json({ success: true, message: 'Package added successfully', data: newPkg });
});

router.put('/packages/:id', (req, res) => {
  let packages = readJson('packages') || [];
  const index = packages.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  packages[index] = { ...packages[index], ...req.body, id: req.params.id };
  writeJson('packages', packages);
  res.json({ success: true, message: 'Package updated successfully', data: packages[index] });
});

router.delete('/packages/:id', (req, res) => {
  let packages = readJson('packages') || [];
  const filtered = packages.filter(item => item.id !== req.params.id);
  writeJson('packages', filtered);
  res.json({ success: true, message: 'Package removed successfully' });
});

// --- SERVICES MANAGEMENT (CRUD) ---
router.get('/services', (req, res) => {
  res.json({ success: true, data: readJson('services') || [] });
});

router.post('/services', (req, res) => {
  const services = readJson('services') || [];
  const newService = {
    id: req.body.id || `service-${Date.now()}`,
    ...req.body
  };
  services.push(newService);
  writeJson('services', services);
  res.json({ success: true, message: 'Service added successfully', data: newService });
});

router.put('/services/:id', (req, res) => {
  let services = readJson('services') || [];
  const index = services.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  services[index] = { ...services[index], ...req.body, id: req.params.id };
  writeJson('services', services);
  res.json({ success: true, message: 'Service updated successfully', data: services[index] });
});

router.delete('/services/:id', (req, res) => {
  let services = readJson('services') || [];
  const filtered = services.filter(item => item.id !== req.params.id);
  writeJson('services', filtered);
  res.json({ success: true, message: 'Service removed successfully' });
});

// --- POPULAR ROUTES DISPLAY LIST ---
router.get('/routes', (req, res) => {
  res.json({ success: true, data: readJson('popularRoutes') || [] });
});

router.put('/routes', (req, res) => {
  const { popularRoutes } = req.body;
  if (Array.isArray(popularRoutes)) {
    writeJson('popularRoutes', popularRoutes);
    return res.json({ success: true, message: 'Popular routes updated successfully', data: popularRoutes });
  }
  res.status(400).json({ success: false, message: 'Invalid routes format' });
});

// --- LOCATIONS MANAGEMENT WITH REGION TYPE (PLAIN / HILL / MIXED) ---
router.get('/locations', (req, res) => {
  res.json({ success: true, data: readJson('popularLocations') || [] });
});

router.put('/locations', (req, res) => {
  const { popularLocations } = req.body;
  if (Array.isArray(popularLocations)) {
    writeJson('popularLocations', popularLocations);
    return res.json({ success: true, message: 'Locations database updated successfully', data: popularLocations });
  }
  res.status(400).json({ success: false, message: 'Invalid locations format' });
});

// --- HOURLY RENTAL PRICING & CITIES ---
router.get('/hourly-rental-pricing', (req, res) => {
  res.json({ success: true, data: readJson('hourlyRentalPricing') || {} });
});

router.put('/hourly-rental-pricing', (req, res) => {
  const current = readJson('hourlyRentalPricing') || {};
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  writeJson('hourlyRentalPricing', updated);
  res.json({ success: true, message: 'Hourly rental pricing and cities updated successfully', data: updated });
});

export default router;
