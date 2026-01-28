import asyncHandler from 'express-async-handler';
import HeroImage from '../models/HeroImage.js';

// @desc    Get all active hero images
// @route   GET /api/hero
// @access  Public
const getHeroImages = asyncHandler(async (req, res) => {
    const images = await HeroImage.find({ isActive: true }).sort({ order: 1 });
    res.json(images);
});

// @desc    Get all hero images (Admin)
// @route   GET /api/hero/admin
// @access  Private/Admin
const getAllHeroImages = asyncHandler(async (req, res) => {
    const images = await HeroImage.find({}).sort({ order: 1 });
    res.json(images);
});

// @desc    Create a hero image
// @route   POST /api/hero
// @access  Private/Admin
const createHeroImage = asyncHandler(async (req, res) => {
    const { title, description, order, titleColor, descriptionColor } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image');
    }

    const image = `uploads/${req.file.filename}`;

    const heroImage = await HeroImage.create({
        title,
        titleColor: titleColor || '#FFFFFF',
        description,
        descriptionColor: descriptionColor || '#FFFFFF',
        image,
        order: order || 0
    });

    res.status(201).json(heroImage);
});

// @desc    Delete hero image
// @route   DELETE /api/hero/:id
// @access  Private/Admin
const deleteHeroImage = asyncHandler(async (req, res) => {
    const heroImage = await HeroImage.findById(req.params.id);

    if (heroImage) {
        await heroImage.deleteOne();
        res.json({ message: 'Hero image removed' });
    } else {
        res.status(404);
        throw new Error('Hero image not found');
    }
});

// @desc    Update hero image status/order
// @route   PUT /api/hero/:id
// @access  Private/Admin
const updateHeroImage = asyncHandler(async (req, res) => {
    const { title, description, order, isActive, titleColor, descriptionColor } = req.body;
    const heroImage = await HeroImage.findById(req.params.id);

    if (heroImage) {
        heroImage.title = title !== undefined ? title : heroImage.title;
        heroImage.titleColor = titleColor || heroImage.titleColor;
        heroImage.description = description !== undefined ? description : heroImage.description;
        heroImage.descriptionColor = descriptionColor || heroImage.descriptionColor;
        heroImage.order = order !== undefined ? order : heroImage.order;
        heroImage.isActive = isActive !== undefined ? isActive : heroImage.isActive;

        if (req.file) {
            heroImage.image = `uploads/${req.file.filename}`;
        }

        const updatedHeroImage = await heroImage.save();
        res.json(updatedHeroImage);
    } else {
        res.status(404);
        throw new Error('Hero image not found');
    }
});

export { getHeroImages, getAllHeroImages, createHeroImage, deleteHeroImage, updateHeroImage };
