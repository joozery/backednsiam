import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    organization: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    photo: {
        type: String
    },
    expertise: [{
        type: String,
        trim: true
    }],
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        website: String
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Speaker = mongoose.model('Speaker', speakerSchema);

export default Speaker;
