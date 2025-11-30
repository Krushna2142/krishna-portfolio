const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Use an environment variable for the frontend origin to avoid hardcoding.
// In Render, set FRONTEND_ORIGIN to: https://krishna-portfolio-peach-one.vercel.app
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://krishna-portfolio-peach-one.vercel.app";

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin requests (origin may be undefined for server-to-server)
    if (!origin || origin === FRONTEND_ORIGIN) return callback(null, true);
    // For troubleshooting you could allow all origins by returning callback(null, true),
    // but DO NOT use that in production. Prefer explicitly listing your frontend.
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware for all routes BEFORE routes are registered
app.use(cors(corsOptions));

// If you still need to match preflight for every path explicitly, use a valid regex.
// (Usually unnecessary when app.use(cors()) is present)
app.options(/.*/, cors(corsOptions)); // valid pattern, not '*'

// Parse JSON bodies
app.use(express.json());

// Optional: lightweight request logger for debugging (safe to keep)
app.use((req, res, next) => {
  console.log("REQ:", { method: req.method, url: req.originalUrl, origin: req.headers.origin });
  next();
});

// Connect DB
connectDB();

// Register routes AFTER cors middleware
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));