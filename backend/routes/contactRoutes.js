const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/contactController");

// Public route
router.post("/", sendMessage);

module.exports = router;
