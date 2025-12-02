const express = require('express');
const router = express.Router();
const socketModule = require('../utils/socket');

// Adjust this import to match your actual Mongoose model file/name
// If your model is named Message or ContactModel, change the require path accordingly.
const Contact = require('../models/Contact'); // <-- ensure this file exists

// GET /api/admin/messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('Error fetching admin messages:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/messages/:id
router.get('/messages/:id', async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) {
    console.error('Error fetching message by id:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    
    // Emit Socket.IO event for real-time updates
    const io = socketModule.getIO();
    if (io) {
      io.emit('message:deleted', { _id: req.params.id });
    }
    
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/messages/:id/read  -> mark as read
router.post('/messages/:id/read', async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found' });
    
    // Emit Socket.IO event for real-time updates
    const io = socketModule.getIO();
    if (io) {
      io.emit('message:updated', updated);
    }
    
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error marking message read:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;