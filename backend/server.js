import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb } from './utils/storage.js';
import authRoutes from './routes/authRoutes.js';
import siteDataRoutes from './routes/siteDataRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import fareRoutes from './routes/fareRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public & Dynamic API Routes
app.use('/api/fare', fareRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/site-data', siteDataRoutes);

// Admin Protected Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Explicit 404 handler for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.method} ${req.originalUrl} not found.` });
});

// Global JSON error handler
app.use((err, req, res, next) => {
  console.error('Express global error handler caught:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Serve frontend static files in production if available
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Initialize storage and seed initial defaults
initDb().then(() => {
  app.listen(PORT, () => {
    console.log('[Server] Happy Tour & Travels API Server running on port ' + PORT);
    console.log('[API] Fare Calculation: http://localhost:' + PORT + '/api/fare/calculate');
    console.log('[API] Bookings: http://localhost:' + PORT + '/api/bookings');
    console.log('[API] Public Site Data: http://localhost:' + PORT + '/api/site-data');
    console.log('[API] Admin Auth: http://localhost:' + PORT + '/api/admin/login');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
