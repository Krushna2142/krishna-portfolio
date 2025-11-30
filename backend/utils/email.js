const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g. smtp.gmail.com
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendContactEmail(contact) {
  const html = `
    <p>New contact message:</p>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Subject:</strong> ${contact.subject || '-'}</p>
    <p><strong>Message:</strong><br/>${contact.message}</p>
    <p>Received: ${contact.createdAt}</p>
  `;

  const info = await transporter.sendMail({
    from: `"Website" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL, // your admin Gmail
    subject: `New message from ${contact.name}`,
    html,
  });

  return info;
}

module.exports = { sendContactEmail };