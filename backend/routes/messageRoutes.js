import express from 'express';
import {
  createMessage,
  getMessages,
  deleteMessage,
} from '../controllers/messageController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createMessage);
router.get('/', verifyAdmin, getMessages);
router.delete('/:id', verifyAdmin, deleteMessage);
export default router;
