const Message = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });

    const saved = await Message.create({ name, email, subject, message, read: false });

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
      });
    } catch (emailErr) {
      console.error("Email failed but message saved:", emailErr);
    }

    return res.status(201).json({ success: true, message: "Message sent!", saved });
  } catch (err) {
    console.error("sendMessage:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    console.error("getMessages:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("markRead:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteMessage:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const today = await Message.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    const unread = await Message.countDocuments({ read: false });
    return res.json({ total, today, unread });
  } catch (err) {
    console.error("getStats:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.chartDaily = async (req, res) => {
  try {
    const data = await Message.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return res.json(data);
  } catch (err) {
    console.error("chartDaily:", err);
    return res.status(500).json({ error: err.message });
  }
};
