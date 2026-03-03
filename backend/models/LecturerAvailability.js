const mongoose = require('mongoose');

const LecturerAvailabilitySchema = new mongoose.Schema({
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    startTime: {
        type: String, // E.g. "09:00 AM"
        required: [true, 'Please add a start time']
    },
    endTime: {
        type: String, // E.g. "10:00 AM"
        required: [true, 'Please add an end time']
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LecturerAvailability', LecturerAvailabilitySchema);
