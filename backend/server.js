import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // Allow all frontend domains
}));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// CONTACT API ROUTE
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, msg: "All fields required" });
  }

  try {
    // Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail Details
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, msg: "Message sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, msg: "Failed to send email" });
  }
});

// PORT for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
