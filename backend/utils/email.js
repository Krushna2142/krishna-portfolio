const nodemailer = require('nodemailer');

function validateEnv() {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'CONTACT_RECEIVER_EMAIL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.warn('Missing email env vars:', missing);
    // we still allow creation of transporter but will likely fail to connect
  }
}

// Create transporter from env; do NOT default to localhost implicitly
function createTransporter() {
  validateEnv();

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const secure = process.env.EMAIL_SECURE === 'true'; // true for port 465

  if (!host || !port) {
    throw new Error('EMAIL_HOST and EMAIL_PORT must be set in environment');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: !!secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: false,
    debug: false,
    // optional TLS settings:
    tls: {
      // do not fail on invalid certs in some environments (use cautiously)
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false',
    },
  });
}

async function sendContactEmail(contact) {
  const transporter = createTransporter();

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
    subject: `New contact from ${contact.name}`,
    html,
  };

  // Return the transporter.sendMail Promise so caller can log result if desired
  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };