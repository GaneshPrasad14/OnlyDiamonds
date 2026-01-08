import mongoose from 'mongoose';

const ColorStoneSchema = mongoose.Schema({
    type: {
        type: String, // 'Natural Gems', 'Semi Precious', 'Synthetic'
        required: true,
        unique: true
    },
    pricePerCarat: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('ColorStone', ColorStoneSchema);
