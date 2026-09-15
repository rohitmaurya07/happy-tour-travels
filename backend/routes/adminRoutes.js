import express from 'express';
import path from 'path';
import multer from 'multer';
import { readJson, writeJson } from '../utils/storage.js';
import { authMiddleware } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Protect all /api/admin/* endpoints with authMiddleware
router.use(authMiddleware);

// Multer Storage Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit for video & images
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

  const fileUrl = `/uploads/${req.file.filename}`;
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

// --- MEDIA SETTINGS (HERO VIDEO, BANNERS, LOGOS) ---
router.get('/media-settings', (req, res) => {
  res.json({ success: true, data: readJson('mediaSettings') });
});

router.put('/media-settings', (req, res) => {
  const current = readJson('mediaSettings') || {};
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  writeJson('mediaSettings', updated);
  res.json({ success: true, message: 'Media settings and hero video updated successfully', data: updated });
});

// --- FLEET MANAGEMENT (CRUD) ---
router.get('/fleet', (req, res) => {
  res.json({ success: true, data: readJson('fleet') || [] });
});

router.post('/fleet', (req, res) => {
  const fleet = readJson('fleet') || [];
  const newVehicle = {
    id: req.body.id || `car-${Date.now()}`,
    ...req.body,
    rank: Number(req.body.rank) || fleet.length + 1
  };
  fleet.push(newVehicle);
  writeJson('fleet', fleet);
  res.json({ success: true, message: 'Vehicle added to fleet', data: newVehicle });
});

router.put('/fleet/:id', (req, res) => {
  let fleet = readJson('fleet') || [];
  const index = fleet.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  fleet[index] = { ...fleet[index], ...req.body, id: req.params.id };
  writeJson('fleet', fleet);
  res.json({ success: true, message: 'Vehicle updated successfully', data: fleet[index] });
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

// --- ROUTES MANAGEMENT ---
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

// --- LOCATIONS MANAGEMENT ---
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

export default router;
