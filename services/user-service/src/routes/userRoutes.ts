import express from 'express';
import { registerUser, loginUser, updateUserProfile, getUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/profile', authenticateToken, getUserProfile);

export default router;