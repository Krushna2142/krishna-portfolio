const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }, // for admin dashboard
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Message", messageSchema);
