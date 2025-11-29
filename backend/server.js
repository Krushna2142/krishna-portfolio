const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

const FRONTEND_ORIGIN = "https://krishna-portfolio-peach-one.vercel.app";

const corsOptions = {
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Use CORS for all routes. This covers preflight handling in normal Express setups.
// Removing explicit app.options(...) avoids path-to-regexp PathError seen in deploy logs.
app.use(cors(corsOptions));

// Add this near the top, after `const app = express();`

// TEMPORARY request logger for debugging CORS/auth issues
app.use(express.json()); // ensure body is parsed for logging
app.use((req, res, next) => {
  console.log("REQ:", {
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    contentType: req.headers["content-type"],
    bodyPreview: req.body && Object.keys(req.body).length ? req.body : undefined,
  });
  next();
});

// Connect DB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

// Render PORT fix
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});