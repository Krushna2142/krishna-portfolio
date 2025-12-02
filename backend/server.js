// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAuth = require("./middleware/auth");

const app = express();
const server = http.createServer(app);
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

// --------- Socket.IO Setup with JWT Authentication ---------
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow no-origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// JWT Authentication middleware for Socket.IO
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify JWT token using the same secret as HTTP auth
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET);
    
    // Attach decoded user info to socket
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.error("Socket.IO authentication error:", err.message);
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Authenticated client connected:", socket.data.user);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io globally accessible for controllers
global.io = io;

// --------- Start Server ---------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
