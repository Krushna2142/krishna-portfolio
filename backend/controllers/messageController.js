import Message from '../models/Message.js';
import sendEmail from '../utils/sendEmail.js';

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await Message.create({ name, email, message });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Message',
      html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error in sendMessage:', err.message);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message' });
  }
};
