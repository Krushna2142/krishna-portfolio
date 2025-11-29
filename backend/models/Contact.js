const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
