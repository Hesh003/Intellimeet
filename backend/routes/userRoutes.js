const express = require('express');
const { getMe, getLecturers } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.get('/lecturers', getLecturers);

module.exports = router;
