import asyncHandler from 'express-async-handler';
import GoldRate from '../models/GoldRate.js';

// @desc    Get latest gold rate
// @route   GET /api/gold-rate
// @access  Public
const getGoldRate = asyncHandler(async (req, res) => {
    const rate = await GoldRate.findOne().sort({ createdAt: -1 });
    if (rate) {
        res.json(rate);
    } else {
        // Return default if no rate set yet
        res.json({
            rates: {
                'diamond_ef_vvs': 0,
                'diamond_ef_if_vvs1': 0,
                '22KT': 0,
                '18KT': 0,
                '14KT': 0,
                '9KT': 0
            },
            updatedAt: new Date()
        });
    }
});

// @desc    Update gold rate
// @route   POST /api/gold-rate
// @access  Private/Admin
const updateGoldRate = asyncHandler(async (req, res) => {
    const { rates } = req.body;

    if (!rates || !rates['22KT']) {
        res.status(400);
        throw new Error('Please provide at least the base 22KT gold rate');
    }

    const goldRate = await GoldRate.create({
        rates
    });

    res.status(201).json(goldRate);
});

export { getGoldRate, updateGoldRate };
