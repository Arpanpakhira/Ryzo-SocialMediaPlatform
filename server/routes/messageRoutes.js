import express from 'express';
import { getConversation, sendMessage, markAsSeen, reactToMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:user1/:user2', getConversation);
router.post('/', sendMessage);
router.put('/mark-seen', markAsSeen);
router.put('/react', reactToMessage);

export default router;


