import express from 'express';
import { getColorStones, updateColorStone } from '../controllers/colorStoneController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getColorStones);

router.route('/:id')
    .put(protect, admin, updateColorStone);

export default router;
