const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ONLY RUN ONCE to create admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await Admin.findOne({ username });
    if (exists) return res.json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({ username, password: hashed });

    res.json({ message: "Admin created" });
  } catch (err) {
    console.error("registerAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    // Debugging: log incoming origin & body so we can confirm browser requests arrive
    console.log("Login request:", {
      method: req.method,
      origin: req.headers.origin,
      body: req.body,
    });

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid username" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment!");
      return res.status(500).json({ message: "Authentication configuration error" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};