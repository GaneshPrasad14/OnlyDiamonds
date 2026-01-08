import asyncHandler from 'express-async-handler';
import DailyWinner from '../models/DailyWinner.js';

// @desc    Get current daily winners (latest)
// @route   GET /api/v1/daily-winners
// @access  Public
const getDailyWinners = asyncHandler(async (req, res) => {
    // Get the latest created entry
    const dailyWinners = await DailyWinner.findOne().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: dailyWinners
    });
});

// @desc    Create or Update daily winners
// @route   POST /api/v1/daily-winners
// @access  Private/Admin
const updateDailyWinners = asyncHandler(async (req, res) => {
    const { winners } = req.body;

    if (!winners || winners.length !== 5) {
        res.status(400);
        throw new Error('Please provide exactly 5 winners');
    }

    // Check if entry for today exists
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let dailyWinner = await DailyWinner.findOne({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    });

    if (dailyWinner) {
        // Update existing
        dailyWinner.winners = winners;
        await dailyWinner.save();
    } else {
        // Create new
        dailyWinner = await DailyWinner.create({
            winners
        });
    }

    res.status(200).json({
        success: true,
        data: dailyWinner
    });
});

export { getDailyWinners, updateDailyWinners };
