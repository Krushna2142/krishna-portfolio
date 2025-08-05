import jwt from 'jsonwebtoken';

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
};
