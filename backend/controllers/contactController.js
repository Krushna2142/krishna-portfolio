// controllers/contactController.js
const Message = require("../models/Contact");
const nodemailer = require("nodemailer");

// Contact Form Submit
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });

    // Save to DB
    const saved = await Message.create({ name, email, message, read: false });

    // Email notify (use EMAIL_USER and EMAIL_PASS in .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(201).json({ success: true, message: "Message sent!", saved });
  } catch (err) {
    console.error("sendMessage:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Admin fetch messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    console.error("getMessages:", err);
    return res.status(500).json({ error: err.message });
  }
};

// simple stats endpoint
exports.getStats = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const today = await Message.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const unread = await Message.countDocuments({ read: false });
    return res.json({ total, today, unread });
  } catch (err) {
    console.error("getStats:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Mark read
exports.markRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("markRead:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteMessage:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Chart endpoint: messages per day
exports.chartDaily = async (req, res) => {
  try {
    const data = await Message.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.json(data);
  } catch (err) {
    console.error("chartDaily:", err);
    return res.status(500).json({ error: err.message });
  }
};
