const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const saved = await Contact.create({ name, email, subject, message, read: false });

    // Respond quickly so frontend is not blocked
    res.json({ success: true, message: 'Message sent!', saved });

    // Send email asynchronously and log result
    (async () => {
      try {
        const info = await sendContactEmail(saved);
        // Log important details — check Render logs for this messageId
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

// Example admin/protected routes — keep auth middleware as needed
router.get('/all', async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, payload: items });
});

router.get('/stats', async (req, res) => {
  const total = await Contact.countDocuments();
  const unread = await Contact.countDocuments({ read: false });
  res.json({ success: true, payload: { total, unread, today: 0 } });
});

router.get('/chart/daily', async (req, res) => {
  // implement or return empty payload if not used
  res.status(404).json({ success: false, message: 'Not implemented' });
});

module.exports = router;