// controllers/messageController.js
import Message from '../models/messageModel.js';
import nodemailer from 'nodemailer';

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Message',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Message not sent' });
  }
};

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
};
