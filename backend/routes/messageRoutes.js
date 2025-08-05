import express from 'express';
import {
  createMessage,
  getMessages,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage); // ✅ POST /api/messages
router.get('/', getMessages);    // ✅ GET /api/messages
router.delete('/:id', deleteMessage); // ✅ DELETE /api/messages/:id

export default router;
