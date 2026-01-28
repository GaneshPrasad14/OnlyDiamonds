import asyncHandler from 'express-async-handler';
import DiamondSlab from '../models/DiamondSlab.js';

// @desc    Get all diamond slabs
// @route   GET /api/diamond-slabs
// @access  Public
const getDiamondSlabs = asyncHandler(async (req, res) => {
    const slabs = await DiamondSlab.find({}).sort({ minWeight: 1 });
    res.json(slabs);
});

// @desc    Create a diamond slab
// @route   POST /api/diamond-slabs
// @access  Private/Admin
const createDiamondSlab = asyncHandler(async (req, res) => {
    const { name, minWeight, maxWeight, vvsPrice } = req.body;

    if (!name || !vvsPrice) {
        res.status(400);
        throw new Error('Please provide name and VVS price');
    }

    // Auto-calculate IF price: VVS + 5000
    const ifPrice = Number(vvsPrice) + 5000;

    const slab = await DiamondSlab.create({
        name,
        minWeight: minWeight || 0,
        maxWeight: maxWeight || 0,
        vvsPrice,
        ifPrice
    });

    res.status(201).json(slab);
});

// @desc    Update diamond slab
// @route   PUT /api/diamond-slabs/:id
// @access  Private/Admin
const updateDiamondSlab = asyncHandler(async (req, res) => {
    const { name, minWeight, maxWeight, vvsPrice } = req.body;
    const slab = await DiamondSlab.findById(req.params.id);

    if (slab) {
        slab.name = name || slab.name;
        slab.minWeight = minWeight !== undefined ? minWeight : slab.minWeight;
        slab.maxWeight = maxWeight !== undefined ? maxWeight : slab.maxWeight;

        if (vvsPrice !== undefined) {
            slab.vvsPrice = Number(vvsPrice);
            // Auto-update IF price if VVS changes
            slab.ifPrice = Number(vvsPrice) + 5000;
        }

        const updatedSlab = await slab.save();
        res.json(updatedSlab);
    } else {
        res.status(404);
        throw new Error('Diamond slab not found');
    }
});

// @desc    Delete diamond slab
// @route   DELETE /api/diamond-slabs/:id
// @access  Private/Admin
const deleteDiamondSlab = asyncHandler(async (req, res) => {
    const slab = await DiamondSlab.findById(req.params.id);

    if (slab) {
        await slab.deleteOne();
        res.json({ message: 'Diamond slab removed' });
    } else {
        res.status(404);
        throw new Error('Diamond slab not found');
    }
});

export { getDiamondSlabs, createDiamondSlab, updateDiamondSlab, deleteDiamondSlab };
