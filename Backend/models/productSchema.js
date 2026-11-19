import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    bookAuthor: {
        type: String,
        default: "",
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        enum: ["New", "Like New", "Good", "Acceptable"],
        default: "Good"
    },
    category: {
        type: String,
        default: "General",
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        default: "",
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;