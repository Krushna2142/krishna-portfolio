// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // adjust path as needed
const contactRoutes = require('./routes/contactRoutes'); // public contact -> send email
const adminRoutes = require('./routes/adminRoutes'); // <-- use your existing adminRoutes file
const adminAuth = require('./middleware/auth'); // your auth middleware for admin routes

const app = express();

connectDB().catch(err => {
  console.error('connectDB error:', err);
  // optionally process.exit(1) if you want to stop on DB error
});

// parse JSON bodies
app.use(express.json());

// Environment: set these in Render/Vercel
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const ADMIN_FRONTEND_ORIGIN = (process.env.ADMIN_FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

// Helper to create cors options for allowed origins
function createCorsOptions(allowedOrigins) {
  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.length === 0) return callback(null, true); // no restriction if none configured
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
}

// Global CORS using combined origins (fallback)
const combinedOrigins = Array.from(new Set([...FRONTEND_ORIGIN, ...ADMIN_FRONTEND_ORIGIN]));
app.use(cors(createCorsOptions(combinedOrigins)));
app.options('/*', cors(createCorsOptions(combinedOrigins))); // preflight handler

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

/**
 * Public contact/Gmail endpoint:
 * - Allow only FRONTEND_ORIGIN (contact form origin)
 * - No admin auth
 */
const contactCors = cors(createCorsOptions(FRONTEND_ORIGIN));
app.use('/api/contact', contactCors, contactRoutes);

/**
 * Admin endpoints:
 * - Allow only ADMIN_FRONTEND_ORIGIN
 * - Ensure OPTIONS (preflight) is allowed without auth
 * - Then apply adminAuth for protection
 */
const adminCors = cors(createCorsOptions(ADMIN_FRONTEND_ORIGIN));

// Let OPTIONS pass through before auth
app.use('/api/admin', (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  next();
});

app.use('/api/admin', adminCors); // apply CORS for admin routes
app.use('/api/admin', adminAuth, adminRoutes); // protect admin routes

// Other routes...

// Bind to host-provided port
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});