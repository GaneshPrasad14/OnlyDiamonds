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
        // Matches existing logic: "want the categories in the home section to pick random images from it's own category product"

        // Find a product with this category id (stored as string in product.category)
        // or by name if legacy? The Product model says 'category' is Type String.
        // In AddProduct, we save the category ID. So we should search by category ID.
        // But the previous implementation (commented) checked by `category.name`. 
        // I will check by `category._id` (stringified).

        const productCount = await mongoose.model('Product').countDocuments({ category: category._id });
        let image = category.image || 'no-photo.jpg';

        if (productCount > 0) {
            const random = Math.floor(Math.random() * productCount);
            const product = await mongoose.model('Product').findOne({ category: category._id }).skip(random).select('images');

            // Prefer product image
            if (product && product.images && product.images.length > 0) {
                // Ensure image path handling matches frontend expectation
                const pImg = product.images[0];
                if (pImg) image = pImg;
            }
        }

        // Fallback to category image if no product image found
        // Logic: Requested "pick random images from it's own category product"
        // If product has image, use it. Else use category image.

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
