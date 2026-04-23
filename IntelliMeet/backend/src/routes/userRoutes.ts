import { Router } from 'express';
import { toggleStatus, getAssignedStudents, editProfile, getNotifications, markNotificationRead, getLecturers, clearNotifications, removeStudent, updatePushToken, getProfile } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/me', authenticate, getProfile);

router.post('/upload-image', authenticate, upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

router.get('/lecturers', getLecturers); // Public route for registration
router.put('/status', authenticate, toggleStatus);
router.get('/students', authenticate, getAssignedStudents);
router.delete('/students/:studentId', authenticate, removeStudent);
router.put('/profile', authenticate, editProfile);
router.get('/notifications', authenticate, getNotifications);
router.delete('/notifications', authenticate, clearNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationRead);
router.put('/push-token', authenticate, updatePushToken);

export default router;
