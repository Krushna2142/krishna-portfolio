// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Add every exact frontend origin you want to allow here:
const FRONTEND_ORIGINS = new Set([
  "https://krishna-portfolio-peach-one.vercel.app",
  "https://www.krishna-portfolio-peach-one.vercel.app", // sometimes with www
  "http://localhost:5173",
  "http://localhost:3000"
]);

const corsOptions = {
  origin: (origin, callback) => {
    // `origin` will be undefined for tools like curl/postman or direct server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (FRONTEND_ORIGINS.has(origin)) {
      return callback(null, true);
    }

    // DON'T throw an Error here — return false so browser does not receive CORS headers.
    // We log so you can see the exact origin string to add to FRONTEND_ORIGINS.
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
};

// Use CORS with the options and respond to preflight requests.
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // enable preflight for all routes

// JSON body parsing
app.use(express.json());

// Dev request logger (prints origin so you can verify)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("REQ:", {
      method: req.method,
      url: req.originalUrl,
      origin: req.headers.origin,
      body: req.body && Object.keys(req.body).length ? req.body : undefined,
    });
    next();
  });
}

// DB + routes
connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ Backend Running..."));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err && err.message ? err.message : err);
  res.status(err && err.status ? err.status : 500).json({ error: err?.message || "Server Error" });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
