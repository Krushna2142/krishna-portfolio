// backend/controllers/contactController.js
const Contact = require("../models/Contact");
const { sendMail } = require("../utils/email"); // if you use sendMail
const { Parser } = require("json2csv"); // optional; if not installed we'll manual CSV

// Create/save message (client)
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ ok: false, error: "All fields required" });

    const saved = await Contact.create({ name, email, subject, message, read: false });

    // send emails (admin + auto-reply) - use your sendMail util
    try {
      await sendMail({
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `New contact message from ${name}${subject ? ` — ${subject}` : ""}`,
        html: `<h3>${name}</h3><p>${message.replace(/\n/g,"<br/>")}</p><p>${email}</p>`
      });
    } catch (mailErr) {
      console.error("Admin mail failed:", mailErr);
    }
    try {
      await sendMail({
        to: email,
        subject: `Thanks for contacting`,
        html: `<p>Hi ${name},</p><p>Thanks for your message. I'll get back to you soon.</p>`
      });
    } catch (userMailErr) {
      console.error("Auto reply failed:", userMailErr);
    }

    // Emit realtime event
    try {
      if (global.io) global.io.emit("message:created", saved);
    } catch (e) { console.error("Socket emit failed:", e); }

    return res.status(200).json({ ok: true, payload: saved });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// GET with pagination: /api/contact?page=1&perPage=20
exports.getPaginated = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage || "20", 10)));

    const skip = (page - 1) * perPage;

    const [docs, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Contact.countDocuments(),
    ]);

    return res.status(200).json({
      ok: true,
      payload: {
        docs,
        total,
        page,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      },
    });
  } catch (err) {
    console.error("getPaginated error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Backwards compatible: get all (rarely used)
exports.getAll = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, payload: messages });
  } catch (err) {
    console.error("getAll error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Mark read
exports.markRead = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Contact.findByIdAndUpdate(id, { read: true }, { new: true });
    if (global.io) global.io.emit("message:updated", updated);
    return res.status(200).json({ ok: true, payload: updated });
  } catch (err) {
    console.error("markRead error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Contact.findByIdAndDelete(id);
    if (global.io) global.io.emit("message:deleted", { _id: id });
    return res.status(200).json({ ok: true, payload: deleted });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Stats (total,today,unread)
exports.getStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ read: false });
    const start = new Date(); start.setHours(0,0,0,0);
    const today = await Contact.countDocuments({ createdAt: { $gte: start } });
    return res.status(200).json({ ok: true, payload: { total, today, unread }});
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Chart data
exports.getDailyChart = async (req, res) => {
  try {
    const chart = await Contact.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return res.status(200).json({ ok: true, payload: chart });
  } catch (err) {
    console.error("getDailyChart error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Export CSV: /api/contact/export?format=csv
exports.exportCSV = async (req, res) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).lean();
    // Build CSV header
    const header = ["_id","name","email","subject","message","read","createdAt","updatedAt"];
    // Escape function
    const esc = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      if (s.includes(",") || s.includes("\n") || s.includes('"')) return `"${s}"`;
      return s;
    };

    const rows = docs.map(d => header.map(k => esc(d[k])).join(","));
    const csv = [header.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="contacts_${Date.now()}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error("exportCSV error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
