import { Router } from 'express';
import { askChatbot } from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/ask', authenticate, askChatbot);

export default router;
