// controllers/messageController.js

import Message from '../models/messageModel.js';
import nodemailer from 'nodemailer';

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newMessage = await Message.create({ name, email, message });

    // Nodemailer config
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
      subject: 'New Contact Message',
      html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get messages' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting message' });
  }
};
