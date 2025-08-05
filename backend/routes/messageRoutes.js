import express from 'express';
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from '../controllers/messageController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/', verifyAdmin, getMessages);
router.delete('/:id', verifyAdmin, deleteMessage);

export default router;
