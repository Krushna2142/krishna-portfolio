const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage,
} = require("../controllers/contactController");

// Optional: Middleware to validate MongoDB ObjectID
const mongoose = require("mongoose");
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};

// Routes
router.post("/", sendMessage);               // Send message
router.get("/", getMessages);                // Get all messages
router.put("/:id/read", validateObjectId, markRead); // Mark message as read
router.delete("/:id", validateObjectId, deleteMessage); // Delete message

module.exports = router;
