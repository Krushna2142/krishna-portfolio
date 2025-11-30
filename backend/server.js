// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Frontend origins allowed for CORS
const FRONTEND_ORIGINS = [
  "https://krishna-portfolio-peach-one.vercel.app",
  "http://localhost:5173"
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server or curl requests
      if (FRONTEND_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("REQ:", {
      method: req.method,
      url: req.originalUrl,
      origin: req.headers.origin,
      body: req.body,
    });
    next();
  });
}

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ Backend Running..."));

// Global error handler for CORS and other errors
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
