import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';
import DiamondSlab from '../models/DiamondSlab.js';
import ColorStone from '../models/ColorStone.js';
import TaxCharge from '../models/TaxCharge.js';

// Helper to generate 6-digit random alphanumeric ID
const generateProductId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { itemCode: { $regex: req.query.keyword, $options: 'i' } },
            { productId: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Fetch Category Name manually since it's stored as ID String
        const mongoose = await import('mongoose');
        const Category = mongoose.default.model('Category');

        let categoryName = '';
        if (product.category) {
            const cat = await Category.findById(product.category);
            if (cat) categoryName = cat.name;
        }

        const productObj = product.toObject();
        productObj.categoryDetails = { name: categoryName };

        res.json(productObj);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Helper to calculate price
const calculateProductPrice = async (goldDetails, diamondDetails, colorStoneDetails, pricingDetails) => {
    // 1. Get Live Gold Rate
    const goldRateDoc = await GoldRate.findOne().sort({ createdAt: -1 });

    // Safely access purity
    const purityKey = goldDetails.metalPurity ? goldDetails.metalPurity.toLowerCase() : '22kt';

    let currentGoldRate = 0;
    if (goldRateDoc && goldRateDoc.rates) {
        if (goldRateDoc.rates[purityKey]) {
            currentGoldRate = goldRateDoc.rates[purityKey];
        } else {
            // Fallback match
            const rateKey = Object.keys(goldRateDoc.rates).find(k => k.toLowerCase().includes(purityKey.replace("kt", "").replace("k", "")));
            if (rateKey) currentGoldRate = goldRateDoc.rates[rateKey];
        }
    }

    // Get Tax & Charges for Purity (Admin Dashboard Data)
    const taxChargeDoc = await TaxCharge.findOne({ karat: { $regex: new RegExp(`^${purityKey}$`, 'i') } });

    // Making Charges: Use Admin Dashboard (TaxCharge) value if available, else Product specific, else Default
    // User requested "making charge of particular karat", so TaxCharge takes precedence or is the source.
    // However, usually products have specific MC. If pricingDetails has it, we might want to respect it?
    // User said "using the amount given in admin dashboard". TaxCharge is likely the global setting.
    // I will prioritize TaxCharge value if it exists, as that seems to be the "particular karat" logic.
    const makingChargePerGram = taxChargeDoc?.makingChargePerGram || pricingDetails?.makingChargesPerGram || 1000;

    // Wastage (VA)
    const vaMap = pricingDetails?.wastagePercentage || {};
    // Use TaxCharge value as default if available, otherwise 25
    let vaPercentage = vaMap[purityKey] || vaMap[goldDetails.metalPurity] || taxChargeDoc?.vaPercent || 25;

    // 2. Calculate Diamond Cost & Weight
    let totalDiamondPrice = 0;
    let totalDiamondWeight = 0; // Carats
    let diamondBreakup = [];

    if (diamondDetails && diamondDetails.length > 0) {
        for (const dia of diamondDetails) {
            const slab = await DiamondSlab.findById(dia.slab);
            if (slab) {
                const weight = Number(dia.weight);
                const count = Number(dia.count);
                totalDiamondWeight += weight;

                let rate = 0;
                // Normalize quality string (remove spaces, uppercase)
                const qualityNorm = dia.quality.replace(/[\s,]/g, '').toUpperCase();

                if (qualityNorm.includes('VVS') && !qualityNorm.includes('IF')) rate = slab.vvsPrice;
                if (qualityNorm.includes('IF') || qualityNorm.includes('VVS1')) rate = slab.ifPrice;

                const price = weight * rate;
                totalDiamondPrice += price;

                diamondBreakup.push({
                    name: `${dia.quality} (${slab.name})`,
                    weight: weight,
                    rate: rate,
                    price: price
                });
            }
        }
    }

    // 3. Calculate Stone Cost & Weight
    let totalStonePrice = 0;
    let totalStoneWeight = 0; // Carats
    let stoneBreakup = [];

    if (colorStoneDetails && colorStoneDetails.length > 0) {
        for (const stone of colorStoneDetails) {
            // Find Stone Price - using simple logic as fallback
            const stoneType = await ColorStone.findOne({ type: stone.quality });
            let rate = stoneType ? stoneType.pricePerCarat : 0;
            if (!rate) {
                if (stone.quality === 'Natural Gems') rate = 12650;
                if (stone.quality === 'Semi Precious') rate = 6325;
                if (stone.quality === 'Synthetic') rate = 2530;
            }

            const weight = Number(stone.weight);
            totalStoneWeight += weight;
            const price = weight * rate;
            totalStonePrice += price;

            stoneBreakup.push({
                name: stone.quality,
                weight: weight,
                rate: rate,
                price: price
            });
        }
    }

    // 4. Net Weight Calculation
    // 1 Carat = 0.200 Grams
    const grossWeight = Number(goldDetails.grossWeight);
    const diamondWeightGrams = totalDiamondWeight * 0.2;
    const stoneWeightGrams = totalStoneWeight * 0.2;
    const netWeight = Math.max(0, grossWeight - diamondWeightGrams - stoneWeightGrams);

    // 5. Gold Price (On Net Weight)
    const goldPrice = netWeight * currentGoldRate;

    // 6. Value Addition (Wastage) (On Gold Price)
    // Formula: Gold Price * (VA% / 100)
    const wastageCost = goldPrice * (vaPercentage / 100);

    // 7. Making Charges (On Net Weight)
    const makingCharges = netWeight * makingChargePerGram;

    // 8. Certification Cost (Flat fee placeholder)
    const certificationCost = 0; // Default to 0 unless specified in model/logic

    // 9. Totals
    const subTotal = goldPrice + totalDiamondPrice + totalStonePrice + makingCharges + wastageCost + certificationCost;

    // Tax (GST) - Use TaxCharge value or default 3%
    let taxPercent = taxChargeDoc?.vatPercent || 3;
    // Safety check: If taxPercent is > 10 (likely input error per user report), fallback to 3
    if (taxPercent > 10) taxPercent = 3;

    const gst = subTotal * (taxPercent / 100);

    const grandTotal = subTotal + gst;

    return {
        price: Math.round(grandTotal),
        priceBreakup: {
            netWeight: Number(netWeight.toFixed(3)),
            goldRate: currentGoldRate,
            goldPrice: Math.round(goldPrice),
            diamondPrice: Math.round(totalDiamondPrice),
            stonePrice: Math.round(totalStonePrice),
            makingCharges: Math.round(makingCharges),
            wastage: Math.round(wastageCost),
            certificationCost: Math.round(certificationCost),
            subTotal: Math.round(subTotal),
            gst: Math.round(gst),
            grandTotal: Math.round(grandTotal),
            diamondBreakup,
            stoneBreakup
        }
    };
};

// @desc    Calculate price for dynamic products
// @route   POST /api/products/calculate-price
// @access  Public
const calculatePrice = asyncHandler(async (req, res) => {
    // If pricingDetails passed from frontend (simulating), use it.
    // Otherwise it defaults inside the helper (which uses 1000/20% defaults).
    const { goldDetails, diamondDetails, colorStoneDetails, pricingDetails } = req.body;

    const calculation = await calculateProductPrice(goldDetails, diamondDetails, colorStoneDetails, pricingDetails);

    res.json(calculation.priceBreakup);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        itemCode,
        description,
        category,
        subcategory,
        screwType,
        inStock,
        goldDetails,
        diamondDetails,
        colorStoneDetails,
        pricingDetails
    } = req.body;

    // Parse JSON strings from FormData
    let parsedGoldDetails = {};
    let parsedDiamondDetails = [];
    let parsedColorStoneDetails = [];
    let parsedPricingDetails = {};

    try {
        if (goldDetails) parsedGoldDetails = JSON.parse(goldDetails);
        if (diamondDetails) parsedDiamondDetails = JSON.parse(diamondDetails);
        if (colorStoneDetails) parsedColorStoneDetails = JSON.parse(colorStoneDetails);
        if (pricingDetails) parsedPricingDetails = JSON.parse(pricingDetails);
    } catch (e) {
        console.error("Error parsing JSON details:", e);
        res.status(400);
        throw new Error('Invalid JSON format for details');
    }

    // Generate unique Product ID
    let productId = generateProductId();
    let idExists = await Product.findOne({ productId });
    // Retry if collision occurs (unlikely but safe)
    while (idExists) {
        productId = generateProductId();
        idExists = await Product.findOne({ productId });
    }

    // Calculate Price
    const calculation = await calculateProductPrice(parsedGoldDetails, parsedDiamondDetails, parsedColorStoneDetails, parsedPricingDetails);

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `uploads/${file.filename}`);
    }

    const product = await Product.create({
        name,
        itemCode,
        productId,
        description,
        category,
        subcategory,
        screwType: screwType || undefined,
        inStock: inStock !== undefined ? inStock : true,
        price: calculation.price, // Calculated Price incl GST
        priceBreakup: calculation.priceBreakup, // Detailed Breakup
        images: imagePaths,
        goldDetails: parsedGoldDetails,
        diamondDetails: parsedDiamondDetails,
        colorStoneDetails: parsedColorStoneDetails,
        pricingDetails: parsedPricingDetails
    });

    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        itemCode,
        description,
        category,
        subcategory,
        screwType,
        inStock,
        goldDetails,
        diamondDetails,
        colorStoneDetails,
        pricingDetails
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.itemCode = itemCode || product.itemCode;
        product.description = description || product.description;
        product.category = category || product.category;
        product.subcategory = subcategory || product.subcategory;
        if (screwType !== undefined) product.screwType = screwType;
        if (inStock !== undefined) product.inStock = inStock;

        // Ensure productId exists
        if (!product.productId) {
            let pid = generateProductId();
            let exists = await Product.findOne({ productId: pid });
            while (exists) {
                pid = generateProductId();
                exists = await Product.findOne({ productId: pid });
            }
            product.productId = pid;
        }

        // Parse new values if they exist
        let newGold = product.goldDetails;
        let newDiamond = product.diamondDetails;
        let newStone = product.colorStoneDetails;
        let newPricing = product.pricingDetails || {};

        try {
            if (goldDetails) newGold = JSON.parse(goldDetails);
            if (diamondDetails) newDiamond = JSON.parse(diamondDetails);
            if (colorStoneDetails) newStone = JSON.parse(colorStoneDetails);
            if (pricingDetails) newPricing = JSON.parse(pricingDetails);
        } catch (e) {
            console.error("Error parsing JSON update details:", e);
        }

        // Assign to product
        product.goldDetails = newGold;
        product.diamondDetails = newDiamond;
        product.colorStoneDetails = newStone;
        product.pricingDetails = newPricing;

        // Recalculate Price
        const calculation = await calculateProductPrice(newGold, newDiamond, newStone, newPricing);
        product.price = calculation.price;
        product.priceBreakup = calculation.priceBreakup;

        // Handle Images
        if (req.body.existingImages) {
            try {
                product.images = JSON.parse(req.body.existingImages);
            } catch (e) {
                console.error("Error parsing existingImages:", e);
            }
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `uploads/${file.filename}`);
            product.images = [...product.images, ...newImages];
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, calculatePrice };
