import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import messageRoutes from './routes/messageRoutes.js'; // ✅

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ API Route
app.use('/api/messages', messageRoutes);

// ✅ Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
