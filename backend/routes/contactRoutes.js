const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage
} = require("../controllers/contactController");

router.post("/send", sendMessage);
router.get("/all", getMessages);
router.put("/read/:id", markRead);
router.delete("/delete/:id", deleteMessage);

module.exports = router;
