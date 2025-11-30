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
const auth = require("../middleware/auth");

// Contact form
router.post("/", sendMessage);

// Admin routes (protected)
router.get("/", auth, getMessages);
router.patch("/read/:id", auth, markRead);
router.delete("/:id", auth, deleteMessage);
router.get("/stats", auth, getStats);
router.get("/chart", auth, chartDaily);

module.exports = router;
