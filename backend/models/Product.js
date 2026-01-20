import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
        required: true,
        unique: true
    },
    productId: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: false,
        default: ''
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    images: {
        type: [String],
        default: []
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    // Gold Details
    goldDetails: {
        grossWeight: { type: Number, required: true, default: 0 },
        metalPurity: { type: String, required: true, enum: ['22kt', '18kt', '14kt', '9kt'] },
        metalColor: { type: String, required: true, enum: ['Rose', 'Yellow', 'White'] },
        dimensions: { type: String, required: false }
    },
    screwType: {
        type: String,
        enum: ['South Screw', 'North Screw'],
        required: false
    },
    // Diamond Details (Array)
    diamondDetails: [{
        quality: { type: String, required: true, enum: ['EF-VVS', 'EF-IF-VVS1'] },
        slab: { type: String, required: true }, // Store Slab Name or ID
        count: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 0 } // User enters TOTAL weight for this row
    }],
    // Color Stone Details (Array)
    colorStoneDetails: [{
        quality: { type: String, required: true, enum: ['Natural Gems', 'Semi Precious', 'Synthetic'] },
        description: { type: String, required: false },
        count: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 0 } // Total weight
    }],
    // Price Breakup (Calculated Automatically)
    priceBreakup: {
        netWeight: { type: Number, default: 0 },
        goldRate: { type: Number, default: 0 }, // Rate used for calculation
        goldPrice: { type: Number, default: 0 }, // Cost of gold content
        diamondPrice: { type: Number, default: 0 },
        stonePrice: { type: Number, default: 0 },
        makingCharges: { type: Number, default: 0 },
        wastage: { type: Number, default: 0 }, // "Value Addition"
        subTotal: { type: Number, default: 0 },
        gst: { type: Number, default: 0 }, // 3%
        grandTotal: { type: Number, default: 0 },
        // Detailed Arrays for Frontend Display
        diamondBreakup: [{
            name: String,
            weight: Number,
            rate: Number,
            price: Number
        }],
        stoneBreakup: [{
            name: String,
            weight: Number,
            rate: Number,
            price: Number
        }]
    },
    // New Pricing Details for Calculation Formula
    pricingDetails: {
        makingChargesPerGram: { type: Number, default: 1000 },
        wastagePercentage: {
            "22kt": { type: Number, default: 20 },
            "18kt": { type: Number, default: 25 },
            "14kt": { type: Number, default: 30 },
            "9kt": { type: Number, default: 35 }
        }
    }
}, {
    timestamps: true
});

// Virtual for backward compatibility
ProductSchema.virtual('image').get(function () {
    return (this.images && this.images.length > 0) ? this.images[0] : '';
});

export default mongoose.model('Product', ProductSchema);
