const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LecturerAvailability',
        required: true
    },
    topic: {
        type: String,
        required: [true, 'Please provide a topic for the meeting'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    meetingLink: {
        type: String, // Only populated when Approved
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
