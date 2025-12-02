// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAuth = require("./middleware/auth");

const app = express();
connectDB();

// --------- FIXED ORIGINS ---------
const allowedOrigins = [
  "https://krishna-portfolio-peach-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// --------- GLOBAL CORS ---------
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --------- FIX: Allow preflight everywhere ---------
app.options("*", cors());

// --------- Body Parser ---------
app.use(express.json());

// --------- PUBLIC CONTACT ROUTE ---------
app.use("/api/contact", contactRoutes);

// --------- ADMIN ROUTES ---------
app.use("/api/admin", adminAuth, adminRoutes);

// --------- Health Check ---------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// --------- Start Server ---------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
