import mongoose from 'mongoose';

const TaxChargeSchema = mongoose.Schema({
    karat: {
        type: String, // '18K', '20K', '22K', '24K'
        required: true,
        unique: true
    },
    vatPercent: {
        type: Number,
        required: true,
        default: 0
    },
    makingChargePerGram: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('TaxCharge', TaxChargeSchema);
