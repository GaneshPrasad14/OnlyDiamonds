import express from 'express';
import { register, login, getMe, getAllUsers, updateUserData } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-data', protect, updateUserData);
router.get('/users', protect, admin, getAllUsers);

export default router;
