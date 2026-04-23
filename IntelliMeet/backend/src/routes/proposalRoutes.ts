import { Router } from 'express';
import { submitProposal, getProposals, addFeedback, deleteProposal } from '../controllers/proposalController';
import { authenticate } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure static disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

router.post('/', authenticate, upload.single('document'), submitProposal);
router.get('/', authenticate, getProposals);
router.post('/:id/feedback', authenticate, addFeedback);
router.delete('/:id', authenticate, deleteProposal);

export default router;
