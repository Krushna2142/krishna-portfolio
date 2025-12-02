// backend/controllers/contactController.js
const Contact = require("../models/Contact");
const { sendMail } = require("../utils/email");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "All fields required" });
    }

    // Save to DB
    const saved = await Contact.create({
      name,
      email,
      subject,
      message,
      read: false,
    });

    // Admin notification email
    try {
      await sendMail({
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `New contact message from ${name}${subject ? ` — ${subject}` : ""}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "—"}</p>
          <p><strong>Message:</strong></p>
          <p>${(message || "").replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p>Received at: ${new Date(saved.createdAt).toLocaleString()}</p>
        `,
      });
    } catch (mailErr) {
      console.error("Admin notification failed:", mailErr);
      // we don't fail the whole request if email fails — still respond success
    }

    // Auto-reply to user
    try {
      await sendMail({
        to: email,
        subject: `Thanks for contacting Krushna — we received your message`,
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for contacting me. I received your message and will reply as soon as possible.</p>
          <hr/>
          <p><strong>Your message:</strong></p>
          <p>${(message || "").replace(/\n/g, "<br/>")}</p>
          <p style="margin-top:16px">— Krushna</p>
        `,
      });
    } catch (userMailErr) {
      console.error("Auto-reply failed:", userMailErr);
      // ignore error, don't block response
    }

    return res.status(200).json({
      ok: true,
      message: "Message sent successfully",
      payload: saved,
    });
  } catch (err) {
    console.error("Contact sendMessage error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// the rest of admin functions you already have (getAll etc)
exports.getAll = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, payload: messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.markRead = async (req, res) => {
  try {
    const id = req.params.id;
    await Contact.findByIdAndUpdate(id, { read: true });
    return res.status(200).json({ ok: true, message: "Marked as read" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ read: false });

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const today = await Contact.countDocuments({
      createdAt: { $gte: start },
    });

    return res.status(200).json({
      ok: true,
      payload: { total, today, unread },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.getDailyChart = async (req, res) => {
  try {
    const chart = await Contact.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!chart.length) {
      return res.status(200).json({ ok: true, payload: [] });
    }

    return res.status(200).json({ ok: true, payload: chart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
