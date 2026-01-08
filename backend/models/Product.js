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
    // Gold Details
    goldDetails: {
        grossWeight: { type: Number, required: true, default: 0 },
        metalPurity: { type: String, required: true, enum: ['22kt', '18kt', '14kt', '9kt'] },
        metalColor: { type: String, required: true, enum: ['Rose', 'Yellow', 'White'] },
        dimensions: { type: String, required: false }
    },
    // Diamond Details (Array)
    diamondDetails: [{
        quality: { type: String, required: true, enum: ['EF-VVS', 'EF-IF-VVS1'] },
        slab: { type: String, required: true }, // Store Slab Name or ID
        count: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 0 } // Per carat or total? User said "diamond weight(per carat)"
    }],
    // Color Stone Details (Array)
    colorStoneDetails: [{
        quality: { type: String, required: true, enum: ['Natural Gems', 'Semi Precious', 'Synthetic'] },
        description: { type: String, required: false },
        count: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 0 }
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
        grandTotal: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Virtual for backward compatibility
ProductSchema.virtual('image').get(function () {
    return (this.images && this.images.length > 0) ? this.images[0] : '';
});

export default mongoose.model('Product', ProductSchema);
