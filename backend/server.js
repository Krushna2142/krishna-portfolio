import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio backend running 🚀");
});

// POST ROUTE
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject || "New Portfolio Message",
      html: `
        <h3>You got a new message from your portfolio website</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: "Error sending email" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
