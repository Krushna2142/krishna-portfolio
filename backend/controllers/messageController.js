// controllers/messageController.js
const Message = require('../models/messageModel');
const nodemailer = require('nodemailer');

const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Save message to MongoDB
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Message from Portfolio',
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error in getAllMessages:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  deleteMessage,
};
