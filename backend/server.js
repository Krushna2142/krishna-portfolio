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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Use CORS for all routes (this automatically handles preflight for most setups)
app.use(cors(corsOptions));

// If you still want an explicit preflight handler, use a wildcard path that Express/path-to-regexp accepts.
// Using '*' caused the PathError; '/ *' (string) or a regex is accepted. Using '/*' is safe.
app.options("/*", cors(corsOptions));

app.use(express.json());

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