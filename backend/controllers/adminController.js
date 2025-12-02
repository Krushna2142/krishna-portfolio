// backend/controllers/adminController.js
const Admin = require("../models/Admin"); // assume you have Admin model with { username, passwordHash }
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).json({ ok: true, payload: { token } });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
