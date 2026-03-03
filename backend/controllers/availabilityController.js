const LecturerAvailability = require('../models/LecturerAvailability');

// @desc      Get slots for a specific lecturer
// @route     GET /api/v1/availability/:lecturerId
// @access    Private
exports.getLecturerAvailability = async (req, res) => {
    try {
        const availability = await LecturerAvailability.find({
            lecturerId: req.params.lecturerId,
            // Optional: hide past dates based on req.query
        }).sort('date startTime');

        res.status(200).json({
            success: true,
            count: availability.length,
            data: availability
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Create availability slots
// @route     POST /api/v1/availability
// @access    Private (Lecturer only)
exports.createAvailability = async (req, res) => {
    try {
        // Add user to req.body
        req.body.lecturerId = req.user.id;

        const availability = await LecturerAvailability.create(req.body);

        res.status(201).json({
            success: true,
            data: availability
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Delete an availability slot
// @route     DELETE /api/v1/availability/:id
// @access    Private (Lecturer only)
exports.deleteAvailability = async (req, res) => {
    try {
        const availability = await LecturerAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({ success: false, error: 'Availability not found' });
        }

        // Make sure user is the slot owner
        if (availability.lecturerId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this slot' });
        }

        await availability.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
