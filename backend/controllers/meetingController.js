const Meeting = require('../models/Meeting');
const LecturerAvailability = require('../models/LecturerAvailability');

// @desc      Get meetings for current user
// @route     GET /api/v1/meetings
// @access    Private
exports.getMeetings = async (req, res) => {
    try {
        let query;

        if (req.user.role === 'Student') {
            query = Meeting.find({ studentId: req.user.id }).populate('lecturerId', 'fullName email').populate('availabilityId');
        } else if (req.user.role === 'Lecturer') {
            query = Meeting.find({ lecturerId: req.user.id }).populate('studentId', 'fullName email idNumber').populate('availabilityId');
        } else {
            return res.status(401).json({ success: false, error: 'Unauthorized role' });
        }

        const meetings = await query.sort('-createdAt');

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Request (Book) a meeting
// @route     POST /api/v1/meetings
// @access    Private (Student only)
exports.createMeeting = async (req, res) => {
    try {
        req.body.studentId = req.user.id;

        // Check if slot exists and is not booked
        const slot = await LecturerAvailability.findById(req.body.availabilityId);

        if (!slot) {
            return res.status(404).json({ success: false, error: 'Availability slot not found' });
        }

        if (slot.isBooked) {
            return res.status(400).json({ success: false, error: 'Slot is already booked' });
        }

        const meeting = await Meeting.create(req.body);

        res.status(201).json({
            success: true,
            data: meeting
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Update Meeting Status (Approve/Reject)
// @route     PUT /api/v1/meetings/:id/status
// @access    Private (Lecturer only)
exports.updateMeetingStatus = async (req, res) => {
    try {
        let meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ success: false, error: 'Meeting not found' });
        }

        // Make sure user is the meeting lecturer
        if (meeting.lecturerId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this meeting' });
        }

        const { status, meetingLink } = req.body;

        meeting = await Meeting.findByIdAndUpdate(req.params.id, {
            status,
            meetingLink: meetingLink || meeting.meetingLink
        }, {
            new: true,
            runValidators: true
        });

        // Handle slot locking/unlocking based on status
        const slot = await LecturerAvailability.findById(meeting.availabilityId);
        if (slot) {
            if (status === 'Approved') {
                slot.isBooked = true;
            } else if (status === 'Rejected' || status === 'Cancelled') {
                slot.isBooked = false;
            }
            await slot.save();
        }

        res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
