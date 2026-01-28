import express from 'express';
import { getDailyWinners, updateDailyWinners } from '../controllers/dailyWinnerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getDailyWinners)
    .post(protect, admin, updateDailyWinners);

export default router;
