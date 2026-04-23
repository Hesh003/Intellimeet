import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { 
  getDashboardStats, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getAllSchedules, 
  deleteSchedule,
  getAllMeetings,
  deleteMeeting,
  getNetworkConfig,
  updateNetworkConfig
} from '../controllers/adminController';

const router = Router();

// Network Config 
// Accessible by health check / reporting services
router.get('/config', getNetworkConfig);
router.post('/config', updateNetworkConfig);

// Apply authentication and admin check to all management routes below
router.use(authenticate, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/schedules', getAllSchedules);
router.delete('/schedules/:id', deleteSchedule);
router.get('/meetings', getAllMeetings);
router.delete('/meetings/:id', deleteMeeting);

export default router;
