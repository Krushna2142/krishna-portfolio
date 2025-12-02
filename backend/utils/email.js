// backend/utils/email.js
const nodemailer = require("nodemailer");

const getTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const secure = (process.env.EMAIL_SECURE || "false") === "true";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== "false",
    },
  });

  return transporter;
};

async function sendMail({ to, subject, text, html, from }) {
  const transporter = getTransporter();
  // verify transporter early (optional, helpful in logs)
  try {
    await transporter.verify();
  } catch (err) {
    console.error("Mail transporter verify failed:", err);
    // still try sendMail below so errors are handled upstream
  }

  const info = await transporter.sendMail({
    from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  return info;
}

module.exports = { sendMail };
