// Usage: run locally with .env present or run as a one-off on the host:
// node backend/scripts/sendTestEmail.js

require('dotenv').config();
const { sendContactEmail } = require('../utils/email');

(async () => {
  try {
    const fake = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Hello from sendTestEmail.js',
      createdAt: new Date().toISOString(),
    };
    const info = await sendContactEmail(fake);
    console.log('sendTestEmail success:', info);
  } catch (err) {
    // print full error and helpful fields
    console.error('sendTestEmail failed:', err && err.stack ? err.stack : err);
    if (err?.response) console.error('smtp-response:', err.response);
  }
})();