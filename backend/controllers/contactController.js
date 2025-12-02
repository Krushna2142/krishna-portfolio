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

    // Emit Socket.IO event for real-time updates to authenticated admin clients
    if (global.io) {
      global.io.emit("message:created", saved);
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
    const updated = await Contact.findByIdAndUpdate(
      id, 
      { read: true }, 
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Message not found" });
    }

    // Emit Socket.IO event for real-time updates
    if (global.io) {
      global.io.emit("message:updated", updated);
    }

    return res.status(200).json({ ok: true, message: "Marked as read" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Contact.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Message not found" });
    }

    // Emit Socket.IO event for real-time updates
    if (global.io) {
      global.io.emit("message:deleted", { _id: id });
    }

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

// Paginated GET endpoint with search and filter
exports.getPaginated = async (req, res) => {
  try {
    // Parse and validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage) || 10));
    const searchQuery = req.query.q || "";
    const readFilter = req.query.read;

    // Build MongoDB query filter
    const filter = {};

    // Search filter: match name, email, or message (case-insensitive)
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { message: searchRegex },
      ];
    }

    // Read/unread filter
    if (readFilter !== undefined && readFilter !== null && readFilter !== "") {
      if (readFilter === "true" || readFilter === "read") {
        filter.read = true;
      } else if (readFilter === "false" || readFilter === "unread") {
        filter.read = false;
      }
    }

    // Get total count and paginated documents
    const total = await Contact.countDocuments(filter);
    const docs = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      ok: true,
      payload: {
        docs,
        total,
        page,
        perPage,
        totalPages,
      },
    });
  } catch (err) {
    console.error("getPaginated error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// CSV Export endpoint
exports.exportCSV = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const readFilter = req.query.read;

    // Build the same filter as pagination
    const filter = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { message: searchRegex },
      ];
    }

    if (readFilter !== undefined && readFilter !== null && readFilter !== "") {
      if (readFilter === "true" || readFilter === "read") {
        filter.read = true;
      } else if (readFilter === "false" || readFilter === "unread") {
        filter.read = false;
      }
    }

    // Fetch all matching documents (not paginated)
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    // Build CSV content
    const headers = "_id,name,email,message,read,createdAt,updatedAt";
    const rows = contacts.map((contact) => {
      // Escape fields for CSV (handle commas and quotes)
      const escapeCSV = (field) => {
        if (field === null || field === undefined) return "";
        const str = String(field);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        escapeCSV(contact._id),
        escapeCSV(contact.name),
        escapeCSV(contact.email),
        escapeCSV(contact.message),
        escapeCSV(contact.read),
        escapeCSV(contact.createdAt),
        escapeCSV(contact.updatedAt),
      ].join(",");
    });

    const csv = [headers, ...rows].join("\n");

    // Set CSV response headers
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contacts_${timestamp}.csv`
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("exportCSV error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
