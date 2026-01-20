import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    // Validate: Must have Email OR Phone
    if (!email && !phone) {
        res.status(400);
        throw new Error('Please provide either an email or a phone number');
    }

    // Check if user exists (by email or phone)
    let userExists;
    if (email) {
        userExists = await User.findOne({ email });
    }
    if (!userExists && phone) {
        userExists = await User.findOne({ phone });
    }

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body; // identifier can be email or phone

    // Validate email & password
    if (!identifier || !password) {
        res.status(400);
        throw new Error('Please provide an email/phone and password');
    }

    // Check for user by email OR phone
    // We try to find by email first, if not looks like phone
    let user = await User.findOne({ email: identifier }).select('+password');

    if (!user) {
        user = await User.findOne({ phone: identifier }).select('+password');
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }).sort('-createdAt');
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Update user data (Cart/Wishlist)
// @route   PUT /api/v1/auth/update-data
// @access  Private
const updateUserData = asyncHandler(async (req, res) => {
    const { cart, wishlist } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
        if (cart) user.cart = cart;
        if (wishlist) user.wishlist = wishlist;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: updatedUser
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { register, login, getMe, getAllUsers, updateUserData };
