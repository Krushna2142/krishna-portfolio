require('dotenv').config();
const { sendContactEmail } = require('../utils/email');

(async () => {
  try {
    const fake = {
      name: 'Test',
      email: 'test@example.com',
      subject: 'Test subject',
      message: 'Hello from test',
      createdAt: new Date().toISOString(),
    };
    const info = await sendContactEmail(fake);
    console.log('sendTestEmail success:', info);
  } catch (err) {
    console.error('sendTestEmail failed:', err);
  }
})();