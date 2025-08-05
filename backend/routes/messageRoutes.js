import express from 'express';
import { sendMessage, getAllMessages, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', getAllMessages);
router.delete('/:id', deleteMessage);

export default router;
