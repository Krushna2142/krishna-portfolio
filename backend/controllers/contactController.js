const Message = require("../models/Message");
const nodemailer = require("nodemailer");

// Contact form submission
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save message in DB
    const newMessage = await Message.create({ name, email, subject, message, read: false });

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
    });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
