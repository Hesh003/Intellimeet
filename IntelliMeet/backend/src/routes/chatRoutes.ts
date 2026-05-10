import { Router } from 'express';
import multer from 'multer';
import { askChatbot } from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/ask', authenticate, upload.single('document'), askChatbot);

export default router;
