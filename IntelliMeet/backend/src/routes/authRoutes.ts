import { Router } from 'express';
import { register, login, getSupervisors } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/supervisors', getSupervisors);

export default router;
