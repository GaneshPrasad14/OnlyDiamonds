import express from 'express';
import { getGoldRate, updateGoldRate } from '../controllers/goldRateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGoldRate);
router.post('/', protect, admin, updateGoldRate);

export default router;
