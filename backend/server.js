// backend/server.js
// Robust Express startup with per-route CORS for public contact and admin endpoints.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuth = require('./middleware/auth');

const app = express();

connectDB().catch(err => {
  console.error('connectDB error:', err && err.stack ? err.stack : err);
});

app.use(express.json());

function parseOrigins(envValue) {
  if (!envValue) return [];
  return envValue
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(v => {
      try {
        const maybe = v.startsWith('http') ? v : `https://${v}`;
        return new URL(maybe).origin;
      } catch (e) {
        const parts = v.split('/');
        if (parts.length >= 3 && parts[0].startsWith('http')) {
          return parts.slice(0, 3).join('/');
        }
        return v;
      }
    });
}

const FRONTEND_ORIGINS = parseOrigins(process.env.FRONTEND_ORIGIN);
const ADMIN_FRONTEND_ORIGINS = parseOrigins(process.env.ADMIN_FRONTEND_ORIGIN);
const combinedOrigins = Array.from(new Set([...FRONTEND_ORIGINS, ...ADMIN_FRONTEND_ORIGINS]));

function createCorsOptions(allowedOrigins) {
  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
}

// Global CORS (must be before routes and auth)
app.use(cors(createCorsOptions(combinedOrigins)));

// Optional explicit headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && combinedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (combinedOrigins.length > 0) {
    res.header('Access-Control-Allow-Origin', combinedOrigins[0]);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Public contact endpoint (only FRONTEND origins)
const contactCors = cors(createCorsOptions(FRONTEND_ORIGINS));
app.use('/api/contact', contactCors, contactRoutes);

// Admin endpoints (only ADMIN_FRONTEND_ORIGINS). Ensure OPTIONS is allowed before auth.
const adminCors = cors(createCorsOptions(ADMIN_FRONTEND_ORIGINS));
app.use('/api/admin', (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  next();
});
app.use('/api/admin', adminCors, adminAuth, adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Configured FRONTEND_ORIGINS:', JSON.stringify(FRONTEND_ORIGINS));
  console.log('Configured ADMIN_FRONTEND_ORIGINS:', JSON.stringify(ADMIN_FRONTEND_ORIGINS));
});