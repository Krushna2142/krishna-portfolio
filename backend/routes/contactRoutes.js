const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/email');

// If you have an auth middleware, it will be used; otherwise this noop middleware lets routes work unprotected.
let authMiddleware;
try {
  authMiddleware = require('../middleware/auth');
} catch (err) {
  authMiddleware = (req, res, next) => next();
}

// Create message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const saved = await Contact.create({ name, email, subject, message, read: false });

    // Respond quickly to the client
    res.json({ success: true, message: 'Message sent!', saved });

    // Send email in background and log result
    (async () => {
      try {
        const info = await sendContactEmail(saved);
        console.log('Contact email sent for id', saved._id, 'messageId:', info?.messageId || info);
      } catch (err) {
        console.error('Contact email failed for id', saved._id, err);
      }
    })();
  } catch (err) {
    console.error('Contact save error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: get all messages
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, payload: items });
  } catch (err) {
    console.error('/all error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ read: false });
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = await Contact.countDocuments({ createdAt: { $gte: startOfDay } });
    return res.json({ success: true, payload: { total, unread, today } });
  } catch (err) {
    console.error('/stats error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: chart daily aggregation
router.get('/chart/daily', authMiddleware, async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];
    const data = await Contact.aggregate(pipeline);
    return res.json({ success: true, payload: data });
  } catch (err) {
    console.error('/chart/daily error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: mark read
router.put('/read/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Contact.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, payload: updated });
  } catch (err) {
    console.error('/read/:id error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: delete message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, payload: deleted });
  } catch (err) {
    console.error('DELETE /:id error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;