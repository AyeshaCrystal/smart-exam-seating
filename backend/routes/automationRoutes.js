const express = require('express');
const router = express.Router();
const { generateTimetable, allocateInvigilators } = require('../controllers/automationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/timetable', protect, generateTimetable);
router.post('/invigilators', protect, allocateInvigilators);

module.exports = router;
