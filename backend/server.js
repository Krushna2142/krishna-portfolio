require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "https://krishna-portfolio-peach-one.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

const server = http.createServer(app);

const { Server } = require("socket.io");
global.io = new Server(server, {
  cors: { origin: "*" }
});

server.listen(5000, () => console.log("Server running"));
