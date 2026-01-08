import mongoose from 'mongoose';

const GoldRateSchema = new mongoose.Schema({
    rates: {
        'diamond_ef_vvs': { type: Number, required: true },
        'diamond_ef_if_vvs1': { type: Number, required: true },
        '22KT': { type: Number, required: true },
        '18KT': { type: Number, required: true },
        '14KT': { type: Number, required: true },
        '9KT': { type: Number, required: true }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('GoldRate', GoldRateSchema);
