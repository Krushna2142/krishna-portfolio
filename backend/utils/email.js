const nodemailer = require('nodemailer');

function requiredEnv() {
  return ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'CONTACT_RECEIVER_EMAIL'];
}

function validateEnv() {
  const missing = requiredEnv().filter(k => !process.env[k]);
  if (missing.length) {
    console.warn('Missing email env vars:', missing);
  }
}

// Create transporter and verify connection
async function createTransporter() {
  validateEnv();

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const secure = process.env.EMAIL_SECURE === 'true'; // true for 465

  if (!host || !port) {
    throw new Error('EMAIL_HOST and EMAIL_PORT must be set in environment');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: !!secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,   // enable logging
    debug: true,    // show debug output
    tls: {
      // set rejectUnauthorized to false only for debugging self-signed cert issues
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false',
    },
    connectionTimeout: 30_000,
  });

  // verify transporter (will throw on connection or auth errors)
  await transporter.verify();
  console.log('Nodemailer transporter verified (connected to SMTP server)');
  return transporter;
}

async function sendContactEmail(contact) {
  const transporter = await createTransporter();

  const html = `
    <h3>New contact message</h3>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Subject:</strong> ${contact.subject || '-'}</p>
    <p><strong>Message:</strong><br/>${contact.message}</p>
    <p>Received: ${contact.createdAt}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    replyTo: contact.email,
    subject: `New contact from ${contact.name}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendContactEmail };