import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';
import DiamondSlab from '../models/DiamondSlab.js';
import ColorStone from '../models/ColorStone.js';
import TaxCharge from '../models/TaxCharge.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Helper to calculate price
const calculateProductPrice = async (goldDetails, diamondDetails, colorStoneDetails) => {
    // 1. Get Live Gold Rate
    const goldRateDoc = await GoldRate.findOne().sort({ createdAt: -1 });
    // Normalize key access (e.g. '22kt' vs '22KT' if needed, but assuming strict match from frontend)
    // Frontend sends '22kt', '18kt' etc. Rate DB has keys like '22KT' or '22kt' (Check GoldRate model/controller output)
    // GoldRate output shown earlier: "22KT": 12785. Frontend sends "22kt". Need to upper case for match?
    // User requested "22kt" in TaxCharge, but GoldRate might still use "22KT". 
    // Let's safe match: Try key as is, then Uppercase.

    let currentGoldRate = 0;
    if (goldRateDoc && goldDetails.metalPurity) {
        let purityKey = goldDetails.metalPurity;
        // Try strict, then upper
        if (goldRateDoc.rates[purityKey]) {
            currentGoldRate = goldRateDoc.rates[purityKey];
        } else if (goldRateDoc.rates[purityKey.toUpperCase()]) {
            currentGoldRate = goldRateDoc.rates[purityKey.toUpperCase()];
        }
    }

    // 2. Get Tax & Charges for this Karat
    const taxCharge = await TaxCharge.findOne({ karat: goldDetails.metalPurity });
    const vatPercent = taxCharge ? taxCharge.vatPercent : 0;
    const makingChargePerGram = taxCharge ? taxCharge.makingChargePerGram : 0;

    // 3. Calculate Diamond Cost & Weight
    let totalDiamondPrice = 0;
    let totalDiamondWeight = 0; // Carats
    if (diamondDetails && diamondDetails.length > 0) {
        for (const dia of diamondDetails) {
            const slab = await DiamondSlab.findById(dia.slab);
            if (slab) {
                // dia.weight is per stone? "diamond weight(per carat)" usually means weight per stone or total?
                // User said: "diamond count × diamond weight × price per carat = total price"
                // So dia.weight is Weight Per Stone? Or Total Weight?
                // "diamond count, diamond weight(per carat)" -> likely Weight Per Stone in Carats.
                // Formula: Count * Weight * Rate
                const weight = Number(dia.weight);
                const count = Number(dia.count);
                const totalCts = weight * count;
                totalDiamondWeight += totalCts;

                let rate = 0;
                if (dia.quality === 'EF-VVS') rate = slab.vvsPrice;
                if (dia.quality === 'EF-IF-VVS1') rate = slab.ifPrice;

                totalDiamondPrice += (totalCts * rate);
            }
        }
    }

    // 4. Calculate Stone Cost & Weight
    let totalStonePrice = 0;
    let totalStoneWeight = 0; // Carats
    if (colorStoneDetails && colorStoneDetails.length > 0) {
        for (const stone of colorStoneDetails) {
            const stoneType = await ColorStone.findOne({ type: stone.quality });
            if (stoneType) {
                // "count × weight × price per carat"
                const weight = Number(stone.weight);
                const count = Number(stone.count);
                const totalCts = weight * count;
                totalStoneWeight += totalCts;

                totalStonePrice += (totalCts * stoneType.pricePerCarat);
            }
        }
    }

    // 5. Net Weight Calculation
    // Gross Weight (g) - (Total Carats * 0.2)
    const grossWeight = Number(goldDetails.grossWeight);
    const totalStoneWeightGrams = (totalDiamondWeight + totalStoneWeight) * 0.2;
    const netWeight = grossWeight - totalStoneWeightGrams;

    // 6. Gold Cost
    const goldPrice = netWeight * currentGoldRate;

    // 7. Making Charges
    const makingCharges = netWeight * makingChargePerGram;

    // 8. Value Addition (Wastage)
    // "net weight ... x value add ... x price" -> NetWeight * (VA%/100) * GoldRate
    // vatPercent is stored as generic number, e.g. 15 for 15%? Or 0.15?
    // Usually user enters 15. So /100.
    const wastageCost = netWeight * (vatPercent / 100) * currentGoldRate;

    // 9. Totals
    const subTotal = goldPrice + totalDiamondPrice + totalStonePrice + makingCharges + wastageCost;
    const gst = subTotal * 0.03; // 3% GST
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
            subTotal: Math.round(subTotal),
            gst: Math.round(gst),
            grandTotal: Math.round(grandTotal)
        }
    };
};

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
        goldDetails,
        diamondDetails,
        colorStoneDetails
    } = req.body;

    // Parse JSON strings from FormData
    let parsedGoldDetails = {};
    let parsedDiamondDetails = [];
    let parsedColorStoneDetails = [];

    try {
        if (goldDetails) parsedGoldDetails = JSON.parse(goldDetails);
        if (diamondDetails) parsedDiamondDetails = JSON.parse(diamondDetails);
        if (colorStoneDetails) parsedColorStoneDetails = JSON.parse(colorStoneDetails);
    } catch (e) {
        console.error("Error parsing JSON details:", e);
        res.status(400);
        throw new Error('Invalid JSON format for details');
    }

    // Calculate Price
    const calculation = await calculateProductPrice(parsedGoldDetails, parsedDiamondDetails, parsedColorStoneDetails);

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `uploads/${file.filename}`);
    }

    const product = await Product.create({
        name,
        itemCode,
        description,
        category,
        subcategory,
        price: calculation.price, // Calculated Price
        priceBreakup: calculation.priceBreakup, // Detailed Breakup
        images: imagePaths,
        goldDetails: parsedGoldDetails,
        diamondDetails: parsedDiamondDetails,
        colorStoneDetails: parsedColorStoneDetails
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
        goldDetails,
        diamondDetails,
        colorStoneDetails
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.itemCode = itemCode || product.itemCode;
        product.description = description || product.description;
        product.category = category || product.category;
        product.subcategory = subcategory || product.subcategory;

        // Update details if provided
        // Note: For full recalculation, we basically need the full set of details.
        // If the user updates ONLY goldDetails, we still need existing diamondDetails to calculate Net Weight correctly.
        // So we merge logic: use new if provided, else use existing from DB.

        // Parse new values if they exist
        let newGold = product.goldDetails;
        let newDiamond = product.diamondDetails;
        let newStone = product.colorStoneDetails;

        try {
            if (goldDetails) newGold = JSON.parse(goldDetails);
            if (diamondDetails) newDiamond = JSON.parse(diamondDetails);
            if (colorStoneDetails) newStone = JSON.parse(colorStoneDetails);
        } catch (e) {
            console.error("Error parsing JSON update details:", e);
        }

        // Assign to product
        product.goldDetails = newGold;
        product.diamondDetails = newDiamond;
        product.colorStoneDetails = newStone;

        // Recalculate Price
        const calculation = await calculateProductPrice(newGold, newDiamond, newStone);
        product.price = calculation.price;
        product.priceBreakup = calculation.priceBreakup;

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

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
