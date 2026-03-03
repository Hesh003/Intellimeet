const express = require('express');
const {
    getMeetings,
    createMeeting,
    updateMeetingStatus
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMeetings)
    .post(authorize('Student'), createMeeting);

router.route('/:id/status')
    .put(authorize('Lecturer'), updateMeetingStatus);

module.exports = router;
