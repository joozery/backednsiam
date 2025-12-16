import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL']
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['festival', 'exhibition', 'event', 'behind-the-scenes', 'other'],
        default: 'other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    year: {
        type: Number,
        default: () => new Date().getFullYear()
    },
    featured: {
        type: Boolean,
        default: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
gallerySchema.index({ category: 1, year: -1 });
gallerySchema.index({ featured: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
