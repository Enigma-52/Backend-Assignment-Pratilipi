import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/profile', authenticateJWT, UserController.updateProfile);

export { router as userRouter };