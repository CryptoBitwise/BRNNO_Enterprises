import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, getMe } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getUserProfile);
router.get('/me', authenticateToken, getMe);

export default router; 