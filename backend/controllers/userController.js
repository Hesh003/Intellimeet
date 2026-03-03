const User = require('../models/User');

// @desc      Get current logged in user
// @route     GET /api/v1/users/me
// @access    Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Get all lecturers
// @route     GET /api/v1/users/lecturers
// @access    Private (Student or Admin)
exports.getLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: 'Lecturer' }).select('fullName email');

        res.status(200).json({
            success: true,
            count: lecturers.length,
            data: lecturers
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
