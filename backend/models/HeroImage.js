import mongoose from 'mongoose';

const HeroImageSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    titleColor: {
        type: String,
        default: '#FFFFFF'
    },
    description: {
        type: String,
        required: false
    },
    descriptionColor: {
        type: String,
        default: '#FFFFFF'
    },
    image: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('HeroImage', HeroImageSchema);
