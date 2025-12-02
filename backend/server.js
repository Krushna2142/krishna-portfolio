// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // adjust path as needed
const contactRoutes = require('./routes/contactRoutes'); // public contact -> send email
const adminMessageRoutes = require('./routes/adminMessageRoutes'); // admin message endpoints
const adminAuth = require('./middleware/auth'); // your auth middleware for admin routes

const app = express();

connectDB().catch(err => {
  console.error('connectDB error:', err);
  // optionally process.exit(1) if you want to stop on DB error
});

// parse JSON bodies
app.use(express.json());

// Environment: set these in Render/Vercel
// Example:
// FRONTEND_ORIGIN="https://krishna-portfolio-peach-one.vercel.app"
// ADMIN_FRONTEND_ORIGIN="https://krishna-portfolio-peach-one.vercel.app" (or admin-specific domain)
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const ADMIN_FRONTEND_ORIGIN = (process.env.ADMIN_FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

// Generic helper to create cors options for allowed origins list
function createCorsOptions(allowedOrigins) {
  return {
    origin: function (origin, callback) {
      // Allow non-browser clients (curl/postman) with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // if no allowed origins configured, default to allow all (not recommended)
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

// Global CORS middleware using combined origins (safe fallback)
// This ensures simple GET requests from either origin are accepted.
// For stricter control we also apply per-route cors below.
const combinedOrigins = Array.from(new Set([...FRONTEND_ORIGIN, ...ADMIN_FRONTEND_ORIGIN]));
app.use(cors(createCorsOptions(combinedOrigins)));

// Correct preflight handler (use '/*' not '*')
app.options('/*', cors(createCorsOptions(combinedOrigins)));

// Optional: quick headers fallback (keeps things explicit)
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
 * Routes
 *
 * Public contact/Gmail endpoint:
 * - Allow only FRONTEND_ORIGIN (contact form origin)
 * - No admin auth
 */
const contactCors = cors(createCorsOptions(FRONTEND_ORIGIN));
app.use('/api/contact', contactCors, contactRoutes);

/**
 * Admin messages endpoints:
 * - Allow only ADMIN_FRONTEND_ORIGIN (admin UI origin)
 * - Apply auth middleware (but allow OPTIONS to pass through without auth)
 */
const adminCors = cors(createCorsOptions(ADMIN_FRONTEND_ORIGIN));

// If using auth middleware that blocks all requests, ensure OPTIONS goes through
app.use('/api/admin', (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // let preflight through
  next();
});

app.use('/api/admin', adminCors); // apply CORS for admin routes
app.use('/api/admin', adminAuth, adminMessageRoutes); // then protect admin routes

// Mount other routes as needed...

// Start server: bind to host-provided PORT
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});