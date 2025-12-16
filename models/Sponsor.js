import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide sponsor name'],
        trim: true
    },
    logoUrl: {
        type: String,
        required: [true, 'Please provide logo URL']
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    website: {
        type: String,
        trim: true
    },
    tier: {
        type: String,
        enum: ['platinum', 'gold', 'silver', 'bronze', 'partner'],
        default: 'partner'
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
sponsorSchema.index({ tier: 1, order: 1 });
sponsorSchema.index({ active: 1 });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor;
