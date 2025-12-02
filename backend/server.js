// backend/server.js
// Robust server startup with per-route CORS for public contact and admin endpoints.
// - Loads env via dotenv (Render will inject env variables; local dev uses .env).
// - Normalizes FRONTEND_ORIGIN and ADMIN_FRONTEND_ORIGIN (strips any path to keep only origin).
// - Applies global CORS (combined origins) and per-route CORS for stricter control.
// - Ensures OPTIONS (preflight) for admin routes is allowed before adminAuth runs.
// - Binds to process.env.PORT or process.env.SERVER_PORT (your env uses SERVER_PORT).

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db'); // ensure this exports a function that connects to MongoDB
const contactRoutes = require('./routes/contactRoutes'); // public contact -> send email
const adminRoutes = require('./routes/adminRoutes'); // your admin routes file
const adminAuth = require('./middleware/auth'); // your admin auth middleware (bearer/jwt etc.)

const app = express();

// Connect to DB (log error but let process continue so Render logs show failures)
connectDB().catch(err => {
  console.error('connectDB error:', err && err.stack ? err.stack : err);
});

// parse JSON bodies
app.use(express.json());

// Helper: parse and normalize env origin(s) into pure origins (strip path if present)
// Example: "https://example.com,https://staging.example.com/admin" => ["https://example.com","https://staging.example.com"]
function parseOrigins(envValue) {
  if (!envValue) return [];
  return envValue
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(v => {
      try {
        // If user supplied a URL with path (e.g. https://site.app/admin), new URL gives origin
        const maybe = v.startsWith('http') ? v : `https://${v}`;
        return new URL(maybe).origin;
      } catch (e) {
        // Fallback: attempt to strip path components manually
        const parts = v.split('/');
        if (parts.length >= 3 && parts[0].startsWith('http')) {
          return parts.slice(0, 3).join('/');
        }
        // If we still can't, return as-is (cors will likely reject if invalid)
        return v;
      }
    });
}

const FRONTEND_ORIGINS = parseOrigins(process.env.FRONTEND_ORIGIN);
const ADMIN_FRONTEND_ORIGINS = parseOrigins(process.env.ADMIN_FRONTEND_ORIGIN);

// Build combined origins for a safe global CORS fallback
const combinedOrigins = Array.from(new Set([...FRONTEND_ORIGINS, ...ADMIN_FRONTEND_ORIGINS]));

/** Create cors options for a given allowed origins array */
function createCorsOptions(allowedOrigins) {
  return {
    origin: function (origin, callback) {
      // allow non-browser or same-process requests with no origin (curl/Postman/server)
      if (!origin) return callback(null, true);
      // If no allowed origins configured, allow all (not recommended for production)
      if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
}

// Apply global CORS (combined origins). This handles simple requests and preflight by default.
app.use(cors(createCorsOptions(combinedOrigins)));

// Optional explicit headers (keeps things explicit and compatible)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && combinedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (combinedOrigins.length > 0) {
    res.header('Access-Control-Allow-Origin', combinedOrigins[0]);
  } else {
    // no origins configured: do not set restrictive header
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

/**
 * Public contact/Gmail endpoint:
 * - Use FRONTEND_ORIGINS only (contact form origin)
 * - No admin auth required
 */
const contactCors = cors(createCorsOptions(FRONTEND_ORIGINS));
app.use('/api/contact', contactCors, contactRoutes);

/**
 * Admin endpoints:
 * - Use ADMIN_FRONTEND_ORIGINS only
 * - Ensure OPTIONS preflight is allowed without auth
 * - Then apply adminAuth for protection and mount routes
 */
const adminCors = cors(createCorsOptions(ADMIN_FRONTEND_ORIGINS));

// Ensure OPTIONS passes through for /api/admin before auth
app.use('/api/admin', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Let the global CORS middleware (and contact/adminCors) handle headers; just pass through
    return next();
  }
  return next();
});

// Apply CORS for admin routes, then auth, then admin routes
app.use('/api/admin', adminCors, adminAuth, adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server: respect hosting-provided PORT first (process.env.PORT)
const PORT = process.env.PORT || process.env.SERVER_PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Configured FRONTEND_ORIGINS: ${JSON.stringify(FRONTEND_ORIGINS)}`);
  console.log(`Configured ADMIN_FRONTEND_ORIGINS: ${JSON.stringify(ADMIN_FRONTEND_ORIGINS)}`);
});