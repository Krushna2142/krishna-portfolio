// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage,
  getStats,
  chartDaily,
} = require("../controllers/contactController");

const mongoose = require("mongoose");
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};

// Public: send message
router.post("/", sendMessage);

// Protected routes (your admin auth middleware should be applied where needed)
// For simplicity we'll assume admin routes are protected by middleware in adminRoutes
router.get("/all", getMessages);
router.get("/stats", getStats);
router.get("/chart/daily", chartDaily);

router.put("/:id/read", validateObjectId, markRead);
router.delete("/:id", validateObjectId, deleteMessage);

module.exports = router;
