import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate depth of category (virtual)
CategorySchema.virtual('isSubcategory').get(function () {
    return this.parent !== null;
});

export default mongoose.model('Category', CategorySchema);
