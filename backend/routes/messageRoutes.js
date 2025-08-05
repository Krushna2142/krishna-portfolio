// routes/messageRoutes.js

import express from 'express';
import { createMessage, getMessages, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage); // Public
router.get('/', protect, getMessages); // Admin only
router.delete('/:id', protect, deleteMessage); // Admin only

export default router;
