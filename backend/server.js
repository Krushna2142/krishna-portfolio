const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
connectDB();

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.ADMIN_FRONTEND_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : "*",
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
