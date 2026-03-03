const express = require('express');
const {
    getLecturerAvailability,
    createAvailability,
    deleteAvailability
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(authorize('Lecturer'), createAvailability);

router.route('/:lecturerId')
    .get(getLecturerAvailability);

router.route('/:id')
    .delete(authorize('Lecturer'), deleteAvailability);

module.exports = router;
