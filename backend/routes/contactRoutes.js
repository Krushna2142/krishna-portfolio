const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // adjust path
const { sendContactEmail } = require('../utils/email'); // helper below
const authMiddleware = require('../middleware/auth'); // if you protect admin routes

// Public: create message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const saved = await Contact.create({ name, email, subject, message, read: false });

    // Respond immediately so the user sees success quickly
    res.json({ success: true, message: 'Message sent!', saved });

    // Then send email asynchronously (do NOT await before responding)
    (async () => {
      try {
        await sendContactEmail(saved);
        console.log('Contact email sent for id', saved._id);
      } catch (err) {
        console.error('Contact email failed for id', saved._id, err);
      }
    })();

    return;
  } catch (err) {
    console.error('Contact save error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Protected admin routes (example)
router.get('/all', authMiddleware, async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, payload: items });
});

router.get('/stats', authMiddleware, async (req, res) => {
  // return some basic stats
  const total = await Contact.countDocuments();
  const unread = await Contact.countDocuments({ read: false });
  res.json({ success: true, payload: { total, unread } });
});

router.get('/chart/daily', authMiddleware, async (req, res) => {
  // Example: group by day for last 7 days
  const pipeline = [
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
  const data = await Contact.aggregate(pipeline);
  res.json({ success: true, payload: data });
});

module.exports = router;