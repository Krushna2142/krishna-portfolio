// Replace your existing server startup file with this (or integrate the changes)
// Ensure you run `npm install cors` (or `yarn add cors`) before redeploying.

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // keep your db connection logic
const contactRoutes = require('./routes/contactRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // if you have more routes

const app = express();

// Connect to DB
connectDB().catch(err => {
  console.error('connectDB error:', err);
  // don't crash the process here; logging is fine
});

// parse JSON bodies
app.use(express.json());

// CORS configuration
// Set FRONTEND_ORIGIN in Render to: https://krishna-portfolio-peach-one.vercel.app
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'https://krishna-portfolio-peach-one.vercel.app';

// If you need multiple origins, set FRONTEND_ORIGIN to a comma-separated list and parse it here.
const allowedOrigins = frontendOrigin.split(',').map(o => o.trim());

// cors options that will be applied before routes
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true, // allow cookies / credentials if needed
  optionsSuccessStatus: 204,
};

// Apply CORS middleware globally (must be before your routes)
app.use(cors(corsOptions));

// Ensure preflight OPTIONS are handled for all routes
app.options('*', cors(corsOptions));

// (Optional) A small middleware to add headers for older browsers or if you need to debug
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || allowedOrigins[0]);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // remove or set to 'true' only if you require credentials
  // res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Mount routes (after CORS)
app.use('/api/contact', contactRoutes);
// app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});