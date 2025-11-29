const Message = require("../models/Message");
const nodemailer = require("nodemailer");

// Contact Form Submit
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to DB
    await Message.create({ name, email, message });

    // Email notify
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "Portfolio Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ success: true, message: "Message sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin fetch messages
exports.getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};

// Mark read
exports.markRead = async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
};

// Delete message
exports.deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
