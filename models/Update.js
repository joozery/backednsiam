import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide article title'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, 'Please provide excerpt'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    coverImage: {
        type: String,
        required: [true, 'Please provide cover image']
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Festival Announcement', 'Film Submission', 'Industry News', 'Partnership', 'Event', 'Other'],
        default: 'Other'
    },
    date: {
        type: Date,
        default: Date.now
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        name: {
            type: String,
            default: 'Siamese FilmArt Team'
        },
        avatar: {
            type: String,
            default: '/assets/logo.png'
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create slug from title before saving
updateSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

// Index for faster queries
updateSchema.index({ slug: 1 });
updateSchema.index({ active: 1, date: -1 });
updateSchema.index({ featured: 1 });

const Update = mongoose.model('Update', updateSchema);

export default Update;
