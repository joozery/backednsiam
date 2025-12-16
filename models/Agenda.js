import mongoose from 'mongoose';

const agendaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date']
    },
    time: {
        type: String,
        required: [true, 'Please provide a time']
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
        trim: true
    },
    speaker: {
        type: String,
        required: [true, 'Please provide a speaker name'],
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

const Agenda = mongoose.model('Agenda', agendaSchema);

export default Agenda;
