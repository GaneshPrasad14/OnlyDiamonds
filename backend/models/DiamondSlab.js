import mongoose from 'mongoose';

const DiamondSlabSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    minWeight: {
        type: Number,
        required: false
    },
    maxWeight: {
        type: Number,
        required: false
    },
    vvsPrice: {
        type: Number,
        required: true
    },
    ifPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('DiamondSlab', DiamondSlabSchema);
