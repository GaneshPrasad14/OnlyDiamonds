import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).populate('parent', 'name').lean();

    const categoriesWithImages = await Promise.all(categories.map(async (category) => {
        // Try to find a random product in this category
        // Note: usage of 'sample' aggregation might be slow for large collections, 
        // but for this scale it's fine. Alternatively findOne().

        // Using findOne with skip for randomness or just findOne is simpler if we don't need perfect randomness every hit,
        // but let's try to get a random one.

        // Since we store category name in Product.category (as string), we match by name.
        const productCount = await mongoose.model('Product').countDocuments({ category: category.name });
        let image = 'no-photo.jpg';

        if (productCount > 0) {
            const random = Math.floor(Math.random() * productCount);
            const product = await mongoose.model('Product').findOne({ category: category.name }).skip(random).select('image');
            if (product && product.image) {
                image = product.image;
            }
        } else {
            // If no product, keep existing category image or default
            image = category.image || 'no-photo.jpg';
        }

        return {
            ...category,
            image
        };
    }));

    res.json(categoriesWithImages);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('parent', 'name');

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, parent } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : 'no-photo.jpg';

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    let parentId = parent;
    if (parent === 'null' || parent === 'none' || parent === '') {
        parentId = null;
    }

    const category = await Category.create({
        name,
        description,
        parent: parentId,
        image
    });

    if (category) {
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error('Invalid category data');
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;

        if (req.body.parent !== undefined) {
            if (req.body.parent === 'null' || req.body.parent === 'none' || req.body.parent === '') {
                category.parent = null;
            } else {
                category.parent = req.body.parent;
            }
        }

        if (req.file) {
            category.image = `uploads/${req.file.filename}`;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
