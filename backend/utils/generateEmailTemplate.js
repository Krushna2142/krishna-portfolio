export const generateEmailTemplate = (name, email, message) => {
  return `
    <div style="font-family:sans-serif;padding:20px">
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    </div>
  `;
};
