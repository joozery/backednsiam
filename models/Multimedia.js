import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'Please specify media type']
    },
    url: {
        type: String,
        required: [true, 'Please provide media URL']
    },
    thumbnail: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['event', 'exhibition', 'speaker', 'general'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    views: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Multimedia = mongoose.model('Multimedia', multimediaSchema);

export default Multimedia;
