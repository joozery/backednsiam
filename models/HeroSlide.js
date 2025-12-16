import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide slide title'],
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide image URL']
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        default: 'Learn More'
    },
    buttonLink: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
heroSlideSchema.index({ order: 1 });
heroSlideSchema.index({ active: 1 });

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

export default HeroSlide;
