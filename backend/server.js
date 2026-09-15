import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './utils/storage.js';
import authRoutes from './routes/authRoutes.js';
import siteDataRoutes from './routes/siteDataRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-data', siteDataRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Initialize storage and seed initial defaults
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`?? Happy Tour & Travels API Server running on port ${PORT}`);
    console.log(`?? Public Site Data: http://localhost:${PORT}/api/site-data`);
    console.log(`?? Admin Auth: http://localhost:${PORT}/api/admin/login`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
