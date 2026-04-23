import { Router } from 'express';
import { bookMeeting, getMeetings, updateMeetingStatus, notifyNextStudent, deleteMeeting, manualAssignMeeting, clearMeeting, directCreateMeeting } from '../controllers/meetingController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/book', authenticate, bookMeeting);
router.post('/manual-assign', authenticate, manualAssignMeeting);
router.post('/direct-create', authenticate, directCreateMeeting);
router.get('/', authenticate, getMeetings);
router.put('/:id/status', authenticate, updateMeetingStatus);
router.put('/:id/clear', authenticate, clearMeeting);
router.post('/notify-next', authenticate, notifyNextStudent);
router.delete('/:id', authenticate, deleteMeeting);

export default router;
