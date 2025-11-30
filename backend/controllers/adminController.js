const Admin = require("../models/Admin");
const Message = require("../models/Contact");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password required" });

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ username, password });
    return res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    console.error("registerAdmin:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    console.error("loginAdmin:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const today = await Message.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    const unread = await Message.countDocuments({ read: false });

    const chart = await Message.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.json({ total, today, unread, chart });
  } catch (err) {
    console.error("getDashboardData:", err);
    return res.status(500).json({ error: err.message });
  }
};
