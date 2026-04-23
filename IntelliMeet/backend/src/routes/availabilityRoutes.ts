import { Router } from 'express';
import { createAvailability, getAvailabilities, deleteAvailability, getAvailabilityStatus } from '../controllers/availabilityController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createAvailability);
router.get('/', authenticate, getAvailabilities);
router.get('/status', authenticate, getAvailabilityStatus);
router.delete('/:id', authenticate, deleteAvailability);

export default router;
