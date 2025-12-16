import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
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
    country: {
        type: String,
        trim: true
    },
    participantType: {
        type: String,
        enum: ['attendee', 'exhibitor', 'speaker', 'student'],
        default: 'attendee'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    checkedInAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['registered', 'confirmed', 'cancelled'],
        default: 'registered'
    }
}, {
    timestamps: true
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
