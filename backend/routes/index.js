import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import goldRateRoutes from './goldRateRoutes.js';
import dailyWinnerRoutes from './dailyWinnerRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "API is healthy" });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/gold-rate', goldRateRoutes);
router.use('/daily-winners', dailyWinnerRoutes);

export default router;
