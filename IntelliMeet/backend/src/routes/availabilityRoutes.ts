import { Router } from 'express';
import { createAvailability, getAvailabilities, deleteAvailability, getAvailabilityStatus, blockDay, getHolidays, updateAvailability } from '../controllers/availabilityController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/holidays', authenticate, getHolidays);
router.post('/', authenticate, createAvailability);
router.post('/block-day', authenticate, blockDay);
router.get('/', authenticate, getAvailabilities);
router.get('/status', authenticate, getAvailabilityStatus);
router.put('/:id', authenticate, updateAvailability);
router.delete('/:id', authenticate, deleteAvailability);

export default router;
