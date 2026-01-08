import asyncHandler from 'express-async-handler';
import ColorStone from '../models/ColorStone.js';

// @desc    Get all color stone prices
// @route   GET /api/color-stones
// @access  Public
const getColorStones = asyncHandler(async (req, res) => {
    // Ensure default types exist
    const defaultTypes = ['Natural Gems', 'Semi Precious', 'Synthetic'];

    for (const type of defaultTypes) {
        const exists = await ColorStone.findOne({ type });
        if (!exists) {
            await ColorStone.create({ type, pricePerCarat: 0 });
        }
    }

    const stones = await ColorStone.find({});
    res.json(stones);
});

// @desc    Update color stone price
// @route   PUT /api/color-stones/:id
// @access  Private/Admin
const updateColorStone = asyncHandler(async (req, res) => {
    const { pricePerCarat } = req.body;
    const stone = await ColorStone.findById(req.params.id);

    if (stone) {
        stone.pricePerCarat = pricePerCarat;
        const updatedStone = await stone.save();
        res.json(updatedStone);
    } else {
        res.status(404);
        throw new Error('Stone type not found');
    }
});

export { getColorStones, updateColorStone };
